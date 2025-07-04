import { RegisterAboutCommand } from "./about";
import { RegisterClearCommand } from "./clear";
import { RegisterColorsCommand } from "./colors";
import { RegisterDateCommand } from "./date";
import { RegisterEasterEggs } from "./eastereggs";
import { RegisterHelpCommand } from "./help";
import { RegisterProjectsCommand } from "./projects";

export function RegisterAllCommands() {
	RegisterHelpCommand();
	RegisterAboutCommand();
	RegisterClearCommand();
	RegisterProjectsCommand();
	RegisterColorsCommand();
	RegisterDateCommand();
	RegisterEasterEggs();
}
