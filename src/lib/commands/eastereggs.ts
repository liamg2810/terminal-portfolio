import { terminalState } from "$lib/terminal/terminal.svelte";
import { Command, registerCommand } from "./command";

let installedPackages: Set<string> = new Set();

function sudoCommand(args: string[]) {
	terminalState.lines.push({
		type: "response",
		value: "Access denied. You are not root yet... or are you?",
	});
}

function rmCommand(args: string[]) {
	const parameters: string[] = args.filter((arg) => arg.startsWith("-"));
	const files: string[] = args.filter((arg) => !arg.startsWith("-"));

	if (files.length === 0) {
		terminalState.lines.push({
			type: "response",
			value: "Usage: rm <file>",
		});
		return;
	}

	if (parameters.includes("-rf") && files.includes("./")) {
		terminalState.lines.push({
			type: "response",
			value: "You really shouldn't do that... but okay, if you insist.",
		});
		return;
	}

	if (files.some((f) => f.endsWith("/"))) {
		terminalState.lines.push({
			type: "response",
			value: "The directory is not empty.",
		});
	}

	terminalState.lines.push({
		type: "response",
		value: `You do not have permission to execute this command. Maybe try 'sudo'?`,
	});
}

function eastereggCommand(args: string[]) {
	terminalState.lines.push({
		type: "response",
		value: "You found an easter egg! Here's a fun fact: Did you know that the first computer bug was an actual moth? It was found in a Harvard Mark II computer in 1947.",
	});
}

function highgroundCommand(args: string[]) {
	terminalState.lines.push({
		type: "response",
		value: "You underestimate my power!",
	});
}

function chessCommand(args: string[]) {
	terminalState.lines.push({
		type: "response",
		value: `
		Here's a chessboard for you:
 		/**
 		 *[♖][♘][♗][♕][♔][♗][♘][♖]
 		 *[♙][♙][♙][♙][♙][♙][♙][♙]
 		 *[▮][  ][▮][  ][▮][  ][▮][  ]
 		 *[  ][▮][  ][▮][  ][▮][  ][▮]
 		 *[▮][  ][▮][  ][▮][  ][▮][  ]
 		 *[  ][▮][  ][▮][  ][▮][  ][▮]
 		 *[♟][♟][♟][♟][♟][♟][♟][♟]
 		 *[♜][♞][♝][♛][♚][♝][♞][♜]
 		*/`,
	});
}

function packageManagerCommand(args: string[]) {
	const flags = args.filter((arg) => arg.startsWith("-"));
	const packages = args.filter((arg) => !arg.startsWith("-"));

	if (packages.length === 0 && !flags.includes("-l")) {
		terminalState.lines.push({
			type: "response",
			value: "No packages specified. Please provide package names.",
		});
		return;
	}

	if (flags.includes("-i") || flags.includes("--install")) {
		terminalState.lines.push({
			type: "response",
			value: `Installing packages: ${packages.join(", ")}`,
		});

		packages.forEach((pkg) => {
			if (!installedPackages.has(pkg)) {
				installedPackages.add(pkg);
				terminalState.lines.push({
					type: "response",
					value: `Package ${pkg} installed successfully.`,
				});
			} else {
				terminalState.lines.push({
					type: "response",
					value: `Package ${pkg} is already installed.`,
				});
			}
		});
	} else if (flags.includes("-u") || flags.includes("--uninstall")) {
		terminalState.lines.push({
			type: "response",
			value: `Uninstalling packages: ${packages.join(", ")}`,
		});

		packages.forEach((pkg) => {
			if (installedPackages.has(pkg)) {
				installedPackages.delete(pkg);
				terminalState.lines.push({
					type: "response",
					value: `Package ${pkg} uninstalled successfully.`,
				});
			} else {
				terminalState.lines.push({
					type: "response",
					value: `Package ${pkg} is not installed.`,
				});
			}
		});
	} else if (flags.includes("-l") || flags.includes("--list")) {
		terminalState.lines.push({
			type: "response",
			value: `Listing installed packages: ${
				Array.from(installedPackages).join(", ") ||
				"No packages installed."
			}`,
		});
	} else {
		terminalState.lines.push({
			type: "response",
			value: "Unknown command. Use -i, -u, or -l.",
		});
	}

	localStorage.setItem(
		"installedPackages",
		JSON.stringify(Array.from(installedPackages))
	);
}

function echoCommand(args: string[]) {
	if (args.length === 0) {
		terminalState.lines.push({
			type: "response",
			value: "Usage: echo <message>",
		});
		return;
	}
	terminalState.lines.push({
		type: "response",
		value: args.join(" "),
	});
}

export function RegisterEasterEggs() {
	const sudo = new Command(sudoCommand);
	const rm = new Command(rmCommand);
	const easteregg = new Command(eastereggCommand);
	const highground = new Command(highgroundCommand);
	const chess = new Command(chessCommand);
	const packageManager = new Command(packageManagerCommand);
	const echo = new Command(echoCommand);

	const storedPackages = localStorage.getItem("installedPackages");
	if (storedPackages) {
		installedPackages = new Set(JSON.parse(storedPackages));
	} else {
		installedPackages = new Set();
	}

	registerCommand("sudo", sudo);
	registerCommand("rm", rm);
	registerCommand("easteregg", easteregg);
	registerCommand("highground", highground);
	registerCommand("chess", chess);
	registerCommand("pacman", packageManager);
	registerCommand("pkg", packageManager);
	registerCommand("yum", packageManager);
	registerCommand("apt", packageManager);
	registerCommand("echo", echo);
}
