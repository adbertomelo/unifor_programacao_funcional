
const {getCalleeName,hashTableFn, transpiler} = require('./transpiler');


describe('getCalleeName', () => {
    it('deve retornar "print" quando função for "console"', () => {
        expect(getCalleeName("console")).toBe("print");
    });

    it('deve retornar "input" quando função for "prompt"', () => {
        expect(getCalleeName("prompt")).toBe("input");
    })});


/*
declaração de função
*/

const fnJS1 = "function x(){}";
const fnPyhon1 = "def x(): \n";

describe('transpiler', () => {
    it('declaracao de função', () => {
        expect(transpiler(fnJS1)).toBe(fnPyhon1);
    });


});

/*
implementação de função
*/
const fnJS2 = "function x(a){return a}";
const fnPyhon2 = "def x(a): \n  return a\n";

describe('transpiler', () => {
    it('declaracao de função', () => {
        expect(transpiler(fnJS2)).toBe(fnPyhon2);
    });


});


/*
chamada de função
*/
const fnJS3 = "function x(a){return a} x(1)";
const fnPyhon3 = "def x(a): \n  return a\nx(1)\n";

describe('transpiler', () => {
    it('chamada de função', () => {
        expect(transpiler(fnJS3)).toBe(fnPyhon3);
    });


});

/*
if-else
expressão booleana
expressão numérica
*/
const fnJS4 = "function x(a){if(a>0){return a}else{return 0}}";
const fnPyhon4 = "def x(a): \n  if a > 0:\n    return a\n  else:\n    return 0\n";

describe('transpiler', () => {
    it('if-else', () => {
        expect(transpiler(fnJS4)).toBe(fnPyhon4);
    });


});

/*
while
*/
const fnJS5 = "function x(a){while(a>0){return a}}";
const fnPyhon5 = "def x(a): \n  while a > 0:\n    return a\n";

describe('transpiler', () => {
    it('while', () => {
        expect(transpiler(fnJS5)).toBe(fnPyhon5);
    });


});

/*
entrada de terminal
*/
const fnJS6 = "function x(){var x = prompt(\'digite\')}";
const fnPyhon6 = "def x(): \n  x=input(\'digite\')\n";

describe('transpile', () => {
    it('entrada no terminal', () => {
        expect(transpiler(fnJS6)).toBe(fnPyhon6);
    });


});

/*
instrução de atribuição
*/
const fnJS7 = "function x(){var y = 0}";
const fnPyhon7 = "def x(): \n  y=0";

describe('transpile', () => {
    it('atribuição de variável', () => {
        expect(transpiler(fnJS7)).toBe(fnPyhon7);
    });


});