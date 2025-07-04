import { terminalState } from "$lib/terminal/terminal.svelte";
import { Command, registerCommand } from "./command";

function aboutCommand() {
	terminalState.lines.push({
		type: "response",
		value: `My name is Liam, I am a software developer with a passion for creating web applications.
I have experience in JavaScript, TypeScript, Svelte, and many more languages.
I enjoy building projects that solve real-world problems and improve user experiences.
I love Star Wars, Chess, and the Gym.
You can find more about me and my projects on my GitHub profile:link:https://github.com/liamg2810`,
	});
}

export function RegisterAboutCommand() {
	const about = new Command(aboutCommand);

	registerCommand("about", about);
	registerCommand("whoami", about); // Alias for 'about'
	registerCommand("me", about); // Another alias for 'about'
}
