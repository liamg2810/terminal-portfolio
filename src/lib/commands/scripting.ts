import { terminalState } from "$lib/terminal/terminal.svelte";
import { Command, parseCommand, registerCommand } from "./command";

let lines: Map<number, string> = new Map();

let executingScript = false;
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

function runScript(args: string[]) {
	const orderedLines: Map<number, string> = new Map(
		Array.from(lines.entries()).sort((a, b) => a[0] - b[0])
	);

	const largestLineNumber =
		orderedLines.size > 0
			? Math.max(...Array.from(orderedLines.keys()))
			: 0;

	currentLine = 0;
	executingScript = true;

	while (currentLine <= largestLineNumber) {
		if (!orderedLines.has(currentLine)) {
			currentLine += 1;
			continue;
		}

		const command = orderedLines.get(currentLine);
		if (command) {
			if (command.trim().split(" ")[0] === "goto") {
				const args = command.trim().split(" ").slice(1);
				gotoLine(args);
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
		currentLine += 1;
	}

	executingScript = false;
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
	let renumberedLines: Map<number, number> = new Map(
		Array.from(lines.entries()).map((line, index) => [index + 1, line[1]])
	);

	const distance = 10;

	lines = new Map(
		Array.from(lines.entries()).map((line, index) => {
			renumberedLines.set(index - 1, (index + 1) * distance);
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
