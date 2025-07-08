import { Command, registerCommand } from "$lib/commands/command";
import { terminalState } from "$lib/terminal/terminal.svelte";
import { lines } from "./scripting";

export function saveScript(args: string[]) {
	if (args.length < 1) {
		terminalState.lines.push({
			type: "response",
			value: "Usage: save <filename> - Saves the script to a text file.",
		});
	}

	const filename = args[0];
	const scriptContent = Array.from(lines.entries())

		.map(([lineNumber, command]) => `${lineNumber} ${command}`)
		.join("\n");

	const blob = new Blob([scriptContent], { type: "text/plain" });
	const url = URL.createObjectURL(blob);

	const link = document.createElement("a");
	link.href = url;
	link.download = filename.endsWith(".txt") ? filename : `${filename}.txt`;
	document.body.appendChild(link);
	link.click();

	document.body.removeChild(link);
	URL.revokeObjectURL(url);
}

export function load(args: string[]) {
	const input = document.createElement("input");
	input.type = "file";
	input.accept = ".txt";
	input.onchange = (event) => {
		const file = (event.target as HTMLInputElement).files?.[0];
		if (!file) {
			terminalState.lines.push({
				type: "response",
				value: "No file selected.",
			});
			return;
		}

		const reader = new FileReader();
		reader.onload = (e) => {
			const content = e.target?.result as string;
			const newLines = new Map<number, string>();

			content.split("\n").forEach((line) => {
				const parts = line.split(" ");
				const lineNumber = parseInt(parts[0], 10);
				const command = parts.slice(1).join(" ");
				if (!isNaN(lineNumber)) {
					newLines.set(lineNumber, command);
				} else {
					terminalState.lines.push({
						type: "response",
						value: `Invalid line format: "${line}". Line number must be a number.`,
					});
				}
			});

			lines.clear();
			for (const [lineNumber, command] of newLines.entries()) {
				lines.set(lineNumber, command);
			}

			terminalState.lines.push({
				type: "response",
				value: `Script loaded with ${lines.size} lines.`,
			});
		};

		reader.readAsText(file);
	};

	document.body.appendChild(input);
	input.click();

	document.body.removeChild(input);
}

export function RegisterSaveCommands() {
	const save = new Command(saveScript);
	const loadCommand = new Command(load);

	registerCommand("save", save);
	registerCommand("load", loadCommand);
}
