<!-- SYNTAX: for i = 0 to 10 step 2 -->
<!-- there are no while loops -->

<h1 class="text-5xl pt-3 font-bold">Loops</h1>

<p class="text-lg w-full my-6">
	Currently, Zelv lang only supports <code>for</code> loops, which are used to
	iterate over a range of numbers.
</p>

<h2 class="text-3xl font-bold py-3">For Loops</h2>

<p class="text-lg w-full">
	To create a for loop, you use the <code>for</code> keyword, followed by the
	variable name, the <code>in</code> keyword, and then the range of numbers
	you want to iterate over. Excluding the final number. For example, to
	iterate from 0 to 10, you would write:
	<br />
	<code>for i = 0 to 10</code>
	<br />
	This will create a loop that iterates from 0 to 10, with the variable
	<code>i</code>
	taking on each value in the range.
	<br />
	You can also specify a step value, which is the amount by which the variable
	will increment each time the loop runs. For example, to iterate from 0 to 10
	with a step value of 2, you would write:
	<br />
	<code>for i = 0 to 10 step 2</code>
	<br />
	This will create a loop that iterates from 0 to 10, with the variable
	<code>i</code>
	taking on the values 0, 2, 4, 6, and 8.
	<br />
	At the end of the loop block, you must write the <code>next</code> keyword.
	<br />
	The variable used in the loop will be discarded after the loop ends.
	<br />
	You can use variables when defining the loop, such as:
	<br />
	<code>10 let start = 0</code>
	<br />
	<code>20 let end = 10</code>
	<br />
	<code>30 for i = start to end</code>
	<br />
</p>
