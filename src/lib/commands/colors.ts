import {
	availableColors,
	changeColor,
	colorAlias,
	terminalState,
} from "$lib/terminal/terminal.svelte";
import { Command, registerCommand } from "./command";

function colorCommand(args: string[]) {
	if (args.length === 0) {
		console.warn(
			"No color specified. Use 'colors' to see available colors."
		);
		return;
	}

	const colorIx = parseInt(args[0].toLowerCase());

	if (isNaN(colorIx) || colorIx < 0 || colorIx >= availableColors.length) {
		terminalState.lines.push({
			type: "response",
			value: `Invalid color index. Use 'colors' to see available colors.`,
		});
		return;
	}

	changeColor(colorIx);

	const colorName = colorAlias[colorIx];

	terminalState.lines.push({
		type: "response",
		value: `Color changed to ${colorName}.`,
	});
}

function colorsCommand() {
	const colorList = availableColors
		.map((color, index) => `${index}: ${colorAlias[index]}`)
		.join("\n");

	terminalState.lines.push({
		type: "response",
		value: `Available colors:\n${colorList}`,
	});
}

export function RegisterColorsCommand() {
	const color = new Command(colorCommand);
	const colors = new Command(colorsCommand);

	registerCommand("color", color);
	registerCommand("colors", colors);
}
