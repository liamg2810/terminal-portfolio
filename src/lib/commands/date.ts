import { terminalState } from "$lib/terminal/terminal.svelte";
import { Command, registerCommand } from "./command";

function dateCommand(args: string[]) {
	terminalState.lines.push({
		type: "response",
		value: `Current date and time: ${new Date().toLocaleString()}`,
	});
}

export function RegisterDateCommand() {
	const date = new Command(dateCommand);

	registerCommand("date", date);
}
