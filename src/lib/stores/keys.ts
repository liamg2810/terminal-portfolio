import { get, writable } from "svelte/store";

export const keys = writable<Set<string>>(new Set());

export function addKey(key: string) {
	const currentKeys = get(keys);
	currentKeys.add(key);
	keys.set(currentKeys);
}

export function removeKey(key: string) {
	const currentKeys = get(keys);

	if (!currentKeys.has(key)) {
		return;
	}

	currentKeys.delete(key);
	keys.set(currentKeys);
}
