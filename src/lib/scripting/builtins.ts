import { get } from "svelte/store";
import { currentLine, lines, setCurrentLine, setLines } from "./scripting";
import {
	findNextLineNumber,
	FindPairedNext,
	SplitTokens,
	ThrowError,
} from "./utils";
import {
	assignVariable,
	deleteVariable,
	getVar,
	parseIdentifier,
	parseRightSide,
} from "./vars";

let forLoops: Map<
	number,
	{
		variable: string;
		start: number;
		end: number;
		step: number;
		endLine: number;
	}
> = new Map();

export function clearForLoops() {
	forLoops.clear();
}

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
		ThrowError(`Invalid if command syntax.`, output);
		return false;
	}

	const operators = ["==", "!=", "<", "<=", ">", ">="];
	const operatorIndex = parts.findIndex((part) => operators.includes(part));

	if (
		operatorIndex === -1 ||
		operatorIndex < 1 ||
		operatorIndex > parts.length - 2
	) {
		ThrowError(`Invalid operator in if command`, output);
		return false;
	}

	let leftPart = parts.slice(0, operatorIndex);
	const operator = parts[operatorIndex];
	let rightPart = parts.slice(operatorIndex + 1);

	let leftValue = parseRightSide(leftPart.join(" "), output);
	let rightValue = parseRightSide(rightPart.join(" "), output);

	if (leftValue === undefined || rightValue === undefined) {
		ThrowError(`Invalid left or right value in if command.`, output);
		return false;
	}

	if (
		typeof leftValue === "string" &&
		leftValue.startsWith('"') &&
		leftValue.endsWith('"')
	) {
		// If it's a string, remove the quotes for comparison
		leftValue = leftValue.slice(1, -1);
	}

	if (
		typeof rightValue === "string" &&
		rightValue.startsWith('"') &&
		rightValue.endsWith('"')
	) {
		// If it's a string, remove the quotes for comparison
		rightValue = rightValue.slice(1, -1);
	}

	let conditionMet = false;

	if (typeof leftValue === "number" && typeof rightValue === "number") {
		switch (operator) {
			case "==":
				conditionMet = leftValue === rightValue;
				break;
			case "!=":
				conditionMet = leftValue !== rightValue;
				break;
			case "<":
				conditionMet = leftValue < rightValue;
				break;
			case "<=":
				conditionMet = leftValue <= rightValue;
				break;
			case ">":
				conditionMet = leftValue > rightValue;
				break;
			case ">=":
				conditionMet = leftValue >= rightValue;
				break;
			default:
				ThrowError(`Unknown operator "${operator}".`, output);
				return false;
		}
	} else if (typeof leftValue === "string") {
		switch (operator) {
			case "==":
				conditionMet = leftValue === rightValue;
				break;
			case "!=":
				conditionMet = leftValue !== rightValue;
				break;
			default:
				ThrowError(
					`Unknown operator "${operator}" for string comparison.`,
					output
				);
				return false;
		}
	} else {
		ThrowError(
			`Cannot compare "${leftValue}" of type ${typeof leftValue} with value "${rightValue}".`,
			output
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
		ThrowError(`Please provide a line number to go to.`, output);
		return;
	}

	const lineNumber = parseInt(args[0]);

	if (isNaN(lineNumber)) {
		ThrowError(`Invalid line number: ${args[0]}`, output);
		return;
	}

	if (!lines.has(lineNumber)) {
		ThrowError(`Line ${lineNumber} does not exist.`, output);
		return;
	}

	setCurrentLine(lineNumber);
}

// for i = EQUATION to EQUATION step EQUATION
// next
export function handleForLoop(args: string, output: (message: string) => void) {
	if (forLoops.has(currentLine)) {
		const { variable, start, end, step, endLine } =
			forLoops.get(currentLine)!;

		let currentValue = getVar(variable);

		if (currentValue === undefined) {
			ThrowError(`Variable "${variable}" does not exist.`, output);
			return;
		}

		if (isNaN(Number(currentValue))) {
			ThrowError(`Variable "${variable}" is not a number.`, output);
		}

		currentValue = Number(currentValue) + step;

		if (
			(step < 0 && currentValue <= end) ||
			(step > 0 && currentValue >= end)
		) {
			forLoops.delete(currentLine);
			setCurrentLine(findNextLineNumber(endLine) || endLine + 1);

			deleteVariable(variable, output);

			return;
		}

		assignVariable(variable, currentValue, "number", output);

		setCurrentLine(findNextLineNumber(currentLine) || currentLine + 1);
		return;
	}

	const toIndex = args.indexOf(" to ");

	if (toIndex === -1) {
		ThrowError(
			`Invalid for loop syntax. Expected "for variable = start to end [step stepValue]".`,
			output
		);
		return false;
	}

	const beforeTo = args.slice(0, toIndex).trim();

	const stepIndex = args.indexOf(" step ", toIndex + 4);

	const afterTo =
		stepIndex === -1
			? args.slice(toIndex + 4).trim()
			: args.slice(toIndex + 4, stepIndex).trim();

	const stepPart = stepIndex === -1 ? "" : args.slice(stepIndex + 6).trim();

	const beforeToParts = beforeTo.split("=");
	if (beforeToParts.length !== 2) {
		ThrowError(
			`Invalid for loop syntax. Expected "for variable = start to end [step stepValue]".`,
			output
		);
		return false;
	}

	const variable = beforeToParts[0].trim();
	let start = parseRightSide(beforeToParts[1].trim(), output);
	let end = parseRightSide(afterTo, output);
	let step = stepPart ? parseRightSide(stepPart, output) : 1;

	const pairedNext = FindPairedNext(currentLine);

	if (start === undefined || end === undefined) {
		ThrowError(`Invalid start or end value in for loop.`, output);
		return false;
	}

	if (pairedNext === null) {
		ThrowError(`No paired 'next' found for 'for' loop.`, output);
		return false;
	}

	if (getVar(start.toString()) !== undefined) {
		start = getVar(start.toString());
	}

	if (getVar(end.toString()) !== undefined) {
		end = getVar(end.toString());
	}

	if (isNaN(Number(start)) || isNaN(Number(end))) {
		ThrowError(`Invalid start or end value in for loop.`, output);
		return false;
	}

	start = Number(start);
	end = Number(end);

	if (isNaN(Number(step))) {
		ThrowError(`Invalid step value in for loop.`, output);
		return false;
	}

	if (step === undefined) {
		ThrowError(`Invalid step value in for loop.`, output);
		return false;
	}

	step = Number(step);

	if (getVar(variable) !== undefined) {
		ThrowError(
			`Variable "${variable}" already exists. Please use a different variable name.`,
			output
		);
	}

	if (step === 0) {
		ThrowError(`Step value cannot be zero in for loop.`, output);
		return false;
	}

	assignVariable(variable, start, "number", output);

	forLoops.set(currentLine, {
		variable,
		start,
		end,
		step,
		endLine: pairedNext,
	});
}

export function handleNextLoop(output: (message: string) => void) {
	const forLoop = Array.from(forLoops.entries()).find(
		([startLine, loop]) => loop.endLine === currentLine
	);

	if (!forLoop) {
		ThrowError(`No 'for' loop found for 'next'.`, output);
		return false;
	}

	const [startLine, loopData] = forLoop;

	setCurrentLine(startLine);
}
