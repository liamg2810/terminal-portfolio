import { terminalState } from "$lib/terminal/terminal.svelte";
import { Command, registerCommand } from "./command";

function clearCommand(args: string[]) {
	terminalState.lines = [];
	terminalState.text = "";
}

export function RegisterClearCommand() {
	const clear = new Command(clearCommand);

	registerCommand("clear", clear);
	registerCommand("cls", clear); // Alias for 'clear'
}
