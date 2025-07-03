<script lang="ts">
	import { textCommands } from "$lib/commands";
	import { onMount, tick } from "svelte";

	let text: string = $state("");
	let lines: { type: "input" | "response"; value: string }[] = $state([]);
	let textareaRef: HTMLTextAreaElement;

	function HandleCommand(command: string) {
		command = command.trim();
		const cmd = textCommands.get(command);

		if (command === "clear") {
			lines = [];
			text = "";
			console.log("Terminal cleared");
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

	onMount(() => {
		textareaRef.focus();
	});
</script>

<button
	class="w-full h-full flex flex-col text-neutral-100 px-3"
	role="textbox"
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
		></textarea>
	</div>
</button>
