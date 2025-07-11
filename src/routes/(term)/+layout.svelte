<script lang="ts">
	import { addKey, removeKey } from "$lib/stores/keys";
	import { onMount } from "svelte";

	let { children } = $props();

	function handleKeyDown(event: KeyboardEvent) {
		addKey(event.key.toLowerCase());
	}

	function handleKeyUp(event: KeyboardEvent) {
		removeKey(event.key.toLowerCase());
	}

	onMount(() => {
		window.addEventListener("keydown", handleKeyDown);
		window.addEventListener("keyup", handleKeyUp);

		return () => {
			window.removeEventListener("keydown", handleKeyDown);
			window.removeEventListener("keyup", handleKeyUp);
		};
	});
</script>

<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<main class="h-screen pb-10" role="application">
	{@render children()}
</main>
