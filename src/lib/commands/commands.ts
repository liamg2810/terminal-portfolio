import { RegisterAboutCommand } from "./about";
import { RegisterClearCommand } from "./clear";
import { RegisterColorsCommand } from "./colors";
import { RegisterDateCommand } from "./date";
import { RegisterEasterEggs } from "./eastereggs";
import { RegisterHelpCommand } from "./help";
import { RegisterNameCommand } from "./name";
import { RegisterProjectsCommand } from "./projects";

export function RegisterAllCommands() {
	RegisterHelpCommand();
	RegisterAboutCommand();
	RegisterNameCommand();
	RegisterClearCommand();
	RegisterProjectsCommand();
	RegisterColorsCommand();
	RegisterDateCommand();
	RegisterEasterEggs();
}
