<h1 class="text-5xl font-bold pt-3">Variables</h1>

<h2 class="text-3xl font-bold py-3">Mutating Variables</h2>

<p class="text-lg w-full">
	To mutate a variable you simply write the variable name, followed by an
	assignement operator.
	<br />
	For example, to change the value of
	<code>myVar</code>, which is currently <code>10</code>, to <code>20</code>,
	you would write:
	<code>myVar = 20</code>
	<br />

	Alternatively, you can write:
	<code>myVar *= 2</code>
</p>

<h2 class="text-3xl font-bold py-3">Mutating types</h2>

<p class="text-lg w-full">
	There are many different ways to mutate a variable, and the interpreter will
	do its best to mutate variables the way you want it to.
</p>

<h3 class="text-xl w-full font-bold my-2">Number and Number</h3>

<p class="text-lg w-full">
	When mutating a number with another number, the interpreter will simply add,
	subtract, multiply, or divide the two numbers. For example:
	<br />
	<code>myVar = 10 + 5</code>
	<br />
	This will result in <code>myVar</code> being <code>15</code>. Available
	operators are:
	<code>+</code>
	<code>-</code>
	<code>*</code>
	<code>/</code>
	<code>%</code>
</p>

<h3 class="text-xl w-full font-bold my-2">String and String</h3>

<p class="text-lg w-full">
	When mutating a string with another string, the interpreter will simply
	concatenate the two strings together with a space. For example:
	<br />
	<code>myString = "Hello," + "World!"</code>
	<br />
	This will result in <code>myString</code> being
	<code>"Hello, World!"</code>.
	<br />
	The available operators are: <code>+</code>
</p>

<h3 class="text-xl w-full font-bold my-2">String and Number</h3>

<p class="text-lg w-full">
	When mutating a string with a number, you can either add or multiply the
	number and string, and the result will be a string. For example:
	<br />
	<code>myString = "Hello, " + 5</code>
	<br />
	This will result in <code>myString</code> being <code>"Hello, 5"</code>.
	<br />
	You can also multiply a string by a number, which will result in the string repeating
	that many times. For example:
	<br />
	<code>myString = "Hello, " * 3</code>
	<br />
	This will result in <code>myString</code> being
	<code>"Hello, Hello, Hello, "</code>.
	<br />
	The Available operators are: <code>+</code> and <code>*</code>
</p>
