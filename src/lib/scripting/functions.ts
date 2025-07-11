import { currentLine, lines, setCurrentLine } from "./scripting";
import { findNextLineNumber, FindPairedEndDef, ThrowError } from "./utils";
import { scopes } from "./vars";

let functions: { name: string; lineNum: number; endLine: number }[] = [];

let stack: number[] = [];

export function FindFunctions(output: (message: string) => void) {
	functions = [];
	stack = [];

	Array.from(lines.entries()).forEach(([lineNum, command]) => {
		if (!command.trim().startsWith("def")) {
			return;
		}

		const functionName = command.split(" ")[1];

		if (!functionName) {
			ThrowError("Function name is missing.", output);
			return;
		}

		if (functions.some((f) => f.name === functionName)) {
			ThrowError(
				`Function '${functionName}' is already defined.`,
				output
			);
			return;
		}

		const endLine = FindPairedEndDef(lineNum);

		if (endLine === null) {
			ThrowError(
				`No matching 'enddef' found for function '${functionName}' at line ${lineNum}.`,
				output
			);
			return;
		}

		functions.push({
			name: functionName,
			lineNum,
			endLine,
		});
	});
}

export function CallFunction(name: string, output: (message: string) => void) {
	const func = functions.find((f) => f.name === name);

	if (!func) {
		ThrowError(`Function '${name}' is not defined.`, output);
		return;
	}

	stack.push(currentLine);
	scopes.push(new Map());
	setCurrentLine(findNextLineNumber(func.lineNum) || func.endLine);
}

export function EndFunction(output: (message: string) => void) {
	if (stack.length === 0) {
		// Function must have never been called? Silently ignore.
		return;
	}

	let returnLine = stack.pop();

	scopes.pop();

	if (returnLine !== undefined) {
		returnLine = findNextLineNumber(returnLine) || returnLine + 1;

		setCurrentLine(returnLine);
	} else {
		ThrowError("Failed to return from function.", output);
	}
}

export function StepOverFunction(
	parts: string[],
	output: (message: string) => void
) {
	const functionName = parts[0].trim();

	if (!functionName) {
		ThrowError("Function name is missing.", output);
		return;
	}

	const func = functions.find((f) => f.name === functionName);

	if (!func) {
		ThrowError(`Function '${functionName}' is not defined.`, output);
		return;
	}

	setCurrentLine(findNextLineNumber(func.endLine) || func.endLine);
}

export function FuncExists(name: string): boolean {
	return functions.some((f) => f.name === name);
}
