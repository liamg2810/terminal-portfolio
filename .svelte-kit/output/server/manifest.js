export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["email.svg","favicon.png","github-mark-white.svg","github-mark.svg"]),
	mimeTypes: {".svg":"image/svg+xml",".png":"image/png"},
	_: {
		client: {start:"_app/immutable/entry/start.BdxHQ1iB.js",app:"_app/immutable/entry/app.Ck5tarqF.js",imports:["_app/immutable/entry/start.BdxHQ1iB.js","_app/immutable/chunks/Beh8XOOs.js","_app/immutable/chunks/CJDjr42K.js","_app/immutable/chunks/DPLFGynG.js","_app/immutable/chunks/CncUDn7n.js","_app/immutable/chunks/CH_KY5Um.js","_app/immutable/chunks/C-o-xBHO.js","_app/immutable/entry/app.Ck5tarqF.js","_app/immutable/chunks/DPLFGynG.js","_app/immutable/chunks/CJDjr42K.js","_app/immutable/chunks/CncUDn7n.js","_app/immutable/chunks/CH_KY5Um.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/DNQr9wEM.js","_app/immutable/chunks/CgpH4TcC.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
		nodes: [
			__memo(() => import('./nodes/0.js')),
			__memo(() => import('./nodes/1.js'))
		],
		routes: [
			
		],
		prerendered_routes: new Set(["/","/docs/","/docs/if/","/docs/input/","/docs/intro/","/docs/loops/","/docs/variables/","/docs/variables/builtins/","/docs/variables/mutating/"]),
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})();
