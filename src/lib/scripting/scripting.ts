import { terminalState } from "$lib/terminal/terminal.svelte";
import {
	Command,
	commands,
	parseCommand,
	registerCommand,
} from "../commands/command";

let lines: Map<number, string> = new Map([
	// Example lines for testing
	[1, "let xpos = 0"],
	[2, "let loops = 0"],
	[3, 'let padl = " "'],
	[4, "if loops <= 5"],
	[5, "if xpos <= 20"],
	[6, "xpos += 1"],
	[7, 'padl = " " * xpos'],
	[8, "cls"],
	[9, 'print padl + "O"'],
	[10, "goto 5"],
	[11, "endif"],
	[12, "xpos = 0"],
	[13, "loops += 1"],
	[14, "goto 4"],
	[15, "endif"],
]);

let stringVars: Map<string, string> = new Map();
let numberVars: Map<string, number> = new Map();

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

function getVar(name: string): string | number | undefined {
	if (stringVars.has(name)) {
		return stringVars.get(name);
	} else if (numberVars.has(name)) {
		return numberVars.get(name);
	}
	return undefined;
}

function assignVariable(
	name: string,
	value: string | number,
	type: "string" | "number" = "string"
) {
	if (type === "string") {
		// Convert to string
		let stringValue = value.toString();

		// If it's already a string without quotes, and it's a result from an operation, use it directly
		if (typeof value === "string" && !stringValue.startsWith('"')) {
			stringVars.set(name, stringValue);
			return;
		}

		// Handle quoted strings
		if (stringValue.startsWith('"') && stringValue.endsWith('"')) {
			// Remove quotes from the string value
			stringValue = stringValue.slice(1, -1);
		} else if (typeof value === "number") {
			// If we're assigning a number to a string variable, convert it
			stringValue = value.toString();
		} else {
			terminalState.lines.push({
				type: "response",
				value: `Invalid value for variable "${name}" on line ${currentLine}. Expected a number or a quoted string.`,
			});
			return;
		}

		stringVars.set(name, stringValue);
	} else if (type === "number") {
		if (isNaN(Number(value))) {
			terminalState.lines.push({
				type: "response",
				value: `Invalid value for variable "${name}" on line ${currentLine}. Expected a number.`,
			});
			return;
		}

		numberVars.set(name, Number(value));
	}
}

function parseIdentifier(identifier: string): string | number | undefined {
	identifier = identifier.trim();

	if (identifier === "") {
		return undefined;
	}

	if (getVar(identifier) !== undefined) {
		return getVar(identifier);
	}

	if (!isNaN(Number(identifier))) {
		return Number(identifier);
	}

	if (identifier.startsWith('"') && identifier.endsWith('"')) {
		return identifier.slice(1, -1); // Remove quotes
	}

	terminalState.lines.push({
		type: "response",
		value: `Invalid identifier "${identifier}" on line ${currentLine}. Expected a variable, string, or a number.`,
	});

	return undefined;
}

function handleOperation(
	operator: string,
	left: string | number,
	right: string | number
): string | number | undefined {
	if (typeof left === "string" && typeof right === "string") {
		switch (operator) {
			case "+":
				return left + " " + right; // Can only concatenate strings
			default:
				terminalState.lines.push({
					type: "response",
					value: `Unknown operator "${operator}" for string operation on line ${currentLine}.`,
				});
				return undefined;
		}
	} else if (typeof left === "string" && typeof right === "number") {
		switch (operator) {
			case "+":
				return left + " " + right; // Concatenate string and number
			case "*":
				if (isNaN(Number(right))) {
					terminalState.lines.push({
						type: "response",
						value: `Cannot multiply string "${left}" by non-numeric value "${right}" on line ${currentLine}.`,
					});
					return undefined;
				}
				return left.repeat(Number(right)); // Repeat string
			default:
				terminalState.lines.push({
					type: "response",
					value: `Unknown operator "${operator}" for string and number operation on line ${currentLine}.`,
				});
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
					terminalState.lines.push({
						type: "response",
						value: `Cannot divide by zero on line ${currentLine}.`,
					});
					return undefined;
				}
				return left / right; // Divide numbers
			default:
				terminalState.lines.push({
					type: "response",
					value: `Unknown operator "${operator}" for number operation on line ${currentLine}.`,
				});
				return undefined;
		}
	} else if (typeof left === "number" && typeof right === "string") {
		switch (operator) {
			case "+":
				return left + " " + right; // Concatenate number and string
			case "*":
				if (isNaN(Number(left))) {
					terminalState.lines.push({
						type: "response",
						value: `Cannot multiply string "${right}" by non-numeric value "${left}" on line ${currentLine}.`,
					});
					return undefined;
				}
				return right.repeat(Number(left)); // Repeat string
			default:
				terminalState.lines.push({
					type: "response",
					value: `Unknown operator "${operator}" for string and number operation on line ${currentLine}.`,
				});
				return undefined;
		}
	} else {
		terminalState.lines.push({
			type: "response",
			value: `Invalid operation between "${left}" and "${right}" with operator "${operator}" on line ${currentLine}.`,
		});
		return undefined;
	}
}

function parseRightSide(rightSide: string): string | number | undefined {
	rightSide = rightSide.trim();

	// Handle simple cases first
	if (rightSide === "") {
		return undefined;
	}

	// Use regex to split into tokens: quoted strings, identifiers, numbers, and operators
	const regex =
		/"([^"]*)"|([a-zA-Z_][a-zA-Z0-9_]*)|(\d+(?:\.\d+)?)|([+\-*/])/g;
	const tokens: string[] = [];
	let match: RegExpExecArray | null;
	let lastIndex = 0;

	while ((match = regex.exec(rightSide)) !== null) {
		// Check for any non-whitespace characters between tokens that weren't matched
		const beforeMatch = rightSide.slice(lastIndex, match.index).trim();
		if (beforeMatch && beforeMatch !== "") {
			console.log(`DEBUG: Unmatched content: "${beforeMatch}"`);
			return undefined; // Invalid syntax
		}

		if (match[1] !== undefined) {
			// Quoted string - keep quotes for proper identification
			tokens.push(`"${match[1]}"`);
		} else if (match[2] !== undefined) {
			// Variable or identifier
			tokens.push(match[2]);
		} else if (match[3] !== undefined) {
			// Number
			tokens.push(match[3]);
		} else if (match[4] !== undefined) {
			// Operator (removed = from the pattern)
			tokens.push(match[4]);
		}

		lastIndex = regex.lastIndex;
	}

	// Check for any remaining non-whitespace content
	const remaining = rightSide.slice(lastIndex).trim();
	if (remaining && remaining !== "") {
		console.log(`DEBUG: Unmatched remaining content: "${remaining}"`);
		return undefined;
	}

	console.log(`DEBUG: Parsed tokens: ${JSON.stringify(tokens)}`);

	if (tokens.length === 0) {
		return undefined;
	}

	// Single token - just parse it as an identifier
	if (tokens.length === 1) {
		return parseIdentifier(tokens[0]);
	}

	// For expressions, we need an odd number of tokens (operand operator operand ...)
	if (tokens.length % 2 === 0) {
		terminalState.lines.push({
			type: "response",
			value: `Invalid expression syntax "${rightSide}" on line ${currentLine}. Expected operand operator operand pattern.`,
		});
		return undefined;
	}

	// Parse left operand
	const left = parseIdentifier(tokens[0]);
	if (left === undefined) {
		return undefined; // Error already logged in parseIdentifier
	}

	// If we only have 3 tokens, it's a simple binary operation
	if (tokens.length === 3) {
		const operator = tokens[1];
		const right = parseIdentifier(tokens[2]);
		if (right === undefined) {
			return undefined; // Error already logged in parseIdentifier
		}
		return handleOperation(operator, left, right);
	}

	// For longer expressions, process left to right (no BODMAS for simplicity)
	let result: string | number = left;
	for (let i = 1; i < tokens.length; i += 2) {
		const operator = tokens[i];
		const rightOperand = parseIdentifier(tokens[i + 1]);

		if (rightOperand === undefined) {
			return undefined; // Error already logged in parseIdentifier
		}

		const operationResult = handleOperation(operator, result, rightOperand);
		if (operationResult === undefined) {
			return undefined; // Error already logged in handleOperation
		}

		result = operationResult;
	}

	return result;
}

function handleLet(command: string) {
	const parts = command.split("=");
	if (parts.length !== 2) {
		terminalState.lines.push({
			type: "response",
			value: `Invalid let command syntax on line ${currentLine}`,
		});
		return;
	}

	const variableName = parts[0].trim();
	let variableValue: string | number | undefined = parseRightSide(
		parts[1].trim()
	);

	console.log(
		`DEBUG: variableName: "${variableName}", variableValue: "${variableValue}"`
	);

	if (
		variableName === "" ||
		variableValue === "" ||
		variableValue === undefined
	) {
		terminalState.lines.push({
			type: "response",
			value: `Invalid let command syntax on line ${currentLine}`,
		});
		return;
	}

	if (getVar(variableName) !== undefined) {
		terminalState.lines.push({
			type: "response",
			value: `Variable "${variableName}" already exists. Use a different name.`,
		});
		return;
	}

	if (commands.has(variableName)) {
		terminalState.lines.push({
			type: "response",
			value: `${variableName} is a command. Please use a different name.`,
		});
		return;
	}

	if (typeof variableValue === "number") {
		assignVariable(variableName, variableValue, "number");
	} else {
		// For strings, check if they already have quotes or are operation results
		if (typeof variableValue === "string") {
			if (variableValue.startsWith('"') && variableValue.endsWith('"')) {
				assignVariable(variableName, variableValue, "string");
			} else {
				// It's a string result from an operation, wrap in quotes for proper handling
				assignVariable(variableName, `"${variableValue}"`, "string");
			}
		}
	}
}

function handleVariableCommand(command: string) {
	const parts = command.split(" ");

	if (parts.length < 2) {
		terminalState.lines.push({
			type: "response",
			value: `Invalid variable command syntax on line ${currentLine}`,
		});
		return;
	}

	const variableName = parts[0].trim();
	const operation = parts[1].trim();

	terminalState.lines.push({
		type: "response",
		value: `DEBUG: current variables: ${JSON.stringify({
			stringVars: Array.from(stringVars.entries()),
			numberVars: Array.from(numberVars.entries()),
		})}`,
	});

	const currentValue = getVar(variableName);

	const assignValue = parseRightSide(parts.slice(2).join(" ").trim());

	if (currentValue === undefined) {
		terminalState.lines.push({
			type: "response",
			value: `Variable "${variableName}" does not exist on line ${currentLine}.`,
		});
		return;
	}

	if (assignValue === undefined) {
		terminalState.lines.push({
			type: "response",
			value: `Invalid assignment value for variable "${variableName}" on line ${currentLine}.`,
		});
		return;
	}

	if (operation === "=") {
		assignVariable(
			variableName,
			assignValue,
			typeof currentValue === "string" ? "string" : "number"
		);
		return;
	}

	if (operation === "+=") {
		if (typeof currentValue === "number") {
			const newValue = currentValue + Number(assignValue);
			assignVariable(variableName, newValue, "number");
		} else {
			const newValue = currentValue + " " + assignValue;
			assignVariable(variableName, newValue, "string");
		}
		return;
	}

	if (operation === "-=") {
		if (typeof currentValue === "number") {
			const newValue = currentValue - Number(assignValue);
			assignVariable(variableName, newValue, "number");
		} else {
			terminalState.lines.push({
				type: "response",
				value: `Cannot perform -= operation on string variable "${variableName}" on line ${currentLine}.`,
			});
		}
		return;
	}

	if (operation === "*=") {
		if (typeof currentValue === "number") {
			const newValue = currentValue * Number(assignValue);
			assignVariable(variableName, newValue, "number");
		} else {
			if (isNaN(Number(assignValue))) {
				terminalState.lines.push({
					type: "response",
					value: `Cannot perform *= operation on string variable "${variableName}" with non-numeric value "${assignValue}" on line ${currentLine}.`,
				});
			}

			const newValue = currentValue.repeat(Number(assignValue));
			console.log(
				`Repeating string "${currentValue}" ${assignValue} times.`
			);
			console.log(`New value: "${newValue}"`);

			assignVariable(
				variableName,
				`"${currentValue.repeat(Number(assignValue))}"`,
				"string"
			);
		}
		return;
	}
}

// Print allows for concatenation of strings and variables
// This is different from echo which just outputs everything after the command as is
// Variables and strings are seperated by spaces and can have any combination of variables and strings
// E.g print "Hello, " name ", how are you?" age
function handlePrint(command: string) {
	const regex = /"([^"]*)"|([a-zA-Z_][a-zA-Z0-9_]*)/g;
	const outputParts: string[] = [];
	let match: RegExpExecArray | null;

	while ((match = regex.exec(command)) !== null) {
		if (match[1] !== undefined) {
			// Quoted string
			outputParts.push(match[1]);
		} else if (match[2] !== undefined) {
			// Variable
			const varValue = getVar(match[2].trim());
			if (varValue !== undefined) {
				outputParts.push(varValue.toString());
			} else {
				terminalState.lines.push({
					type: "response",
					value: `Variable "${match[2]}" does not exist on line ${currentLine}.`,
				});
				return;
			}
		}
	}

	const output = outputParts.join(" ");
	terminalState.lines.push({
		type: "response",
		value: output,
	});
}

function handleIf(args: string): boolean {
	const parts = args.split(" ");
	if (parts.length < 3) {
		terminalState.lines.push({
			type: "response",
			value: `Invalid if command syntax on line ${currentLine}`,
		});
		return false;
	}

	const variableName = parts[0];
	const operator = parts[1];
	const value = parts.slice(2).join(" ");

	const currentValue = getVar(variableName);

	if (currentValue === undefined) {
		terminalState.lines.push({
			type: "response",
			value: `Variable "${variableName}" does not exist on line ${currentLine}.`,
		});
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
				terminalState.lines.push({
					type: "response",
					value: `Unknown operator "${operator}" on line ${currentLine}.`,
				});
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
				terminalState.lines.push({
					type: "response",
					value: `Unknown operator "${operator}" for string comparison on line ${currentLine}.`,
				});
				return false;
		}
	} else {
		terminalState.lines.push({
			type: "response",
			value: `Cannot compare variable "${variableName}" of type ${typeof currentValue} with value "${value}" on line ${currentLine}.`,
		});
		return false;
	}

	return conditionMet;
}

function findNextCommandLine(
	startLine: number,
	targetCommand: string
): number | null {
	for (
		let i = startLine + 1;
		i <= Math.max(...Array.from(lines.keys()));
		i++
	) {
		if (lines.has(i)) {
			const command = lines.get(i);
			if (command && command.trim().startsWith(targetCommand)) {
				return i;
			}
		}
	}
	return null;
}

async function delay(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

function ManageCommand(lineNum: number, line: string) {
	const parts = line.split(" ");
	const commandName = parts[0].toLowerCase();
	const args = parts.slice(1);

	const cmd = parseCommand(line);

	if (cmd) {
		cmd.run(line);
		return;
	}

	if (commandName === "let") {
		handleLet(args.join(" "));
		return;
	}

	if (commandName === "goto") {
		gotoLine(args);
		return;
	}

	if (commandName === "sleep") {
		if (args.length === 0 || isNaN(parseInt(args[0]))) {
			terminalState.lines.push({
				type: "response",
				value: `Please provide a valid sleep duration in milliseconds. Line ${lineNum}`,
			});
			return;
		}
		const sleepDuration = parseInt(args[0]);
		delay(sleepDuration);
		return;
	}

	if (commandName === "print") {
		handlePrint(args.join(" "));
		return;
	}

	if (commandName === "else") {
		const nextIfLine = findNextCommandLine(lineNum, "endif");
		if (nextIfLine !== null) {
			currentLine = nextIfLine + 1;
		} else {
			terminalState.lines.push({
				type: "response",
				value: `Invalid else on line ${lineNum}. Perhaps you forget an endif?`,
			});
			terminalState.executingScript = false;
			return;
		}
		return;
	}

	if (commandName === "endif") {
		// These commands are handled in the if command logic
		return;
	}

	if (commandName === "if") {
		const conditionMet = handleIf(args.join(" "));

		if (!conditionMet) {
			const nextElseLine = findNextCommandLine(lineNum, "else");
			const nextEndIfLine = findNextCommandLine(lineNum, "endif");

			if (
				nextElseLine !== null &&
				(nextEndIfLine === null || nextElseLine < nextEndIfLine)
			) {
				// There's an else block before the endif, jump to the else
				currentLine =
					nextElseLine +
					(findNextLineNumber(nextElseLine) || nextElseLine + 1);
			} else if (nextEndIfLine !== null) {
				// No else block (or else comes after endif somehow), jump past the endif
				currentLine =
					nextEndIfLine +
					(findNextLineNumber(nextEndIfLine) || nextEndIfLine + 1);
			} else {
				terminalState.lines.push({
					type: "response",
					value: `No matching endif found for if statement on line ${lineNum}.`,
				});
				terminalState.executingScript = false;
				return;
			}
		}
		return;
	}

	if (getVar(commandName) !== undefined) {
		handleVariableCommand(line);
		return;
	}

	terminalState.lines.push({
		type: "response",
		value: `Unknown command "${commandName}" on line ${lineNum}.`,
	});
}

function findNextLineNumber(startLine: number): number | null {
	const keys = Array.from(lines.keys());
	const largerKeys = keys.filter((k) => k > startLine);
	return largerKeys.length > 0 ? Math.min(...largerKeys) : null;
}

async function runScript(args: string[]) {
	const orderedLines: Map<number, string> = new Map(
		Array.from(lines.entries()).sort((a, b) => a[0] - b[0])
	);

	stringVars.clear();
	numberVars.clear();

	const largestLineNumber =
		orderedLines.size > 0
			? Math.max(...Array.from(orderedLines.keys()))
			: 0;

	currentLine = 0;
	terminalState.executingScript = true;

	while (currentLine <= largestLineNumber && terminalState.executingScript) {
		if (!orderedLines.has(currentLine)) {
			const nextLine =
				findNextLineNumber(currentLine) || largestLineNumber + 1;
			currentLine = nextLine;
			continue;
		}

		const command = orderedLines.get(currentLine);
		const originalLine = currentLine;

		if (command) {
			ManageCommand(currentLine, command);
		} else {
			console.warn(`No command to execute for line ${currentLine}`);
		}

		// Only advance to next line if currentLine wasn't changed by a jump command
		if (currentLine === originalLine) {
			const nextLine =
				findNextLineNumber(currentLine) || largestLineNumber + 1;
			currentLine = nextLine;
		}

		// Scroll to the bottom of the terminal to show the latest output
		window.scrollTo(0, document.body.scrollHeight);

		await delay(0);
	}

	terminalState.executingScript = false;
}

export function HaltScript() {
	if (!terminalState.executingScript) {
		return;
	}

	terminalState.executingScript = false;

	terminalState.lines.push({
		type: "response",
		value: `Script execution forcibly stopped at line ${currentLine}.`,
	});
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
	let renumberedLines: Map<number, number> = new Map();

	const distance = 10;

	lines = new Map(
		Array.from(lines.entries()).map((line, index) => {
			renumberedLines.set(line[0], (index + 1) * distance);
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
