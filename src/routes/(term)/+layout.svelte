<script lang="ts">
	import "../../app.css";

	let { children } = $props();
</script>

<div class="h-screen pb-10">
	{@render children()}
</div>

<style>
	:global(body) {
		background-color: #1e1e1e; /* Dark background for terminal */
		color: #ffffff; /* Default text color */
	}

	:global(*, *::before, *::after) {
		box-sizing: border-box;
		font-family: "Ubuntu Mono", monospace; /* Default font for all elements */
	}
</style>
