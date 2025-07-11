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
		client: {start:"_app/immutable/entry/start.D6Z5xX-U.js",app:"_app/immutable/entry/app.BYG12iTZ.js",imports:["_app/immutable/entry/start.D6Z5xX-U.js","_app/immutable/chunks/BDH3ey0G.js","_app/immutable/chunks/CJDjr42K.js","_app/immutable/chunks/DPLFGynG.js","_app/immutable/chunks/CncUDn7n.js","_app/immutable/chunks/CH_KY5Um.js","_app/immutable/chunks/C-o-xBHO.js","_app/immutable/entry/app.BYG12iTZ.js","_app/immutable/chunks/DPLFGynG.js","_app/immutable/chunks/CJDjr42K.js","_app/immutable/chunks/CncUDn7n.js","_app/immutable/chunks/CH_KY5Um.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/DNQr9wEM.js","_app/immutable/chunks/CgpH4TcC.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
		nodes: [
			__memo(() => import('./nodes/0.js')),
			__memo(() => import('./nodes/1.js')),
			__memo(() => import('./nodes/2.js')),
			__memo(() => import('./nodes/3.js')),
			__memo(() => import('./nodes/4.js')),
			__memo(() => import('./nodes/5.js')),
			__memo(() => import('./nodes/6.js')),
			__memo(() => import('./nodes/7.js')),
			__memo(() => import('./nodes/8.js')),
			__memo(() => import('./nodes/9.js')),
			__memo(() => import('./nodes/10.js')),
			__memo(() => import('./nodes/11.js')),
			__memo(() => import('./nodes/12.js'))
		],
		routes: [
			{
				id: "/(term)",
				pattern: /^\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 4 },
				endpoint: null
			},
			{
				id: "/docs",
				pattern: /^\/docs\/?$/,
				params: [],
				page: { layouts: [0,3,], errors: [1,,], leaf: 5 },
				endpoint: null
			},
			{
				id: "/docs/if",
				pattern: /^\/docs\/if\/?$/,
				params: [],
				page: { layouts: [0,3,], errors: [1,,], leaf: 6 },
				endpoint: null
			},
			{
				id: "/docs/input",
				pattern: /^\/docs\/input\/?$/,
				params: [],
				page: { layouts: [0,3,], errors: [1,,], leaf: 7 },
				endpoint: null
			},
			{
				id: "/docs/intro",
				pattern: /^\/docs\/intro\/?$/,
				params: [],
				page: { layouts: [0,3,], errors: [1,,], leaf: 8 },
				endpoint: null
			},
			{
				id: "/docs/loops",
				pattern: /^\/docs\/loops\/?$/,
				params: [],
				page: { layouts: [0,3,], errors: [1,,], leaf: 9 },
				endpoint: null
			},
			{
				id: "/docs/variables",
				pattern: /^\/docs\/variables\/?$/,
				params: [],
				page: { layouts: [0,3,], errors: [1,,], leaf: 10 },
				endpoint: null
			},
			{
				id: "/docs/variables/builtins",
				pattern: /^\/docs\/variables\/builtins\/?$/,
				params: [],
				page: { layouts: [0,3,], errors: [1,,], leaf: 11 },
				endpoint: null
			},
			{
				id: "/docs/variables/mutating",
				pattern: /^\/docs\/variables\/mutating\/?$/,
				params: [],
				page: { layouts: [0,3,], errors: [1,,], leaf: 12 },
				endpoint: null
			}
		],
		prerendered_routes: new Set([]),
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})();
