import { writable } from "svelte/store";

export const uptime = writable("0h 0m 0s");

export function startUptimeTracker() {
	let startTime: Date;

	const saved = sessionStorage.getItem("startTime");
	if (saved) {
		startTime = new Date(Number(saved));
	} else {
		startTime = new Date();
		sessionStorage.setItem("startTime", startTime.getTime().toString());
	}

	const interval = setInterval(() => {
		const now = new Date();
		const diff = now.getTime() - startTime.getTime();

		const hours = Math.floor(diff / 3600000);
		const minutes = Math.floor((diff % 3600000) / 60000);
		const seconds = Math.floor((diff % 60000) / 1000);

		uptime.set(`${hours}h ${minutes}m ${seconds}s`);
	}, 1000);

	return () => clearInterval(interval);
}
