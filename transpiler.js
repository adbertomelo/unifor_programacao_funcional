const acorn = require("acorn")
const walk = require("acorn-walk")

const TAB = "\t";
const ESPACO = " ";
const UNDERLINE = "_";

let codigoJS = `
   function printValues(value)
   {
      if (value <= 0)
      {
        console.log('Digite um valor maior que zero');
        return;
      }
      
      while(value > 0)
      {
        console.log(value);
        value = value - 1;    
      }      
   }  

   var value = Number(prompt('Digite um valor'));
      
   printValues(value);      

`;

/* Aqui está sendo utilizada uma expressão lambda e closure*/
const identacao = (c) => {
    
    function apply(num) {
        return c.repeat(num);
    }
        
    return apply;
}

const hashTableFn = {"console": "print", "prompt": "input", "number": "(int)"}

function getCalleeName(objectName)
{

    let fn;
    
    objName = objectName.toLowerCase();

    let res = hashTableFn[objName];

    if (res == undefined)
        res = objectName;

    return res;

}

/* 
    aqui foi criada essa closure para a lógica de criação dos parametros da função
*/
function getArguments(arguments1)
{

    const buildArgument = (argument) => {
        
        let arg = "";

        if (argument.type == "Literal") 
        {
            let valor = argument.value;
            let argType = !isNaN(valor)?valor:`'${valor}'`;

            arg = arg == "" ? `${argType}` : `${arg}, ${argType}`;
        } 
        else if (argument.type == "Identifier") 
        {
            arg = argument.name;
        } 
        else if (argument.type == "CallExpression") {
            arg = callExpressionArg(argument);
        }

        return arg;
    };


    let arg = "";
    for (let i = 0; i < arguments1.length; i++) {
        arg += buildArgument(arguments1[i]);
    }

    return arg;

}


function callExpressionArg(callExpr)
{
    return  callExpression(callExpr);
}

function callExpressionFn(callExpr)
{
    return  `${callExpression(callExpr)}\n`;
}

function callExpression(callExpr)
{
    
    var callee = callExpr.callee;

    var fn = "";

    if (callee.type=="MemberExpression")
    {

        fn = `${getCalleeName(callee.object.name)}\(`;
    }

    if (callee.type=="Identifier")
    {
        fn = `${getCalleeName(callee.name)}(`;
    }

    var arg = getArguments(callExpr.arguments);

    return  `${fn}${arg}\)`;
}


function returnStatement(ret)
{
    if (ret.argument == null)
        return `return\n`;
    else if (ret.argument.type == "Identifier")
        return `return ${ret.argument.name}\n`;
    else if (ret.argument.type == "Literal")
        return `return ${ret.argument.value}\n`;
}

function variableDeclaration(p)
{
    
    for(let idx = 0; idx < p.declarations.length; idx++)
    {
        let name = p.declarations[idx].id.name;
        let init = p.declarations[idx].init;
        if (init != null)    
        {
            //let part = name + "=";

            if (init.type == "CallExpression")    
            {
                return `${name}=${callExpressionFn(init)}`;
            }else if(init.type == "Literal"){
                return `${name}=${init.value}`;
            }
        }
    }

}

function elseStatement(p)
{
    
    return `else:\n`;

}

function ifStatement(p)
{
    
    var operator = p.test.operator;
    var left;
    var right;

    if (p.test.left.type == "Identifier")
        left = p.test.left.name;
    else    
        left = p.test.left.value;

    if (p.test.right.type == "Identifier")
        right = p.test.right.name;
    else    
        right = p.test.right.value;

        
    return `if ${left} ${operator} ${right}:\n`;

}

function whileStatement(p)
{

    var operator = p.test.operator;
    var left;
    var right;

    if (p.test.left.type == "Identifier")
        left = p.test.left.name;
    else    
        left = p.test.left.value;

    if (p.test.right.type == "Identifier")
        right = p.test.right.name;
    else    
        right = p.test.right.value;

        
    return `while ${left} ${operator} ${right}:\n`;

}

function getBinaryExpression(expr)
{
    let left = "";
    let right = "";
    let op = expr.operator;

    if (expr.left.type == "Identifier")
        left = expr.left.name;
    else    
        left = expr.left.value;

    if (expr.right.type == "Identifier")
        right = expr.right.name;
    else    
        right = expr.right.value;

    return left + op + right;

}


function assignmentExpression(expr)
{

    let left = expr.left;
    let right = expr.right;
    let expr1;
    let expr2;

    if (left.type == "Identifier")
        expr1 = left.name;

    if (left.type == "BinaryExpression")
        expr1 = getBinaryExpression(left);


    if (right.type == "Identifier")
        expr2 = right.name;

    if (right.type == "BinaryExpression")
        expr2 = getBinaryExpression(right);
        
    return expr1 + expr.operator + expr2 + "\n";

}

function expressionStatement(expr,)
{

    if (expr.expression.type=="CallExpression")
    {
        return callExpressionFn(expr.expression);
    }

    if (expr.expression.type=="AssignmentExpression")
    {
        return assignmentExpression(expr.expression);
    }
    
}


function functionDeclaration(p)
{

    var params1="";

    if (p.params.length > 0)
    {
        
        for(var i =0; i < p.params.length; i++)
        {
            if (params1 == "")
            {
                params1 = p.params[i].name
            }else{
                params1 += "," + p.params[i].name
            }
        }
    }

    return `def ${p.id.name}(${params1}): \n`;


}

/* aqui está sendo utilizada uma função recursiva de alta ordem*/
function transpilerTree(p, n, fnIdent)
{

    if (p.type == "Program")
    {
        let res = "";

        for(i = 0; i < p.body.length; i++)
        {
            res = res +  transpilerTree(p.body[i], n, fnIdent);
        }

        return res;
    }

    if (p.type == "FunctionDeclaration")
    {
        return fnIdent(n) + functionDeclaration(p) + transpilerTree(p.body, n + 1, fnIdent);
    }

    if (p.type == "BlockStatement")
    {
        let t = n + 1;
        let res = "";
        for(let x = 0; x < p.body.length; x++)
        {
            res = res + transpilerTree(p.body[x], t, fnIdent);
        }        
        return res;
    } 

    if (p.type == "IfStatement")
    {
        return fnIdent(n) + ifStatement(p) + transpilerTree(p.consequent, n + 1, fnIdent) + (
            p.alternate == null ? "" : fnIdent(n) + elseStatement(p.alternate) + transpilerTree(p.alternate, n + 1, fnIdent));
    }  

    if (p.type == "ExpressionStatement")
    {
        return fnIdent(n) + expressionStatement(p);
    }  

    if (p.type == "ReturnStatement")
    {
        return fnIdent(n) + returnStatement(p);
    }       

    if (p.type == "WhileStatement")
    {
        return fnIdent(n) + whileStatement(p) + transpilerTree(p.body, n + 1, fnIdent);
    }

    if (p.type == "VariableDeclaration")
    {
        return fnIdent(n) + variableDeclaration(p);
    }

}

/*o mais próximo de MONAD é uma instrução try-catch*/
function getTree(codigoJS)
{
    try{
        return acorn.parse(codigoJS,{ecmaVersion: 2020})
    }catch
    {
        console.log("Erro ao fazer o parse do javascript");
    }
    
}


function transpiler(codJS)
{
    let tree = getTree(codJS);

    /*
        a função identação usa CLOSURE para que seja possível definir o tipo de indentação,
        por exemplo: caso queira indentar o código com tab, basta alterar para
        indentacao(TAB)
    */
    let ident = identacao(ESPACO);

    return transpilerTree(tree, 0, ident);

}

console.log(transpiler(codigoJS));

module.exports = {transpiler, getCalleeName, hashTableFn};