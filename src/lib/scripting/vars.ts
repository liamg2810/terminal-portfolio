import { commands } from "$lib/commands/command";
import { terminalState } from "$lib/terminal/terminal.svelte";
import { clearForLoops } from "./builtins";
import { currentLine } from "./scripting";
import { SplitTokens, ThrowError } from "./utils";

let vars: Map<string, string | number> = new Map();

let inputVariableName: string | undefined;

const builtinFuncs = ["typeof", "round", "floor", "ceil", "exists"];

export function clearVars() {
	vars.clear();
	inputVariableName = undefined; // Reset input variable name
	clearForLoops(); // Clear for loop state
}

export function getVar(name: string): string | number | undefined {
	if (vars.has(name)) {
		return vars.get(name);
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
			ThrowError(
				`Invalid value for variable "${name}". Expected a number or a quoted string.`,
				output
			);
			return;
		}

		vars.set(name, value);
	} else if (type === "number") {
		if (isNaN(Number(value))) {
			ThrowError(
				`Invalid value for variable "${name}". Expected a number.`,
				output
			);
			return;
		}

		vars.set(name, Number(value));
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
				return left + "" + right; // Can only concatenate strings
			default:
				ThrowError(
					`Unknown operator "${operator}" for string operation.`,
					output
				);
				return undefined;
		}
	} else if (typeof left === "string" && typeof right === "number") {
		switch (operator) {
			case "+":
				return left + " " + right; // Concatenate string and number
			case "*":
				if (isNaN(Number(right))) {
					ThrowError(
						`Cannot multiply string "${left}" by non-numeric value "${right}".`,
						output
					);
					return undefined;
				}

				if (Number(right) < 0) {
					ThrowError(
						`Cannot multiply string "${left}" by negative value "${right}".`,
						output
					);
					return undefined;
				}

				return left.repeat(Number(right)); // Repeat string
			default:
				ThrowError(
					`Unknown operator "${operator}" for string and number operation.`,
					output
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
				ThrowError(
					`Unknown operator "${operator}" for number operation.`,
					output
				);
				return undefined;
		}
	} else if (typeof left === "number" && typeof right === "string") {
		switch (operator) {
			case "+":
				return left + " " + right; // Concatenate number and string
			case "*":
				if (isNaN(Number(left))) {
					ThrowError(
						`Cannot multiply string "${right}" by non-numeric value "${left}".`,
						output
					);
					return undefined;
				}
				return right.repeat(Number(left)); // Repeat string
			default:
				ThrowError(
					`Unknown operator "${operator}" for string and number operation.`,
					output
				);
				return undefined;
		}
	} else {
		ThrowError(
			`Invalid operation between "${left}" and "${right}" with operator "${operator}.`,
			output
		);
		return undefined;
	}
}

function handleTypeOf(command: string, output: (message: string) => void) {
	if (!command.startsWith("typeof(") || !command.endsWith(")")) {
		ThrowError(
			`Invalid typeof command syntax. Expected "typeof(variableName)". Got "${command}".`,
			output
		);
		return;
	}

	const varName = command.slice(7, -1).trim();
	const varValue = getVar(varName);

	if (varValue === undefined) {
		ThrowError(`Variable "${varName}" does not exist.`, output);
		return;
	}

	return `"${typeof varValue}"`; // Return the type of the variable
}

function handleRound(command: string, output: (message: string) => void) {
	if (!command.startsWith("round(") || !command.endsWith(")")) {
		ThrowError(
			`Invalid round command syntax. Expected "round(variableName)".`,
			output
		);
		return;
	}

	const varName = command.slice(6, -1).trim();
	const varValue = getVar(varName);

	if (varValue === undefined) {
		ThrowError(`Variable "${varName}" does not exist.`, output);
		return;
	}

	if (typeof varValue !== "number") {
		ThrowError(
			`Cannot round variable "${varName}" of type "${typeof varValue}". Expected a number.`,
			output
		);
		return;
	}

	return Math.round(varValue);
}

function handleFloor(command: string, output: (message: string) => void) {
	if (!command.startsWith("floor(") || !command.endsWith(")")) {
		ThrowError(
			`Invalid floor command syntax. Expected "floor(variableName)".`,
			output
		);
		return;
	}

	const varName = command.slice(6, -1).trim();
	const varValue = getVar(varName);

	if (varValue === undefined) {
		ThrowError(`Variable "${varName}" does not exist.`, output);
		return;
	}

	if (typeof varValue !== "number") {
		ThrowError(
			`Cannot floor variable "${varName}" of type "${typeof varValue}". Expected a number.`,
			output
		);
		return;
	}

	return Math.floor(varValue);
}

function handleCeil(command: string, output: (message: string) => void) {
	if (!command.startsWith("ceil(") || !command.endsWith(")")) {
		ThrowError(
			`Invalid ceil command syntax. Expected "ceil(variableName)".`,
			output
		);
		return;
	}

	const varName = command.slice(5, -1).trim();
	const varValue = getVar(varName);

	if (varValue === undefined) {
		ThrowError(`Variable "${varName}" does not exist.`, output);
		return;
	}

	if (typeof varValue !== "number") {
		ThrowError(
			`Cannot ceil variable "${varName}" of type "${typeof varValue}". Expected a number.`,
			output
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
		return handleExists(varName) ? '"true"' : '"false"';
	}

	if (!isNaN(Number(identifier))) {
		return Number(identifier);
	}

	ThrowError(
		`Invalid identifier "${identifier}". Expected a variable, string, or a number.`,
		output
	);

	return undefined;
}

export function parseRightSide(
	rightSide: string,
	output: (message: string) => void
): string | number | undefined {
	let parts = SplitTokens(rightSide);

	if (parts.length === 0) {
		return undefined;
	}

	if (builtinFuncs.includes(parts[0])) {
		return parseIdentifier(parts.join(""), output);
	}

	if (parts.length === 1) {
		const singlePart = parts[0].trim();

		return parseIdentifier(singlePart, output);
	}

	if (parts.length % 2 === 0) {
		return undefined; // Even number of parts is not enough for an expression
	}

	const operators: { [key: string]: number } = {
		"+": 1,
		"-": 1,
		"*": 2,
		"/": 2,
		"%": 2,
	};

	// Shunting Yard Algorithm to convert to Reverse Polish Notation (RPN)
	// Now supports parentheses for grouping (BODMAS)
	function toRPN(tokens: string[]): string[] {
		const outputQueue: string[] = [];
		const operatorStack: string[] = [];
		const precedence: { [key: string]: number } = {
			"+": 1,
			"-": 1,
			"*": 2,
			"/": 2,
			"%": 2,
		};
		const associativity: { [key: string]: "left" | "right" } = {
			"+": "left",
			"-": "left",
			"*": "left",
			"/": "left",
			"%": "left",
		};

		for (let token of tokens) {
			token = token.trim();
			if (token === "(") {
				operatorStack.push(token);
			} else if (token === ")") {
				while (
					operatorStack.length > 0 &&
					operatorStack[operatorStack.length - 1] !== "("
				) {
					outputQueue.push(operatorStack.pop()!);
				}
				if (
					operatorStack.length === 0 ||
					operatorStack[operatorStack.length - 1] !== "("
				) {
					ThrowError("Mismatched parentheses in expression.", output);
					return [];
				}
				operatorStack.pop(); // Remove "("
			} else if (operators[token]) {
				while (
					operatorStack.length > 0 &&
					operators[operatorStack[operatorStack.length - 1]] &&
					((associativity[token] === "left" &&
						precedence[token] <=
							precedence[
								operatorStack[operatorStack.length - 1]
							]) ||
						(associativity[token] === "right" &&
							precedence[token] <
								precedence[
									operatorStack[operatorStack.length - 1]
								]))
				) {
					outputQueue.push(operatorStack.pop()!);
				}
				operatorStack.push(token);
			} else {
				outputQueue.push(token);
			}
		}
		while (operatorStack.length > 0) {
			const op = operatorStack.pop()!;
			if (op === "(" || op === ")") {
				ThrowError("Mismatched parentheses in expression.", output);
				return [];
			}
			outputQueue.push(op);
		}
		return outputQueue;
	}

	// Evaluate RPN
	function evalRPN(rpn: string[]): string | number | undefined {
		const stack: (string | number)[] = [];
		for (const token of rpn) {
			if (operators[token]) {
				if (stack.length < 2) {
					ThrowError(`Invalid expression syntax.`, output);
					return undefined;
				}
				const right = stack.pop()!;
				const left = stack.pop()!;
				let leftVal = left;
				let rightVal = right;
				let leftString =
					typeof leftVal === "string" &&
					leftVal.toString().startsWith('"');
				let rightString =
					typeof rightVal === "string" &&
					rightVal.toString().startsWith('"');
				if (leftString) leftVal = leftVal.toString().slice(1, -1);
				if (rightString) rightVal = rightVal.toString().slice(1, -1);
				const result = handleOperation(
					token,
					leftVal,
					rightVal,
					output
				);
				if (result === undefined) return undefined;
				stack.push(result);
			} else {
				const value = parseIdentifier(token, output);
				if (value === undefined) return undefined;
				stack.push(value);
			}
		}
		if (stack.length !== 1) {
			ThrowError(`Invalid expression syntax.`, output);
			return undefined;
		}
		const result = stack[0];
		if (typeof result === "string") {
			return `"${result.toString().replace(/^"|"$/g, "")}"`;
		}
		return result;
	}

	const rpn = toRPN(parts);
	return evalRPN(rpn);
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
	const parts = SplitTokens(command.trim());

	if (parts.length < 2) {
		ThrowError(`Invalid variable command syntax`, output);
		return;
	}

	const variableName = parts[0].trim();
	const operation = parts[1].trim();

	const currentValue = getVar(variableName);

	const assignValue = parseRightSide(parts.slice(2).join(" ").trim(), output);

	if (currentValue === undefined) {
		ThrowError(`Variable "${variableName}" does not exist.`, output);
		return;
	}

	if (assignValue === undefined) {
		ThrowError(
			`Invalid assignment value for variable "${variableName}".`,
			output
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
			ThrowError(
				`Cannot perform -= operation on string variable "${variableName}".`,
				output
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
				ThrowError(
					`Cannot perform *= operation on string variable "${variableName}" with non-numeric value "${assignValue}".`,
					output
				);
			}

			if (Number(assignValue) < 0) {
				ThrowError(
					`Cannot multiply string variable "${variableName}" by negative value "${assignValue}".`,
					output
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
	if (vars.has(variableName)) {
		vars.delete(variableName);
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
			`Invalid input command syntax. Expected "input variableName".`,
			output
		);
		return;
	}

	const variableName = args.trim();

	if (variableName === "" || variableName.includes(" ")) {
		ThrowError(`Invalid variable name "${variableName}".`, output);
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

	const trimmedInput = terminalState.inputValue.trim();
	const inputType =
		trimmedInput === "" || isNaN(Number(trimmedInput))
			? "string"
			: "number";

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
