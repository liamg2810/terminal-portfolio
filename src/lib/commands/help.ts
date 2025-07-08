import { terminalState } from "$lib/terminal/terminal.svelte";
import { Command, registerCommand } from "./command";

function helpCommand(args: string[]) {
	const helpText = `Available commands:
	help - Show this help message
	name - Show my name in ASCII art
	about - Learn about me
	projects - List my projects
	color <color> - Change the color of the text:
	colors - List available colors
	clear - Clear the terminal
	date - Show the current date and time
	save <filename> - Save the current script to a text file
	load - Load a script from a text file
	`;

	terminalState.lines.push({
		type: "response",
		value: helpText,
	});
}

export function RegisterHelpCommand() {
	const help = new Command(helpCommand);

	registerCommand("help", help);
}
