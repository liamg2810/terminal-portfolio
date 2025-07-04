import { addLine } from "./scripting";

export type TExecute = (args: string[]) => void;

let commands: Map<string, Command> = new Map();

export class Command {
	execute: TExecute;

	constructor(execute: TExecute) {
		this.execute = execute;
	}

	run(cmd: string) {
		const args = cmd.split(" ").slice(1);
		this.execute(args);
	}
}

export function registerCommand(name: string, command: Command) {
	if (commands.has(name)) {
		throw new Error(`Command ${name} already exists.`);
	}

	commands.set(name, command);
}

export function parseCommand(cmd: string): Command | undefined {
	const commandName = cmd.split(" ")[0];

	return commands.get(commandName);
}
