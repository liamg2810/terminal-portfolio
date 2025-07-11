import * as universal from '../entries/pages/_layout.ts.js';

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_layout.svelte.js')).default;
export { universal };
export const universal_id = "src/routes/+layout.ts";
export const imports = ["_app/immutable/nodes/0.DF3YGJqz.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/CJDjr42K.js","_app/immutable/chunks/DPLFGynG.js","_app/immutable/chunks/CncUDn7n.js","_app/immutable/chunks/CH_KY5Um.js","_app/immutable/chunks/D-KzsYLn.js","_app/immutable/chunks/C-o-xBHO.js"];
export const stylesheets = ["_app/immutable/assets/0.DEyYf-kQ.css"];
export const fonts = [];
