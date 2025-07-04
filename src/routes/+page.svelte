<script lang="ts">
	import { parseCommand } from "$lib/commands/command";
	import { RegisterAllCommands } from "$lib/commands/commands";
	import { addLine } from "$lib/commands/scripting";
	import {
		availableColors,
		changeColor,
		colorAlias,
		terminalState,
	} from "$lib/terminal/terminal.svelte";
	import { onMount, tick } from "svelte";

	let textareaRef: HTMLTextAreaElement;

	let blockInput: boolean = $state(true); // To block input when needed

	function HandleCommand(c: string) {
		const command = parseCommand(c);

		console.log(c);
		if (!isNaN(parseInt(c.split(" ")[0]))) {
			console.log("Adding line with number:", c);
			addLine(parseInt(c), c.split(" ").slice(1).join(" "));
			return;
		}

		if (!command) {
			terminalState.lines.push({
				type: "input",
				value: `Unknown command: ${c}. Type 'help' for a list of commands.`,
			});
			return;
		}

		command.run(c);
	}

	async function handleKeyPress(event: KeyboardEvent) {
		if (blockInput) {
			event.preventDefault();
			return;
		}

		if (event.key === "Enter") {
			event.preventDefault();

			terminalState.lines.push({
				type: "input",
				value: terminalState.text,
			});

			if (terminalState.text.trim() !== "") {
				HandleCommand(terminalState.text);
			}

			terminalState.text = "";
		} else if (event.key.toLowerCase() === "c" && event.ctrlKey) {
			event.preventDefault();
			terminalState.text = "";
			console.log("Control + C pressed, clearing input");
		}

		await tick();
		window.scrollTo(0, document.body.scrollHeight);
	}

	async function AnimateSendMessage(
		message: string,
		speed: number = 10,
		index: number = 0
	) {
		if (index < message.length) {
			terminalState.text = terminalState.text + message[index];
			setTimeout(() => AnimateSendMessage(message, speed, index + 1), 50);
			return;
		}

		terminalState.lines.push({
			type: "input",
			value: terminalState.text,
		});

		terminalState.text = ""; // Clear the input after sending the message
		blockInput = false; // Allow input after the startup message

		await tick();

		textareaRef.focus(); // Focus the textarea after sending the message
	}

	onMount(async () => {
		RegisterAllCommands();

		const startupMessage = `Welcome to my portfolio! Type 'help' for a list of commands.`;

		AnimateSendMessage(startupMessage);
	});
</script>

<button
	class={`w-full h-full flex flex-col text-${terminalState.color} px-3 focus:outline-none`}
	tabindex="0"
	aria-label="Terminal input"
	onclick={() => {
		// Focus the textarea when the terminal is clicked
		textareaRef.focus();
	}}
>
	{#each terminalState.lines as line}
		<div class="flex w-full">
			{#if line.type === "input"}
				<span class="pt-2">>>></span>
			{/if}
			<div class={`pt-2${line.type === "input" ? " pl-3" : ""}`}>
				{#each line.value.split("\n") as part, i}
					<span class=" flex text-left">
						{part.split(":link:")[0]}
						{#if part.split(":link:")[1]}
							<span>&nbsp;-&nbsp;</span>
							<a
								href={part.split(":link:")[1]}
								class="text-blue-500 hover:underline"
								target="_blank"
								rel="noopener noreferrer"
							>
								{part.split(":link:")[1]}
							</a>
						{/if}
					</span>
				{/each}
			</div>
		</div>
	{/each}

	<div class="flex flex-1 w-full">
		<span class="pt-2">>>></span>
		<textarea
			onkeydown={handleKeyPress}
			bind:value={terminalState.text}
			class="resize-none bg-transparent border-none outline-none focus:ring-0 hover:cursor-default w-full"
			bind:this={textareaRef}
			disabled={blockInput}
		></textarea>
	</div>
</button>
