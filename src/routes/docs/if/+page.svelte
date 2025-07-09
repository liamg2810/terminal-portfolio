<h1 class="text-5xl font-bold mt-3">If Statements</h1>

<!-- if x == "2" -->
<!-- else -->
<!-- endif -->

<p class="text-lg mt-6">
	An <code>if</code> statement is a conditional statement that allows you to
	execute a block of code if a certain condition is met. In Zelv lang, you can
	use the <code>if</code> keyword, followed by the condition you want to
	check, and then the block of code you want to execute if the condition is
	true. If statements must be followed by and endif to allow the program to
	recognise the blocks of code defined in the if.
	<br />
	For example, to check if a variable <code>x</code> is equal to
	<code>2</code>, you would write:
	<br />
	<code>if x == 2</code>
	<br />
	This will check if the variable <code>x</code> is equal to <code>2 </code>,
	and if it is, it will execute the block of code that follows.
	<br />
	You can also use the <code>else</code> keyword to specify a block of code to
	execute if the condition is not met. For example, to check if a variable
	<code>x</code> is equal to <code>2</code>, and if it is not, execute a block
	of code, you would write:
	<br />
	<code>if x == 2</code>
	<br />
	<code>else</code>
	<br />
	<code>print "x is not equal to 2"</code>
	<br />
	This will check if the variable <code>x</code> is equal to <code>2 </code>,
	and if it is not, it will execute the block of code that follows the
	<code>else</code> keyword.
	<br />
	You can also use the <code>endif</code> keyword to end the <code>if</code>
	statement. For example, to check if a variable <code>x</code> is equal to
	<code>2</code>, and then end the <code>if</code> statement, you would write:
	<br />
	<code>if x == 2</code>
	<br />
	<code>endif</code>
	<br />
	This will check if the variable <code>x</code> is equal to <code>2 </code>,
	and if it is, it will execute the block of code that follows, and then end
	the <code>if</code> statement.
	<br />

	Example code:
	<br />
	<code>10 let x = 2</code><br />
	<code>20 if x == 2</code><br />
	<code>30 print "x is equal to 2"</code><br />
	<code>40 else</code><br />
	<code>50 print "x is not equal to 2"</code><br />
	<code>60 endif</code>
	<br />
</p>
