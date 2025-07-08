export let terminalState: {
	text: string;
	lines: { type: "input" | "response" | "scriptin"; value: string }[];
	color: string;
	executingScript: boolean;
	inputValue: string;
	awaitingInput: boolean;
} = $state({
	text: "",
	lines: [],
	color: "neutral-100",
	executingScript: false,
	inputValue: "",
	awaitingInput: false,
});

export const availableColors: string[] = [
	"neutral-100", // 0 - White
	"blue-500", // 1 - Blue
	"green-500", // 2 - Green
	"cyan-400", // 3 - Aqua
	"red-500", // 4 - Red
	"purple-500", // 5 - Purple
	"yellow-500", // 6 - Yellow
	"gray-500", // 7 - Gray
	"pink-400", // 8 - Pink
	"orange-500", // 9 - Orange
	"amber-900", // 10 - Brown
	"black", // 11 - Black
	"green-300", // 12 - Light Green
];

export const colorAlias: string[] = [
	"white",
	"blue",
	"green",
	"aqua",
	"red",
	"purple",
	"yellow",
	"gray",
	"pink",
	"orange",
	"brown",
	"black",
	"light green",
];

export function changeColor(color: number) {
	if (color !== -1) {
		terminalState.color = availableColors[color];
	} else {
		console.warn(`Color "${color}" is not recognized.`);
	}
}
