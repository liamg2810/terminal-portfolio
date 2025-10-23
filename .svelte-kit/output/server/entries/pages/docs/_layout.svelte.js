import { w as getContext, x as ensure_array_like, y as attr_class, z as escape_html, A as attr, v as pop, t as push } from "../../../chunks/index.js";
import "clsx";
import { n as noop } from "../../../chunks/equality.js";
import { w as writable } from "../../../chunks/exports.js";
const SNAPSHOT_KEY = "sveltekit:snapshot";
const SCROLL_KEY = "sveltekit:scroll";
function create_updated_store() {
  const { set, subscribe } = writable(false);
  {
    return {
      subscribe,
      // eslint-disable-next-line @typescript-eslint/require-await
      check: async () => false
    };
  }
}
const is_legacy = noop.toString().includes("$$") || /function \w+\(\) \{\}/.test(noop.toString());
if (is_legacy) {
  ({
    data: {},
    form: null,
    error: null,
    params: {},
    route: { id: null },
    state: {},
    status: -1,
    url: new URL("https://example.com")
  });
}
function get(key, parse = JSON.parse) {
  try {
    return parse(sessionStorage[key]);
  } catch {
  }
}
get(SCROLL_KEY) ?? {};
get(SNAPSHOT_KEY) ?? {};
const stores = {
  updated: /* @__PURE__ */ create_updated_store()
};
({
  check: stores.updated.check
});
function context() {
  return getContext("__request__");
}
const page$1 = {
  get url() {
    return context().page.url;
  }
};
const page = page$1;
function _layout($$payload, $$props) {
  push();
  let { children } = $$props;
  const links = [
    { name: "Home", href: "/docs/" },
    { name: "Introduction", href: "/docs/intro/" },
    {
      name: "Variables",
      href: "/docs/variables/",
      expanded: false,
      subLinks: [
        { name: "Creating Variables", href: "/docs/variables/" },
        {
          name: "Mutating Variables",
          href: "/docs/variables/mutating/"
        },
        {
          name: "Built-in functions",
          href: "/docs/variables/builtins/"
        }
      ]
    },
    { name: "Input / Output", href: "/docs/input/" },
    { name: "Loops", href: "/docs/loops/" },
    { name: "If Statements", href: "/docs/if/" }
  ];
  const each_array = ensure_array_like(links);
  $$payload.out += `<div class="w-screen h-screen grid grid-cols-[0.2fr_1fr] grid-rows-[2fr_0.1fr] items-center p-10"><div class="flex flex-col h-full gap-2 text-lg border-r border-gray-300"><!--[-->`;
  for (let $$index_1 = 0, $$length = each_array.length; $$index_1 < $$length; $$index_1++) {
    let link = each_array[$$index_1];
    if (link.subLinks) {
      $$payload.out += "<!--[-->";
      $$payload.out += `<div class="flex flex-col"><button class="font-bold w-full text-left inline-block"><span${attr_class(`${link.expanded ? "rotate-90" : ""} inline-block transition-transform duration-75`)}>></span> ${escape_html(link.name)}</button> `;
      if (link.expanded) {
        $$payload.out += "<!--[-->";
        const each_array_1 = ensure_array_like(link.subLinks);
        $$payload.out += `<!--[-->`;
        for (let $$index = 0, $$length2 = each_array_1.length; $$index < $$length2; $$index++) {
          let subLink = each_array_1[$$index];
          $$payload.out += `<a${attr_class(`${page.url.pathname === subLink.href ? "text-blue-500" : ""} hover:text-blue-300 pl-4`)}${attr("href", subLink.href)}>${escape_html(subLink.name)}</a>`;
        }
        $$payload.out += `<!--]-->`;
      } else {
        $$payload.out += "<!--[!-->";
      }
      $$payload.out += `<!--]--></div>`;
    } else {
      $$payload.out += "<!--[!-->";
      $$payload.out += `<a${attr_class(`${page.url.pathname === link.href ? "text-blue-500" : ""} hover:text-blue-300`)}${attr("href", link.href)}>${escape_html(link.name)}</a>`;
    }
    $$payload.out += `<!--]-->`;
  }
  $$payload.out += `<!--]--></div> <article class="flex flex-col items-center w-full h-full px-32">`;
  children($$payload);
  $$payload.out += `<!----></article> <div class="w-full h-10 col-span-2 border-t border-gray-300 pt-4 flex flex-row-reverse gap-4 pr-5"><a href="https://github.com/liamg2810" target="__away" class="flex h-full items-center gap-2 text-lg hover:text-blue-300"><img src="/github-mark-white.svg" alt="Github Logo" class="aspect-square h-full"/>Github</a> <a href="mailto:liam@zelv.co.uk" target="__away" class="flex h-full items-center gap-2 text-lg hover:text-blue-300"><img src="/email.svg" alt="Email Logo" class="aspect-square h-full"/>Contact Me</a> <a href="/" class="flex-1 pl-3 hover:text-blue-300">Back To Terminal</a></div></div>`;
  pop();
}
export {
  _layout as default
};
