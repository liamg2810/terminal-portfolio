const TokenType = {
	// Single-character tokens
	LEFT_PAREN: "LEFT_PAREN", // (
	RIGHT_PAREN: "RIGHT_PAREN", // )
	LEFT_BRACE: "LEFT_BRACE", // {
	RIGHT_BRACE: "RIGHT_BRACE", // }
	COMMA: "COMMA", // ,
	DOT: "DOT", // .
	SEMICOLON: "SEMICOLON", // ;
	PLUS: "PLUS", // +
	MINUS: "MINUS", // -
	STAR: "STAR", // *
	SLASH: "SLASH", // /

	// One or two character tokens
	EQUAL: "EQUAL", // =
	EQUAL_EQUAL: "EQUAL_EQUAL", // ==
	BANG: "BANG", // !
	BANG_EQUAL: "BANG_EQUAL", // !=
	GREATER: "GREATER", // >
	GREATER_EQUAL: "GREATER_EQUAL", // >=
	LESS: "LESS", // <
	LESS_EQUAL: "LESS_EQUAL", // <=

	// Literals
	IDENTIFIER: "IDENTIFIER", // variable names
	NUMBER: "NUMBER", // 123, 3.14
	STRING: "STRING", // "hello"

	// Keywords
	LET: "LET",
	IF: "IF",
	ELSE: "ELSE",
	ENDIF: "ENDIF",
	FOR: "FOR",
	NEXT: "NEXT",
	WHILE: "WHILE",
	ENDWHILE: "ENDWHILE",
	BREAK: "BREAK",
	CONTINUE: "CONTINUE",
	FUNCTION: "FUNCTION",
	RETURN: "RETURN",
	TRUE: "TRUE",
	FALSE: "FALSE",
	NULL: "NULL",
};
