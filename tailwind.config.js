/** @type {import('tailwindcss').Config} */
export default {
	content: ["./src/**/*.{html,js,svelte,ts}"],
	theme: {
		extend: {},
	},
	plugins: [],
	safelist: [
		// Safelist the color classes used in your terminal
		"text-neutral-100",
		"text-red-500",
		"text-green-500",
		"text-blue-500",
		"text-yellow-500",
		"text-pink-500",
	],
};
