<script lang="ts">
	import { onMount } from "svelte";

	let text: string = $state("");
	let lines: string[] = $state([]);
	let textareaRef: HTMLTextAreaElement;

	function handleKeyPress(event: KeyboardEvent) {
		console.log(event.metaKey);
		if (event.key === "Enter") {
			event.preventDefault();
			lines.push(text);
			text = "";

			// Scroll to the bottom of the terminal
			window.scrollTo(0, document.body.scrollHeight);
		} else if (event.key.toLowerCase() === "c" && event.ctrlKey) {
			event.preventDefault();
			text = "";
			console.log("Control + C pressed, clearing input");
		}
	}

	onMount(() => {
		textareaRef.focus();
	});
</script>

<button
	class="max-w-screen w-screen overflow-x-hidden min-h-screen h-auto flex flex-col bg-neutral-900 text-neutral-100 p-3 text-wrap"
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
			<span class="pt-2">>>></span>
			<div class="pt-2 pl-3">
				{line}
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
