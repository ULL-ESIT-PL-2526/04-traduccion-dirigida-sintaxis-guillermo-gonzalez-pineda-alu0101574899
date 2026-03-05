/* Lexer */
%lex
%%

\s+                   /* omitir espacios en blanco */
\/\/[^\n]*\n?         /* omitir comentarios de una línea */
[0-9]+(\.[0-9]+)?([eE][-+]?[0-9]+)?   { return 'NUMBER'; }
"**"                                  { return 'OPOW'; }
"*"                                   { return 'OPMU'; }
"/"                                   { return 'OPMU'; }
"+"                                   { return 'OPAD'; }
"-"                                   { return 'OPAD'; }
<<EOF>>                               { return 'EOF'; }
.                                     { return 'INVALID'; }

/lex

/* Parser */
%start L

%%

L
    : E EOF
        { return $1; } 
    ;

E
    : E OPAD T
        { $$ = operate($2, $1, $3); }
    | T
        { $$ = $1; }
    ;

T
    : T OPMU R
        { $$ = operate($2, $1, $3); }
    | R
        { $$ = $1; }
    ;

R
    : F OPOW R
        { $$ = operate($2, $1, $3); }
    | F
        { $$ = $1; }
    ;

F
    : NUMBER
        { $$ = Number(yytext); }
    ;

%%

function operate(op, left, right) {
    switch (op) {
        case '+': return left + right;
        case '-': return left - right;
        case '*': return left * right;
        case '/': return left / right;
        case '**': return Math.pow(left, right);
        default: throw new Error("Operador desconocido: " + op);
    }
}


