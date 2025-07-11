import { terminalState } from "$lib/terminal/terminal.svelte";
import { currentLine, lines } from "./scripting";

export async function delay(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

export function ThrowError(message: string, output: (message: string) => void) {
	output(`Error on line ${currentLine}: ${message}`);
	terminalState.executingScript = false;
	terminalState.awaitingInput = false;
	terminalState.inputValue = "";
}

export function SplitTokens(command: string): string[] {
	// Split by spaces, but keep quoted strings together
	// Split parentheses as seperate tokens
	const regex = /"([^"]*)"|([^\s()]+)|(\()|(\))/g;
	const tokens: string[] = [];
	let match;

	while ((match = regex.exec(command)) !== null) {
		if (match[1]) {
			// Quoted string
			tokens.push(`"${match[1]}"`);
		} else if (match[2]) {
			// Non-quoted token
			tokens.push(match[2]);
		} else if (match[3]) {
			// Opening parenthesis
			tokens.push("(");
		} else if (match[4]) {
			// Closing parenthesis
			tokens.push(")");
		}
	}

	return tokens;
}

export function FindPairedElse(lineNumber: number): number | null {
	let depth = 0;

	for (
		let i = lineNumber + 1;
		i <= Math.max(...Array.from(lines.keys()));
		i++
	) {
		if (!lines.has(i)) continue;

		const line = lines.get(i);
		if (!line) continue;

		if (line.trim().startsWith("if")) {
			depth++;
		} else if (line.trim().startsWith("else")) {
			if (depth === 0) {
				return i;
			}
			depth--;
		} else if (line.trim().startsWith("endif")) {
			if (depth === 0) {
				return null; // No paired else found
			}
			depth--;
		}
	}

	return null; // No paired else found
}

export function FindPairedEndIf(lineNumber: number): number | null {
	let depth = 0;

	for (
		let i = lineNumber + 1;
		i <= Math.max(...Array.from(lines.keys()));
		i++
	) {
		if (!lines.has(i)) continue;

		const line = lines.get(i);
		if (!line) continue;

		if (line.trim().startsWith("if")) {
			depth++;
		} else if (line.trim().startsWith("else")) {
			continue; // Skip else, we are looking for endif
		} else if (line.trim().startsWith("endif")) {
			if (depth === 0) {
				return i;
			}
			depth--;
		}
	}

	return null; // No paired endif found
}

export function FindPairedNext(lineNumber: number): number | null {
	let depth = 0;

	for (
		let i = lineNumber + 1;
		i <= Math.max(...Array.from(lines.keys()));
		i++
	) {
		if (!lines.has(i)) continue;

		const line = lines.get(i);
		if (!line) continue;

		if (line.trim().startsWith("for") || line.trim().startsWith("if")) {
			depth++;
		} else if (line.trim().startsWith("next") && depth === 0) {
			return i;
		} else if (
			line.trim().startsWith("next") ||
			line.trim().startsWith("endif")
		) {
			depth--;
		}
	}

	return null; // No paired next found
}

export function FindPairedEndDef(lineNumber: number): number | null {
	let depth = 0;

	for (
		let i = lineNumber + 1;
		i <= Math.max(...Array.from(lines.keys()));
		i++
	) {
		if (!lines.has(i)) continue;

		const line = lines.get(i);
		if (!line) continue;

		if (line.trim().startsWith("def")) {
			depth++;
		} else if (line.trim().startsWith("enddef")) {
			if (depth === 0) {
				return i;
			}
			depth--;
		}
	}
	return null; // No paired enddef found
}

export function findNextLineNumber(startLine: number): number | null {
	const keys = Array.from(lines.keys());
	const largerKeys = keys.filter((k) => k > startLine);
	return largerKeys.length > 0 ? Math.min(...largerKeys) : null;
}
