import { commands } from "$lib/commands/command";
import { terminalState } from "$lib/terminal/terminal.svelte";
import { clearForLoops } from "./builtins";
import { currentLine } from "./scripting";
import { SplitTokens, ThrowError } from "./utils";

let stringVars: Map<string, string> = new Map();
let numberVars: Map<string, number> = new Map();

let inputVariableName: string | undefined;

export function clearVars() {
	stringVars.clear();
	numberVars.clear();
	inputVariableName = undefined; // Reset input variable name
	clearForLoops(); // Clear for loop state
}

export function getVar(name: string): string | number | undefined {
	if (stringVars.has(name)) {
		return stringVars.get(name);
	} else if (numberVars.has(name)) {
		return numberVars.get(name);
	}
	return undefined;
}

export function assignVariable(
	name: string,
	value: string | number,
	type: "string" | "number" = "string",
	output: (message: string) => void
) {
	if (type === "string") {
		// Remove syntax errors
		value = value.toString();

		if (value.startsWith('"') && value.endsWith('"')) {
			// Remove quotes from the string value
			value = value.slice(1, -1);
		} else {
			output(
				`Invalid value for variable "${name}" on line ${currentLine}. Expected a number or a quoted string.`
			);
			return;
		}

		stringVars.set(name, value);
	} else if (type === "number") {
		if (isNaN(Number(value))) {
			output(
				`Invalid value for variable "${name}" on line ${currentLine}. Expected a number.`
			);
			return;
		}

		numberVars.set(name, Number(value));
	}
}

export function handleOperation(
	operator: string,
	left: string | number,
	right: string | number,
	output: (message: string) => void
): string | number | undefined {
	if (typeof left === "string" && typeof right === "string") {
		switch (operator) {
			case "+":
				return left + " " + right; // Can only concatenate strings
			default:
				output(
					`Unknown operator "${operator}" for string operation on line ${currentLine}.`
				);
				return undefined;
		}
	} else if (typeof left === "string" && typeof right === "number") {
		switch (operator) {
			case "+":
				return left + " " + right; // Concatenate string and number
			case "*":
				if (isNaN(Number(right))) {
					output(
						`Cannot multiply string "${left}" by non-numeric value "${right}" on line ${currentLine}.`
					);
					return undefined;
				}
				return left.repeat(Number(right)); // Repeat string
			default:
				output(
					`Unknown operator "${operator}" for string and number operation on line ${currentLine}.`
				);
				return undefined;
		}
	} else if (typeof left === "number" && typeof right === "number") {
		switch (operator) {
			case "+":
				return left + right; // Add numbers
			case "-":
				return left - right; // Subtract numbers
			case "*":
				return left * right; // Multiply numbers
			case "/":
				if (right === 0) {
					ThrowError(`Cannot divide by zero.`, output);
					return undefined;
				}
				return left / right; // Divide numbers
			case "%":
				if (right === 0) {
					ThrowError(`Cannot modulo by zero.`, output);
					return undefined;
				}

				return left % right; // Modulo operation
			default:
				output(
					`Unknown operator "${operator}" for number operation on line ${currentLine}.`
				);
				return undefined;
		}
	} else if (typeof left === "number" && typeof right === "string") {
		switch (operator) {
			case "+":
				return left + " " + right; // Concatenate number and string
			case "*":
				if (isNaN(Number(left))) {
					output(
						`Cannot multiply string "${right}" by non-numeric value "${left}" on line ${currentLine}.`
					);
					return undefined;
				}
				return right.repeat(Number(left)); // Repeat string
			default:
				output(
					`Unknown operator "${operator}" for string and number operation on line ${currentLine}.`
				);
				return undefined;
		}
	} else {
		output(
			`Invalid operation between "${left}" and "${right}" with operator "${operator}" on line ${currentLine}.`
		);
		return undefined;
	}
}

function handleTypeOf(command: string, output: (message: string) => void) {
	if (!command.startsWith("typeof(") || !command.endsWith(")")) {
		ThrowError(
			`Invalid typeof command syntax on line ${currentLine}. Expected "typeof(variableName)". Got "${command}".`,
			output
		);
		return;
	}

	const varName = command.slice(7, -1).trim();
	const varValue = getVar(varName);

	if (varValue === undefined) {
		output(`Variable "${varName}" does not exist on line ${currentLine}.`);
		return;
	}

	return `"${typeof varValue}"`; // Return the type of the variable
}

function handleRound(command: string, output: (message: string) => void) {
	if (!command.startsWith("round(") || !command.endsWith(")")) {
		ThrowError(
			`Invalid round command syntax on line ${currentLine}. Expected "round(variableName)".`,
			output
		);
		return;
	}

	const varName = command.slice(6, -1).trim();
	const varValue = getVar(varName);

	if (varValue === undefined) {
		output(`Variable "${varName}" does not exist on line ${currentLine}.`);
		return;
	}

	if (typeof varValue !== "number") {
		output(
			`Cannot round variable "${varName}" of type "${typeof varValue}" on line ${currentLine}. Expected a number.`
		);
		return;
	}

	return Math.round(varValue);
}

function handleFloor(command: string, output: (message: string) => void) {
	if (!command.startsWith("floor(") || !command.endsWith(")")) {
		ThrowError(
			`Invalid floor command syntax on line ${currentLine}. Expected "floor(variableName)".`,
			output
		);
		return;
	}

	const varName = command.slice(6, -1).trim();
	const varValue = getVar(varName);

	if (varValue === undefined) {
		output(`Variable "${varName}" does not exist on line ${currentLine}.`);
		return;
	}

	if (typeof varValue !== "number") {
		output(
			`Cannot floor variable "${varName}" of type "${typeof varValue}" on line ${currentLine}. Expected a number.`
		);
		return;
	}

	return Math.floor(varValue);
}

function handleCeil(command: string, output: (message: string) => void) {
	if (!command.startsWith("ceil(") || !command.endsWith(")")) {
		ThrowError(
			`Invalid ceil command syntax on line ${currentLine}. Expected "ceil(variableName)".`,
			output
		);
		return;
	}

	const varName = command.slice(5, -1).trim();
	const varValue = getVar(varName);

	if (varValue === undefined) {
		output(`Variable "${varName}" does not exist on line ${currentLine}.`);
		return;
	}

	if (typeof varValue !== "number") {
		output(
			`Cannot ceil variable "${varName}" of type "${typeof varValue}" on line ${currentLine}. Expected a number.`
		);
		return;
	}

	return Math.ceil(varValue);
}

function handleExists(variableName: string): boolean {
	return getVar(variableName) !== undefined;
}

export function parseIdentifier(
	identifier: string,
	output: (message: string) => void
): string | number | undefined {
	identifier = identifier.trim();

	if (identifier === "") {
		return undefined;
	}

	if (getVar(identifier) !== undefined) {
		return getVar(identifier);
	}

	if (identifier.startsWith("typeof(")) {
		return handleTypeOf(identifier, output);
	}

	if (identifier.startsWith('"') && identifier.endsWith('"')) {
		return identifier; // Remove quotes
	}

	if (identifier.startsWith("round(") && identifier.endsWith(")")) {
		return handleRound(identifier, output);
	}

	if (identifier.startsWith("floor(") && identifier.endsWith(")")) {
		return handleFloor(identifier, output);
	}

	if (identifier.startsWith("ceil(") && identifier.endsWith(")")) {
		return handleCeil(identifier, output);
	}

	if (identifier.startsWith("exists(") && identifier.endsWith(")")) {
		const varName = identifier.slice(7, -1).trim();
		console.log(handleExists(varName), varName);
		return handleExists(varName) ? '"true"' : '"false"';
	}

	if (!isNaN(Number(identifier))) {
		return Number(identifier);
	}

	output(
		`Invalid identifier "${identifier}" on line ${currentLine}. Expected a variable, string, or a number.`
	);

	return undefined;
}

export function parseRightSide(
	rightSide: string,
	output: (message: string) => void
): string | number | undefined {
	const parts = SplitTokens(rightSide);

	if (parts.length === 0) {
		return undefined;
	}

	if (parts.length === 1) {
		const singlePart = parts[0].trim();

		return parseIdentifier(singlePart, output);
	}

	if (parts.length % 2 === 0) {
		return undefined; // Even number of parts is not enough for an expression
	}

	let left = parseIdentifier(parts[0].trim(), output);

	if (left === undefined) {
		ThrowError(
			`Invalid left operand "${parts[0]}" on line ${currentLine}.`,
			output
		);
		return undefined;
	}

	const operator = parts[1].trim();
	// Recursively parse the right side
	// Ignores BODMAS rules for simplicity
	let right = parseRightSide(parts.slice(2).join(" ").trim(), output);

	if (right === undefined) {
		ThrowError(
			`Invalid right operand "${parts
				.slice(2)
				.join(" ")}" on line ${currentLine}.`,
			output
		);
		return undefined;
	}

	let leftString = left.toString().startsWith('"');
	let rightString = right.toString().startsWith('"');

	if (leftString) {
		left = left.toString().slice(1, -1);
	}

	if (rightString) {
		right = right.toString().slice(1, -1);
	}

	const retValue = handleOperation(operator, left, right, output);

	if (leftString || rightString) {
		return `"${retValue}"`; // Return as string if either operand was a string
	}

	return retValue; // Return as number if both operands were numbers
}

export function handleLet(command: string, output: (message: string) => void) {
	const parts = command.split("=");
	if (parts.length !== 2) {
		ThrowError(`Invalid let command syntax.`, output);
		return;
	}

	const variableName = parts[0].trim();
	let variableValue: string | number | undefined = parseRightSide(
		parts[1].trim(),
		output
	);

	if (
		variableName === "" ||
		variableValue === "" ||
		variableValue === undefined
	) {
		ThrowError(`Invalid variable name or value.`, output);
		return;
	}

	if (getVar(variableName) !== undefined) {
		ThrowError(
			`Variable "${variableName}" already exists. Use a different name.`,
			output
		);
		return;
	}

	if (commands.has(variableName)) {
		ThrowError(
			`${variableName} is a command. Please use a different name.`,
			output
		);
		return;
	}

	if (
		variableValue.toString().startsWith('"') &&
		variableValue.toString().endsWith('"')
	) {
		variableValue = variableValue.toString().slice(1, -1);
		assignVariable(variableName, `"${variableValue}"`, "string", output);
	} else {
		assignVariable(variableName, Number(variableValue), "number", output);
	}
}

export function handleVariableCommand(
	command: string,
	output: (message: string) => void
) {
	console.log(stringVars, numberVars);

	const parts = SplitTokens(command.trim());

	if (parts.length < 2) {
		output(`Invalid variable command syntax on line ${currentLine}`);
		return;
	}

	const variableName = parts[0].trim();
	const operation = parts[1].trim();

	const currentValue = getVar(variableName);

	const assignValue = parseRightSide(parts.slice(2).join(" ").trim(), output);

	if (currentValue === undefined) {
		output(
			`Variable "${variableName}" does not exist on line ${currentLine}.`
		);
		return;
	}

	if (assignValue === undefined) {
		output(
			`Invalid assignment value for variable "${variableName}" on line ${currentLine}.`
		);
		return;
	}

	if (operation === "=") {
		assignVariable(
			variableName,
			assignValue,
			typeof currentValue === "string" ? "string" : "number",
			output
		);
	}

	if (operation === "+=") {
		if (typeof currentValue === "number") {
			const newValue = currentValue + Number(assignValue);
			assignVariable(variableName, newValue, "number", output);
		} else {
			const newValue = currentValue + " " + assignValue;
			assignVariable(variableName, newValue, "string", output);
		}
		return;
	}

	if (operation === "-=") {
		if (typeof currentValue === "number") {
			const newValue = currentValue - Number(assignValue);
			assignVariable(variableName, newValue, "number", output);
		} else {
			output(
				`Cannot perform -= operation on string variable "${variableName}" on line ${currentLine}.`
			);
		}
		return;
	}

	if (operation === "*=") {
		if (typeof currentValue === "number") {
			const newValue = currentValue * Number(assignValue);
			assignVariable(variableName, newValue, "number", output);
		} else {
			if (isNaN(Number(assignValue))) {
				output(
					`Cannot perform *= operation on string variable "${variableName}" with non-numeric value "${assignValue}" on line ${currentLine}.`
				);
			}

			const newValue = currentValue.repeat(Number(assignValue));

			assignVariable(variableName, `"${newValue}"`, "string", output);
		}
		return;
	}
}

export function deleteVariable(
	variableName: string,
	output: (message: string) => void
) {
	if (stringVars.has(variableName)) {
		stringVars.delete(variableName);
	} else if (numberVars.has(variableName)) {
		numberVars.delete(variableName);
	} else {
		ThrowError(`Variable "${variableName}" does not exist.`, output);
	}
}

// INPUT x
export async function handleInput(
	args: string,
	output: (message: string) => void
) {
	if (args.trim() === "" || args.trim().includes(" ")) {
		ThrowError(
			`Invalid input command syntax on line ${currentLine}. Expected "input variableName".`,
			output
		);
		return;
	}

	const variableName = args.trim();

	if (variableName === "" || variableName.includes(" ")) {
		ThrowError(
			`Invalid variable name "${variableName}" on line ${currentLine}.`,
			output
		);
		return;
	}

	if (commands.has(variableName)) {
		ThrowError(
			`${variableName} is a command. Please use a different name.`,
			output
		);
		return;
	}

	inputVariableName = variableName;

	terminalState.inputValue = "";
	terminalState.awaitingInput = true;
}

export function finishHandleInput(output: (message: string) => void) {
	if (inputVariableName === undefined) {
		ThrowError(
			`No input variable name specified. Please use "input variableName" command.`,
			output
		);
		return;
	}

	console.log(`Finishing input for variable: ${inputVariableName}`);

	const trimmedInput = terminalState.inputValue.trim();
	const inputType =
		trimmedInput === "" || isNaN(Number(trimmedInput))
			? "string"
			: "number";

	console.log(trimmedInput, inputType);

	const finalInput =
		inputType === "string" ? `"${trimmedInput}"` : Number(trimmedInput);

	if (getVar(inputVariableName) !== undefined) {
		deleteVariable(inputVariableName, output);
	}

	assignVariable(inputVariableName, finalInput, inputType, output);

	inputVariableName = undefined;

	terminalState.inputValue = "";
	terminalState.awaitingInput = false;
}
