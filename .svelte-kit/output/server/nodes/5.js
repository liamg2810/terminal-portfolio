

export const index = 5;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/docs/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/5.C6HyqEyD.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/6VMXeIIO.js","_app/immutable/chunks/DPLFGynG.js"];
export const stylesheets = [];
export const fonts = [];
