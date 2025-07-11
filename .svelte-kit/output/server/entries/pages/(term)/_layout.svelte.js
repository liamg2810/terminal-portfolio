import "clsx";
function _layout($$payload, $$props) {
  let { children } = $$props;
  $$payload.out += `<div class="h-screen pb-10">`;
  children($$payload);
  $$payload.out += `<!----></div>`;
}
export {
  _layout as default
};
