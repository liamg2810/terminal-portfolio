// \n Creates a new line in the terminal
// :link: Creates a link in the terminal - must be the last part of the line
export const textCommands: Map<string, string> = new Map([
	[
		"help",
		"help - Show this help message\nclear - Clear the terminal\nabout - Learn about me\nprojects - List my projects",
	],
	[
		"about",
		"My name is Liam, I am a software developer with a passion for creating web applications. I have experience in JavaScript, TypeScript, Svelte, and Node.js. I enjoy building projects that solve real-world problems and improve user experiences.",
	],
	[
		"projects",
		"Chess  - A chess game with AI opponent:link:https://github.com/liamg2810/chess-react",
	],
]);
