/** @type {import('tailwindcss').Config} */
export default {
	content: ["./src/**/*.{html,js,svelte,ts}"],
	theme: {
		extend: {},
	},
	plugins: [],
	safelist: [
		// Safelist the color classes used in your terminal
		"text-neutral-100", // 0 - White
		"text-blue-500", // 1 - Blue
		"text-green-500", // 2 - Green
		"text-cyan-400", // 3 - Aqua
		"text-red-500", // 4 - Red
		"text-purple-500", // 5 - Purple
		"text-yellow-500", // 6 - Yellow
		"text-gray-500", // 7 - Gray
		"text-pink-400", // 8 - Pink
		"text-orange-500", // 9 - Orange
		"text-amber-900", // 10 - Brown
		"text-black", // 11 - Black
		"text-green-300", // 12 - Light Green
	],
};
