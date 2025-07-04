import { terminalState } from "$lib/terminal/terminal.svelte";
import { Command, registerCommand } from "./command";

function projectsCommand(args: string[]) {
	terminalState.lines.push({
		type: "response",
		value: `Here are some of my projects:
1. Portfolio Website - A personal portfolio website showcasing my skills and projects.:link:https://www.github.com/liamg2810/terminal-portfolio
2. Chess Game - A web-based chess game with multiplayer support.:link:https://www.github.com/liamg2810/chess-react
`,
	});
}

export function RegisterProjectsCommand() {
	const projects = new Command(projectsCommand);

	registerCommand("projects", projects);
	registerCommand("project", projects); // Alias for 'projects'
	registerCommand("list-projects", projects); // Another alias for 'projects'
}
