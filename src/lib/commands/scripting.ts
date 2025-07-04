import { terminalState } from "$lib/terminal/terminal.svelte";
import { Command, parseCommand, registerCommand } from "./command";

let lines: Map<number, string> = new Map();

let currentLine = 0;

export function addLine(lineNumber: number, command: string) {
	lines.set(lineNumber, command);

	if (command === "") {
		lines.delete(lineNumber);
	}

	orderLines();
}

function orderLines() {
	lines = new Map(Array.from(lines.entries()).sort((a, b) => a[0] - b[0]));
}

async function delay(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

async function runScript(args: string[]) {
	const orderedLines: Map<number, string> = new Map(
		Array.from(lines.entries()).sort((a, b) => a[0] - b[0])
	);

	const largestLineNumber =
		orderedLines.size > 0
			? Math.max(...Array.from(orderedLines.keys()))
			: 0;

	currentLine = 0;
	terminalState.executingScript = true;

	while (currentLine <= largestLineNumber && terminalState.executingScript) {
		const keys = Array.from(orderedLines.keys());
		const largerKeys = keys.filter((k) => k > currentLine);
		const nextLine =
			largerKeys.length > 0
				? Math.min(...largerKeys)
				: largestLineNumber + 1;

		if (!orderedLines.has(currentLine)) {
			currentLine = nextLine;
			continue;
		}

		const command = orderedLines.get(currentLine);
		if (command) {
			if (command.trim() === "") {
				currentLine = nextLine;
				continue;
			}

			if (command.trim() === "run") {
				terminalState.lines.push({
					type: "response",
					value: `Unable to run script: "run" command is not valid in this context. Line ${currentLine}`,
				});
				currentLine = nextLine;
				continue;
			}

			if (command.trim().split(" ")[0] === "goto") {
				const args = command.trim().split(" ").slice(1);
				gotoLine(args);
				continue;
			}

			if (command.trim().split(" ")[0] === "sleep") {
				const args = command.trim().split(" ").slice(1);
				if (args.length === 0 || isNaN(parseInt(args[0]))) {
					terminalState.lines.push({
						type: "response",
						value: "Please provide a valid sleep duration in milliseconds.",
					});
					currentLine = nextLine;
					continue;
				}

				const sleepDuration = parseInt(args[0]);
				await delay(sleepDuration);
				currentLine = nextLine;
				continue;
			}

			const cmd = parseCommand(command);

			if (cmd) {
				cmd.run(command);
			} else {
				terminalState.lines.push({
					type: "response",
					value: `Syntax error on line ${currentLine}`,
				});
			}
		} else {
			console.warn(`No command to execute for line ${currentLine}`);
		}

		currentLine = nextLine;
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

	terminalState.lines.push({
		type: "response",
		value: `Script execution forcibly stopped at line ${currentLine}.`,
	});
}

function listLines() {
	const orderedLines = Array.from(lines.entries()).sort(
		(a, b) => a[0] - b[0]
	);

	terminalState.lines.push({
		type: "response",
		value: orderedLines.map((line) => `${line[0]} ${line[1]}`).join("\n"),
	});
}

function renumberLines() {
	let renumberedLines: Map<number, number> = new Map();

	const distance = 10;

	lines = new Map(
		Array.from(lines.entries()).map((line, index) => {
			renumberedLines.set(line[0], (index + 1) * distance);
			return [(index + 1) * distance, line[1]];
		})
	);

	for (const line of lines.entries()) {
		const [lineNumber, command] = line;

		if (command.trim().split(" ")[0] === "goto") {
			const args = command.trim().split(" ").slice(1);
			const gotoLineNumber = parseInt(args[0]);

			if (!isNaN(gotoLineNumber) && renumberedLines.has(gotoLineNumber)) {
				args[0] =
					renumberedLines.get(gotoLineNumber)?.toString() || "0";
				lines.set(lineNumber, `goto ${args.join(" ")}`);
			} else {
				terminalState.lines.push({
					type: "response",
					value: `Invalid line number in goto command: ${args[0]}`,
				});
			}
		}
	}
}

function gotoLine(args: string[]) {
	if (args.length === 0) {
		terminalState.lines.push({
			type: "response",
			value: "Please provide a line number to go to.",
		});
		return;
	}

	const lineNumber = parseInt(args[0]);

	if (isNaN(lineNumber)) {
		terminalState.lines.push({
			type: "response",
			value: `Invalid line number: ${args[0]}`,
		});
		return;
	}

	if (!lines.has(lineNumber)) {
		terminalState.lines.push({
			type: "response",
			value: `Line ${lineNumber} does not exist.`,
		});
		return;
	}

	currentLine = lineNumber;
}

export function registerRunScript() {
	const runScriptCommand = new Command(runScript);
	const listLinesCommand = new Command(listLines);
	const renumberLinesCommand = new Command(renumberLines);

	registerCommand("run", runScriptCommand);
	registerCommand("list", listLinesCommand);
	registerCommand("renumber", renumberLinesCommand);
}
