<script lang="ts">
	import "../app.css";

	let { children } = $props();
</script>

<div class="h-screen pb-10">
	{@render children()}
</div>

<style>
	:global(body) {
		margin: 0;
		padding: 0;
		font-family: "Ubuntu Mono", monospace;
		background-color: #1e1e1e; /* Dark background for terminal */
	}
</style>
