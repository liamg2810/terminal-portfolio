import { terminalState } from "$lib/terminal/terminal.svelte";
import { Command, registerCommand } from "./command";

function nameCommand(args: string[]) {
	terminalState.lines.push({
		type: "response",
		value: `
		/**
		* ...........................................................................................................................
		* 8.8888..........8.8888...........8....................,8........,8.........................................................
		* 8.8888..........8.8888..........888..................,888......,888........................................................
		* 8.8888..........8.8888........:88888.................\`8888.....\`8888.......................................................
		* 8.8888..........8.8888.........\`88888..............,8.\`8888..,8.\`8888......................................................
		* 8.8888..........8.8888.......8..\`88888............,8'8.\`8888,8^8.\`8888.....................................................
		* 8.8888..........8.8888......8\`8..\`88888..........,8'.\`8.\`8888'.\`8.\`8888....................................................
		* 8.8888..........8.8888.....8'.\`8..\`88888........,8'...\`8.\`88'...\`8.\`8888...................................................
		* 8.8888..........8.8888....8'...\`8..\`88888......,8'.....\`8.\`'.....\`8.\`8888..................................................
		* 8.8888..........8.8888...888888888..\`88888....,8'.......\`8........\`8.\`8888.................................................
		* 8.888888888888..8.8888..8'.......\`8..\`88888..,8'.........\`.........\`8.\`8888................................................
		* ...........................................................................................................................
		* .....,o888888o...............8...........8.888888888o....8.888888888o.......b..............8.8.8888888888...8.888888888o...
		* ....8888.....\`88............888..........8.8888....\`88...8.8888....\`^888....888o...........8.8.8888.........8.8888....\`88..
		* .,8.8888.......\`8.........:88888.........8.8888.....\`88..8.8888........\`88..Y88888o........8.8.8888.........8.8888.....\`88.
		* .88.8888...................\`88888........8.8888.....,88..8.8888.........\`88..\`Y888888o.....8.8.8888.........8.8888.....,88.
		* .88.8888.................8..\`88888.......8.8888....,88'..8.8888..........88.8o..\`Y888888o..8.8.888888888888.8.8888....,88'.
		* .88.8888................8\`8..\`88888......8.888888888P'...8.8888..........88.8\`Y8o..\`Y88888o8.8.8888.........8.888888888P'..
		* .88.8888...8888888.....8'.\`8..\`88888.....8.8888\`8b.......8.8888.........,88.8...\`Y8o..\`Y8888.8.8888.........8.8888\`8b......
		* .\`8.8888........8'....8'...\`8..\`88888....8.8888.\`8b......8.8888........,88'.8......\`Y8o..\`Y8.8.8888.........8.8888.\`8b.....
		* ....8888.....,88'....888888888..\`88888...8.8888...\`8b....8.8888....,o88P'...8.........\`Y8o.\`.8.8888.........8.8888...\`8b...
		* .....\`8888888P'.....8'.......\`8..\`88888..8.8888.....\`88..8.888888888P'......8............\`Yo.8.888888888888.8.8888.....\`88.
		*/
		`,
	});
}

export function RegisterNameCommand() {
	const name = new Command(nameCommand);
	registerCommand("name", name);
}
