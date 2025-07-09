<script lang="ts">
	import { page } from "$app/state";
	import { onMount } from "svelte";

	let { children } = $props();

	type link = {
		name: string;
		href: string;
		expanded?: boolean;
		subLinks?: link[];
	};

	const links: link[] = $state([
		{ name: "Home", href: "/docs" },
		{ name: "Introduction", href: "/docs/intro" },
		{
			name: "Variables",
			href: "/docs/variables",
			expanded: false,
			subLinks: [
				{
					name: "Creating Variables",
					href: "/docs/variables",
				},
				{
					name: "Mutating Variables",
					href: "/docs/variables/mutating",
				},
				{
					name: "Built-in functions",
					href: "/docs/variables/builtins",
				},
			],
		},
		{ name: "Input / Output", href: "/docs/input" },
		{ name: "Loops", href: "/docs/loops" },
		{ name: "If Statements", href: "/docs/if" },
	]);

	$effect(() => {
		console.log("Current page:", page.url.pathname);
	});

	onMount(() => {
		links.forEach((link) => {
			if (link.subLinks) {
				link.expanded = link.subLinks.some(
					(subLink) => subLink.href === page.url.pathname
				);
			}
		});
	});
</script>

<div
	class="w-screen h-screen grid grid-cols-[0.2fr_1fr] grid-rows-[2fr_0.1fr] items-center p-10"
>
	<div class="flex flex-col h-full gap-2 text-lg border-r border-gray-300">
		{#each links as link}
			{#if link.subLinks}
				<div class="flex flex-col">
					<button
						class="font-bold w-full text-left inline-block"
						onclick={() => (link.expanded = !link.expanded)}
						><span
							class={`${link.expanded ? "rotate-90" : ""} inline-block transition-transform duration-75`}
							>&gt;</span
						>
						{link.name}</button
					>
					{#if link.expanded}
						{#each link.subLinks as subLink}
							<a
								class={`${
									page.url.pathname === subLink.href
										? "text-blue-500"
										: ""
								} hover:text-blue-300 pl-4`}
								href={subLink.href}
							>
								{subLink.name}
							</a>
						{/each}
					{/if}
				</div>
			{:else}
				<a
					class={`${
						page.url.pathname === link.href ? "text-blue-500" : ""
					} hover:text-blue-300`}
					href={link.href}
				>
					{link.name}
				</a>
			{/if}
		{/each}
	</div>

	<article class="flex flex-col items-center w-full h-full px-32">
		{@render children()}
	</article>

	<div
		class="w-full h-10 col-span-2 border-t border-gray-300 pt-4 flex flex-row-reverse gap-4 pr-5"
	>
		<a
			href="https://github.com/liamg2810"
			target="__away"
			class="flex h-full items-center gap-2 text-lg hover:text-blue-300"
			><img
				src="/github-mark-white.svg"
				alt="Github Logo"
				class="aspect-square h-full"
			/>Github</a
		>
		<a
			href="mailto:liam@zelv.co.uk"
			target="__away"
			class="flex h-full items-center gap-2 text-lg hover:text-blue-300"
			><img
				src="/email.svg"
				alt="Email Logo"
				class="aspect-square h-full"
			/>Contact Me</a
		>
		<a href="/" class=" flex-1 pl-3 hover:text-blue-300">Back To Terminal</a
		>
	</div>
</div>
