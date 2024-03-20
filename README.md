Projeto referente à disciplina de programação funcional, do curso de ADS da Unifor.

O projeto é um "transpilador" da linguagem JavaScript para Python.

O projeto está concentrado nos requisitos propostos pelo documento disponibilizado pela displina e se propõe a 
"transpilar" um subconjunto da linguagem JavaScript.

É necessário o NodeJS instalado

Para executar o projeto siga os passos abaixo:

1) crie uma pasta para salvar o projeto
2) dentro da pasta digite git clone https://github.com/adbertomelo/unifor_programacao_funcional.git
3) digite cd unifor_programacao_funcional
4) digite npm install
5) digite node transpiler.js

Os passos acima ira converter o código abaixo para Python.

"function printValues(value)
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
      
   printValues(value); "   
   
