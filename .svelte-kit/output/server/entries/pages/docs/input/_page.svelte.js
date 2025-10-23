import "clsx";
function _page($$payload) {
  $$payload.out += `<h1 class="text-5xl font-bold pt-3">Input / Ouput</h1> <h2 class="text-3xl font-bold mt-6 mb-3">Output</h2> <p class="text-lg">To output text to the terminal, you can use the <code>print</code> command.
	This will output the text to the terminal. For example, to output "Hello,
	World!", you would write: <br/> <code>print "Hello, World!"</code> <br/> This will output "Hello, World!" to the terminal. <br/> You can also use variables in the <code>print</code> command. For example,
	if you have a variable called <code>myVar</code> with the value of <code>10</code>, you can write: <br/> <code>print "My variable is: " + myVar</code> <br/> This will output "My variable is: 10" to the terminal. <br/></p> <h2 class="text-3xl font-bold py-3">Input</h2> <p>To input text from the user, you can use the <code>input</code> command,
	followed by the name of the variable you wish to save the input to. For
	example, to input text and save it to a variable called <code>myInput</code>, you would write: <br/> <code>input myInput</code> <br/> This will prompt the user for input, and save the input to the variable <code>myInput</code>. You can then use this variable in your code, just like
	any other variable. <br/></p> <h3 class="text-xl w-full font-bold my-5">Gotcha</h3> <p class="text-lg w-full">Input types are inferred, so if you input a number, it will be interpreted
	as a number, and if you input a string, it will be interpreted as a string. <br/> To check the type of a variable, you can use <code>typeof(myVar)</code> which will return the type of the variable as a string. <br/> For example, if you input a number, and then check the type of the variable,
	it will return <code>"number"</code>. If you input a string, it will return <code>"string"</code>.</p>`;
}
export {
  _page as default
};
