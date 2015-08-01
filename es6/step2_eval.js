import { readline } from './node_readline';
import { Sym, _list_Q } from './types';
import { BlankException, read_str } from './reader';
import { pr_str } from './printer';

// read
const READ = (str) => read_str(str);

// eval
const eval_ast = (ast, env) => {
    if (ast instanceof Sym) {
        if (ast.name in env) {
            return env[ast]
        } else {
            throw Error("'" + ast + "' not found")
        }
    } else if (_list_Q(ast)) {
        return ast.map((x) => EVAL(x, env));
    } else {
        return ast;
    }
}

const EVAL = (ast, env) => {
    if (!_list_Q(ast)) { return eval_ast(ast, env) }

    var [f, ...args] = eval_ast(ast, env);
    return f(...args);
}

// print
const PRINT = (exp) => pr_str(exp, true);

// repl
var repl_env = {'+': (a,b) => a+b,
                '-': (a,b) => a-b,
                '*': (a,b) => a*b,
                '/': (a,b) => a/b};
const REP = (str) => PRINT(EVAL(READ(str), repl_env));

while (true) {
    let line = readline("user> ");
    if (line == null) break;
    try {
        if (line) { console.log(REP(line)); }
    } catch (exc) {
        if (exc instanceof BlankException) { continue; }
        if (exc.stack) { console.log(exc.stack); }
        else           { console.log("Error: " + exc); }
    }
}