<script lang="ts">
	import { parseCommand } from "$lib/commands/command";
	import { RegisterAllCommands } from "$lib/commands/commands";
	import {
		addLine,
		HaltScript,
		RegisterRunScript,
	} from "$lib/scripting/scripting";
	import { terminalState } from "$lib/terminal/terminal.svelte";
	import { onMount, tick } from "svelte";

	let textareaRef: HTMLTextAreaElement;

	$effect(() => {
		if (!terminalState.executingScript) {
			textareaRef.focus();
		}
	});

	$inspect(() => {
		if (terminalState.awaitingInput) {
			textareaRef.focus();
		}
	});

	let blockInput: boolean = $state(true); // To block input when needed

	function HandleCommand(c: string) {
		const command = parseCommand(c);

		if (!isNaN(parseInt(c.split(" ")[0]))) {
			addLine(parseInt(c), c.split(" ").slice(1).join(" "));
			return;
		}

		if (!command) {
			terminalState.lines.push({
				type: "response",
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

			if (terminalState.awaitingInput) {
				terminalState.inputValue = terminalState.text;
				terminalState.awaitingInput = false;
				terminalState.text = "";

				console.log("Input received:", terminalState.inputValue);

				terminalState.lines.push({
					type: "scriptin",
					value: terminalState.inputValue,
				});

				console.log(terminalState.lines);

				return;
			}

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
		RegisterRunScript((message: string) => {
			terminalState.lines.push({
				type: "response",
				value: message,
			});
		});

		const startupMessage = `Welcome to my portfolio! Type 'help' for a list of commands.`;

		blockInput = false;

		// AnimateSendMessage(startupMessage);

		document.addEventListener("keydown", (event) => {
			if (event.key === "Escape") {
				HaltScript();
				textareaRef.focus();
			}
		});
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
			{:else if line.type === "scriptin"}
				<span class="pt-2">?</span>
			{/if}
			<div class={`${line.type !== "response" ? "pt-2 pl-3" : ""}`}>
				{#each line.value.split("\n") as part, i}
					<span class="flex text-left text-base">
						<pre>{part.split(":link:")[0]}</pre>
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
		{#if !terminalState.executingScript}
			<span class="pt-2">>>></span>
		{/if}
		{#if terminalState.awaitingInput}
			<span class="pt-2">?</span>
		{/if}
		<textarea
			onkeydown={handleKeyPress}
			bind:value={terminalState.text}
			class="resize-none bg-transparent border-none outline-none focus:ring-0 hover:cursor-default w-full"
			bind:this={textareaRef}
			disabled={blockInput ||
				(terminalState.executingScript && !terminalState.awaitingInput)}
		></textarea>
	</div>
</button>
