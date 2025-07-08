<script lang="ts">
	import { page } from "$app/state";

	const links: { name: string; href: string }[] = [
		{ name: "Home", href: "/docs" },
		{ name: "Variables", href: "/docs/variables" },
		{ name: "Commands", href: "/docs/commands" },
		{ name: "Scripting", href: "/docs/scripting" },
		{ name: "Terminal", href: "/docs/terminal" },
	];

	$effect(() => {
		console.log("Current page:", page.url.pathname);
	});
</script>

<div class="w-screen h-screen flex items-center p-10">
	<div
		class="flex flex-col w-1/8 h-full gap-2 text-lg border-r border-gray-300"
	>
		{#each links as link}
			<a
				class={`${
					page.url.pathname === link.href
						? "text-blue-500"
						: "text-gray-500"
				} hover:text-blue-700`}
				href={link.href}
			>
				{link.name}
			</a>
		{/each}
	</div>

	<article class="flex flex-col items-center w-full h-full px-32">
		<span class="text-lg">Thanks for checking out my portfolio! </span>
		<h1 class="text-5xl font-bold mt-3">Documentation for Zelv lang</h1>

		<hr class="w-full h-px mt-6 border-gray-200" />
		<h3 class="text-3xl font-medium my-6">About this project</h3>

		<p class="text-lg">
			This portfolio project was meant to be nothing more than a basic
			terminal emulator. It was something I purely wanted to experiment
			with and just have something to show off my skills. It has since
			then became a much larger project, with a completly custom scripting
			language that I will call Zelv lang.
		</p>
	</article>
</div>
