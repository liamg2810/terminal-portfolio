import { currentLine, lines, setCurrentLine, setLines } from "./scripting";
import { SplitTokens, ThrowError } from "./utils";
import { getVar, parseIdentifier } from "./vars";

export function handlePrint(
	command: string,
	output: (message: string) => void
) {
	let outputParts: string[] = SplitTokens(command);

	if (outputParts.length === 0) {
		ThrowError(`No output to print.`, output);
		return;
	}

	outputParts = outputParts.map((part) => {
		let varValue = parseIdentifier(part, output)?.toString();

		if (varValue !== undefined) {
			if (varValue.startsWith('"') && varValue.endsWith('"')) {
				// If it's a string, remove the quotes for output
				varValue = varValue.slice(1, -1);
			}

			return varValue;
		}

		ThrowError(`Variable "${part}" does not exist.`, output);
		return ""; // Return empty string if variable does not exist
	});

	output(outputParts.join(" "));
}

export function handleIf(
	args: string,
	output: (message: string) => void
): boolean {
	const parts = SplitTokens(args.trim());

	if (parts.length < 3) {
		output(`Invalid if command syntax on line ${currentLine}`);
		return false;
	}

	const variableName = parts[0];
	const operator = parts[1];
	const value = parseIdentifier(parts.slice(2).join(" "), output);

	const currentValue = parseIdentifier(variableName, output);

	if (currentValue === undefined) {
		output(
			`Variable "${variableName}" does not exist on line ${currentLine}.`
		);
		return false;
	}

	let conditionMet = false;

	if (typeof currentValue === "number" && !isNaN(Number(value))) {
		const numValue = Number(value);
		switch (operator) {
			case "==":
				conditionMet = currentValue === numValue;
				break;
			case "!=":
				conditionMet = currentValue !== numValue;
				break;
			case "<":
				conditionMet = currentValue < numValue;
				break;
			case "<=":
				conditionMet = currentValue <= numValue;
				break;
			case ">":
				conditionMet = currentValue > numValue;
				break;
			case ">=":
				conditionMet = currentValue >= numValue;
				break;
			default:
				output(
					`Unknown operator "${operator}" on line ${currentLine}.`
				);
				return false;
		}
	} else if (typeof currentValue === "string") {
		switch (operator) {
			case "==":
				conditionMet = currentValue === value;
				break;
			case "!=":
				conditionMet = currentValue !== value;
				break;
			default:
				output(
					`Unknown operator "${operator}" for string comparison on line ${currentLine}.`
				);
				return false;
		}
	} else {
		output(
			`Cannot compare variable "${variableName}" of type ${typeof currentValue} with value "${value}" on line ${currentLine}.`
		);
		return false;
	}

	return conditionMet;
}

export function listLines(output: (message: string) => void) {
	const orderedLines = Array.from(lines.entries()).sort(
		(a, b) => a[0] - b[0]
	);

	output(orderedLines.map((line) => `${line[0]} ${line[1]}`).join("\n"));
}

export function renumberLines(output: (message: string) => void) {
	let renumberedLines: Map<number, number> = new Map();

	const distance = 10;

	setLines(
		new Map(
			Array.from(lines.entries()).map((line, index) => {
				renumberedLines.set(line[0], (index + 1) * distance);
				return [(index + 1) * distance, line[1]];
			})
		)
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
				output(`Invalid line number in goto command: ${args[0]}`);
			}
		}
	}
}

export function gotoLine(args: string[], output: (message: string) => void) {
	if (args.length === 0) {
		output(`Please provide a line number to go to. Line ${currentLine}`);
		return;
	}

	const lineNumber = parseInt(args[0]);

	if (isNaN(lineNumber)) {
		output(`Error on line ${currentLine}: Invalid line number: ${args[0]}`);
		return;
	}

	if (!lines.has(lineNumber)) {
		output(
			`Error on line ${currentLine}: Line ${lineNumber} does not exist.`
		);
		return;
	}

	setCurrentLine(lineNumber);
}
