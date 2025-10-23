-   [] Build out variables in the tree
-   [] Print command
-   [] If statements
-   [] For loops
-   [] Builtin functions (len)
-   [] Extras

### Vars

Currently there are only strings or numbers but i would like to add bools to that list. Defined and only defined with let. Reassigned and only reassigned with the variable name with no command

#### Operators:

\+ - \* / % // \*\*

### print

Print command is simple it just takes the strings and variables and combines them - move to print(...args) and i will be able to easily parse stuff like typeof in print

### if statements

Very simple concept

if x < 10

\# do stuff

endif

Parsing equations in if statments is essential

### for loops

Again simple

for i = 0 to 10 step 2

\# do stuff

next

and again parsing stuff in this except for the variable assignement is good to do. Don't forget to make sure the "i" variable is locked and cant be rewrote. make sure this is bulletproof when generating the AST

### Builtins

-   typeof - string | number | bool
-   round - number
-   floor - number
-   ceil - number
-   exists - bool
-   len - number
-   keydown - bool

Need to be able to parse stuff in these aswel

add more

-   string
-   number
-   bool

simple ways to coerce types

cant turn string to number

### extras

input x

this will take an input and assign it to the variable x
