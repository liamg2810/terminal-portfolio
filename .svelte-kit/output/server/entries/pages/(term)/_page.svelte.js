import { x as ensure_array_like, y as attr_class, z as escape_html, A as attr, v as pop, t as push } from "../../../chunks/index.js";
import "clsx";
let terminalState = {
  text: "",
  lines: [],
  color: "neutral-100"
};
function _page($$payload, $$props) {
  push();
  let blockInput = true;
  const each_array = ensure_array_like(
    // Focus the textarea when the terminal is clicked
    terminalState.lines
  );
  $$payload.out += `<button${attr_class(`w-full h-full flex flex-col text-${terminalState.color} px-3 focus:outline-none`)} tabindex="0" aria-label="Terminal input"><!--[-->`;
  for (let $$index_1 = 0, $$length = each_array.length; $$index_1 < $$length; $$index_1++) {
    let line = each_array[$$index_1];
    const each_array_1 = ensure_array_like(line.value.split("\n"));
    $$payload.out += `<div class="flex w-full">`;
    if (line.type === "input") {
      $$payload.out += "<!--[-->";
      $$payload.out += `<span class="pt-2">>>></span>`;
    } else if (line.type === "scriptin") {
      $$payload.out += "<!--[1-->";
      $$payload.out += `<span class="pt-2">?</span>`;
    } else {
      $$payload.out += "<!--[!-->";
    }
    $$payload.out += `<!--]--> <div${attr_class(`${line.type !== "response" ? "pt-2 pl-3" : ""}`)}><!--[-->`;
    for (let i = 0, $$length2 = each_array_1.length; i < $$length2; i++) {
      let part = each_array_1[i];
      $$payload.out += `<span class="flex text-left text-base"><pre>${escape_html(part.split(":link:")[0])}</pre> `;
      if (part.split(":link:")[1]) {
        $$payload.out += "<!--[-->";
        $$payload.out += `<span> - </span> <a${attr("href", part.split(":link:")[1])} class="text-blue-500 hover:underline" target="_blank" rel="noopener noreferrer">${escape_html(part.split(":link:")[1].replaceAll("mailto:", "").replaceAll("https://", "").replaceAll("http://", ""))}</a>`;
      } else {
        $$payload.out += "<!--[!-->";
      }
      $$payload.out += `<!--]--></span>`;
    }
    $$payload.out += `<!--]--></div></div>`;
  }
  $$payload.out += `<!--]--> <div class="flex flex-1 w-full">`;
  {
    $$payload.out += "<!--[-->";
    $$payload.out += `<span class="pt-2">>>></span>`;
  }
  $$payload.out += `<!--]--> `;
  {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--> <textarea class="resize-none bg-transparent border-none outline-none focus:ring-0 hover:cursor-default w-full"${attr("disabled", blockInput, true)}>`;
  const $$body = escape_html(terminalState.text);
  if ($$body) {
    $$payload.out += `${$$body}`;
  }
  $$payload.out += `</textarea></div></button>`;
  pop();
}
export {
  _page as default
};
