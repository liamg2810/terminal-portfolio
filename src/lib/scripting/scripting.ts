import { terminalState } from "$lib/terminal/terminal.svelte";
import { Command, parseCommand, registerCommand } from "../commands/command";
import {
	gotoLine,
	handleForLoop,
	handleIf,
	handleNextLoop,
	handlePrint,
	handleSleep,
	listLines,
	renumberLines,
} from "./builtins";
import {
	CallFunction,
	EndFunction,
	FindFunctions,
	StepOverFunction,
} from "./functions";
import {
	delay,
	findNextLineNumber,
	FindPairedElse,
	FindPairedEndIf,
	ThrowError,
} from "./utils";
import {
	clearVars,
	deleteVariable,
	finishHandleInput,
	getVar,
	handleInput,
	handleLet,
	handleVariableCommand,
} from "./vars";

export let lines: Map<number, string> = new Map();

export let currentLine = 0;

export function addLine(lineNumber: number, command: string) {
	lines.set(lineNumber, command);

	if (command === "") {
		lines.delete(lineNumber);
	}

	orderLines();
}

export function setLines(newLines: Map<number, string>) {
	lines = new Map(newLines);
	orderLines();
}

export function setCurrentLine(lineNumber: number) {
	const maxLineNumber = Math.max(...Array.from(lines.keys()), 0);

	if (lineNumber > maxLineNumber) {
		// Exit gracefully
		terminalState.executingScript = false;
	}

	if (lineNumber < 0) {
		ThrowError(`Line number cannot be negative.`, (message) => {
			terminalState.lines.push({
				type: "response",
				value: message,
			});
		});
		return;
	}

	if (lines.has(lineNumber)) {
		currentLine = lineNumber;
	}

	currentLine = Math.max(0, currentLine);
}

function orderLines() {
	lines = new Map(Array.from(lines.entries()).sort((a, b) => a[0] - b[0]));
}

async function ManageCommand(
	lineNum: number,
	line: string,
	output: (message: string) => void
) {
	if (line.trim().startsWith("#") || line.trim() === "") {
		// Ignore comments and empty lines
		return;
	}

	const parts = line.split(" ");
	const commandName = parts[0];
	const args = parts.slice(1);

	const cmd = parseCommand(line);

	if (cmd) {
		cmd.run(line);
		return;
	}

	if (commandName === "end") {
		terminalState.executingScript = false;
		return;
	}

	if (commandName === "let") {
		handleLet(args.join(" "), output);
		return;
	}

	if (commandName === "input") {
		handleInput(args.join(" "), output);
		return;
	}

	if (commandName === "def") {
		StepOverFunction(args, output);
		return;
	}

	if (commandName === "sleep") {
		await handleSleep(args.join(" "), output);
		return;
	}

	if (commandName === "enddef") {
		EndFunction(output);
		return;
	}

	if (commandName === "call") {
		CallFunction(args[0], output);
		return;
	}

	if (commandName === "goto") {
		gotoLine(args, output);
		return;
	}

	if (commandName === "del") {
		deleteVariable(args.join(" "), output);
		return;
	}

	if (commandName === "for") {
		handleForLoop(args.join(" "), output);
		return;
	}

	if (commandName === "next") {
		handleNextLoop(output);
		return;
	}

	if (commandName === "sleep") {
		if (args.length === 0 || isNaN(parseInt(args[0]))) {
			terminalState.lines.push({
				type: "response",
				value: `Please provide a valid sleep duration in milliseconds. Line ${lineNum}`,
			});
			return;
		}
		const sleepDuration = parseInt(args[0]);
		delay(sleepDuration);
		return;
	}

	if (commandName === "print") {
		handlePrint(args.join(" "), output);
		return;
	}

	if (commandName === "else") {
		const nextIfLine = FindPairedEndIf(lineNum);
		if (nextIfLine !== null) {
			currentLine = nextIfLine + 1;
		} else {
			ThrowError(`No matching endif found for else statement.`, output);
			terminalState.executingScript = false;
			return;
		}
		return;
	}

	if (commandName === "endif") {
		// These commands are handled in the if command logic
		return;
	}

	if (commandName === "if") {
		const conditionMet = handleIf(args.join(" "), output);

		if (!conditionMet) {
			const nextElseLine = FindPairedElse(lineNum);
			const nextEndIfLine = FindPairedEndIf(lineNum);

			if (
				nextElseLine !== null &&
				(nextEndIfLine === null || nextElseLine < nextEndIfLine)
			) {
				// There's an else block before the endif, jump to the else
				currentLine =
					findNextLineNumber(nextElseLine) || nextElseLine + 1;
			} else if (nextEndIfLine !== null) {
				// No else block (or else comes after endif somehow), jump past the endif
				currentLine =
					findNextLineNumber(nextEndIfLine) || nextEndIfLine + 1;
			} else {
				ThrowError("No matching endif found for if statement.", output);
				terminalState.executingScript = false;
				return;
			}
		}
		return;
	}

	if (getVar(commandName) !== undefined) {
		handleVariableCommand(line, output);
		return;
	}
	ThrowError(`Unknown command "${commandName}".`, output);
}

async function runScript(args: string[], output: (message: string) => void) {
	const orderedLines: Map<number, string> = new Map(
		Array.from(lines.entries()).sort((a, b) => a[0] - b[0])
	);

	clearVars();

	const largestLineNumber =
		orderedLines.size > 0
			? Math.max(...Array.from(orderedLines.keys()))
			: 0;

	currentLine = 0;
	terminalState.executingScript = true;

	FindFunctions(output);

	while (currentLine <= largestLineNumber && terminalState.executingScript) {
		if (!orderedLines.has(currentLine)) {
			const nextLine =
				findNextLineNumber(currentLine) || largestLineNumber + 1;
			currentLine = nextLine;
			continue;
		}

		const command = orderedLines.get(currentLine);
		const originalLine = currentLine;

		if (command) {
			await ManageCommand(currentLine, command, output);
		} else {
			console.warn(`No command to execute for line ${currentLine}`);
		}

		const isAwaitingForInput = terminalState.awaitingInput;

		while (terminalState.awaitingInput) {
			// Wait for input to be handled
			await delay(0);
		}

		if (isAwaitingForInput) {
			finishHandleInput(output);
		}

		// Only advance to next line if currentLine wasn't changed by a jump command
		if (currentLine === originalLine) {
			const nextLine =
				findNextLineNumber(currentLine) || largestLineNumber + 1;
			currentLine = nextLine;
		}

		// Scroll to the bottom of the terminal to show the latest output
		window.scrollTo(0, document.body.scrollHeight);

		await delay(0);
	}

	terminalState.executingScript = false;
}

export function HaltScript() {
	if (!terminalState.executingScript) {
		return;
	}

	terminalState.executingScript = false;
	terminalState.awaitingInput = false;
	terminalState.inputValue = "";

	terminalState.lines.push({
		type: "response",
		value: `Script execution forcibly stopped at line ${currentLine}.`,
	});
}

function openDocs() {
	window.open("/docs", "_blank");
	terminalState.lines.push({
		type: "response",
		value: `Documentation opened in a new tab.`,
	});
}

export function RegisterRunScript(output: (message: string) => void) {
	const runScriptCommand = new Command((args: string[]) => {
		runScript(args, output);
	});
	const listLinesCommand = new Command((args: string[]) => {
		listLines(output);
	});
	const renumberLinesCommand = new Command((args: string[]) => {
		renumberLines(output);
	});
	const openDocsCommand = new Command((args: string[]) => {
		openDocs();
	});

	registerCommand("run", runScriptCommand);
	registerCommand("list", listLinesCommand);
	registerCommand("renumber", renumberLinesCommand);
	registerCommand("docs", openDocsCommand);
}
