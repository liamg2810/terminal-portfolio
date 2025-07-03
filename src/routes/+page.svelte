<script lang="ts">
	import { textCommands } from "$lib/commands";
	import { onMount, tick } from "svelte";

	let text: string = $state("");
	let lines: { type: "input" | "response"; value: string }[] = $state([]);

	const availableColors: string[] = [
		"neutral-100",
		"red-500",
		"green-500",
		"blue-500",
		"yellow-500",
		"pink-500",
	];

	const colorAlias: string[] = [
		"white",
		"red",
		"green",
		"blue",
		"yellow",
		"pink",
	];

	let currentColor: string = $state("neutral-100"); // Default color

	// Use the mapping instead of template literal
	let textColorClass = $derived("text-" + currentColor);

	let textareaRef: HTMLTextAreaElement;

	let blockInput: boolean = $state(true); // To block input when needed

	function HandleCommand(c: string) {
		const command = c.trim().split(" ")[0];
		const options = c.trim().split(" ").slice(1);
		const cmd = textCommands.get(command);

		if (command === "clear") {
			lines = [];
			text = "";
			console.log("Terminal cleared");
		} else if (command === "color") {
			if (options.length > 0) {
				let colorIndex: number = -1;

				try {
					colorIndex = parseInt(options[0], 10);
				} catch (e) {
					colorIndex = -1;
				}

				if (
					isNaN(colorIndex) ||
					colorIndex < 0 ||
					colorIndex >= availableColors.length
				) {
					lines.push({
						type: "response",
						value: "Invalid color. See `colors` for a list of available colors.",
					});
					return;
				}

				currentColor = availableColors[colorIndex];

				lines.push({
					type: "response",
					value: `Color changed to ${colorAlias[colorIndex]}.`,
				});
			} else {
				lines.push({
					type: "response",
					value: "No color specified. See `colors` for a list of available colors.",
				});
			}
		} else if (cmd) {
			lines.push({
				type: "response",
				value: cmd,
			});
		} else {
			lines.push({
				type: "response",
				value: `Unknown command: ${command}. Type 'help' for a list of commands.`,
			});
		}
	}

	async function handleKeyPress(event: KeyboardEvent) {
		if (blockInput) {
			event.preventDefault();
			return;
		}

		if (event.key === "Enter") {
			event.preventDefault();

			lines.push({
				type: "input",
				value: text,
			});

			if (text.trim() !== "") {
				HandleCommand(text);
			}

			text = "";
		} else if (event.key.toLowerCase() === "c" && event.ctrlKey) {
			event.preventDefault();
			text = "";
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
			text += message[index];
			setTimeout(() => AnimateSendMessage(message, speed, index + 1), 50);
			return;
		}

		lines.push({
			type: "input",
			value: text,
		});

		text = ""; // Clear the input after sending the message
		blockInput = false; // Allow input after the startup message

		await tick();

		textareaRef.focus(); // Focus the textarea after sending the message
	}

	onMount(async () => {
		const startupMessage = `Welcome to my portfolio! Type 'help' for a list of commands.`;

		AnimateSendMessage(startupMessage);
	});
</script>

<button
	class={`w-full h-full flex flex-col ${textColorClass} px-3 focus:outline-none`}
	tabindex="0"
	aria-label="Terminal input"
	onclick={() => {
		// Focus the textarea when the terminal is clicked
		textareaRef.focus();
	}}
>
	{#each lines as line}
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
			bind:value={text}
			class="resize-none bg-transparent border-none outline-none focus:ring-0 hover:cursor-default w-full"
			bind:this={textareaRef}
			disabled={blockInput}
		></textarea>
	</div>
</button>
