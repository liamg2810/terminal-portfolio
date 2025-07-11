<script lang="ts">
	import { startUptimeTracker } from "$lib/stores/uptime";
	import { onMount } from "svelte";
	import "../app.css";

	let { children } = $props();

	onMount(() => {
		startUptimeTracker();
	});
</script>

{@render children()}

<style>
	:global(body) {
		background-color: #1e1e1e;
		color: #ffffff;
	}

	:global(*, *::before, *::after) {
		box-sizing: border-box;
		font-family: "Ubuntu Mono", monospace;
	}

	:global(code) {
		background-color: #2d2d2d;
		color: #dcdcdc;
		padding: 0.2em 0.4em;
		border-radius: 4px;
		font-size: 0.9em;
	}

	:global(kbd) {
		background-color: #4f4f4f;
		color: #ffffff;
		padding: 0.2em 0.4em;
		border-radius: 4px;
		font-size: 0.9em;
	}
</style>
