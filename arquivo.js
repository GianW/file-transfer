const fs   = require('fs');
const exec = require('child_process').exec;

/*Carrega nome do arquivo informado na execução*/
var arguments = process.argv.splice(2, process.argv.length -1).join(' ');
var nomeArquivo = arguments;

/*carrega informações de configuração*/
/*{'desenv':'', 'prod':'', 'local':'', 'bkp': ''}*/
var data = JSON.parse(fs.readFileSync('config.json'));

//Move dev
try{
  var arqDev = fs.statSync((data.desenv + "/" + nomeArquivo));
  salvaBkp((data.desenv + "/" + nomeArquivo), 'dev');
}catch(err){
  console.log("Arquivo (" + nomeArquivo + "), não existe no diretório, ou não foi possível acessar a pasta.(DESENV)");
}

//Move prod
try{
  var arqProd = fs.statSync((data.prod + "/" + nomeArquivo));
  salvaBkp((data.prod + "/" + nomeArquivo), 'prod');
}catch(err){
  console.log("Arquivo (" + nomeArquivo + "), não existe no diretório, ou não foi possível acessar a pasta.(Produção)");
}

//Verifica versão mais atual e salva na pasta de modificações
if (arqProd !== undefined && arqDev !== undefined){
  if (arqProd.mtime == arqDev.mtime){
    copiaArquivo((data.prod + "/" + nomeArquivo), (data.local + "/" + nomeArquivo));
    console.log("Ambiente de desenvolvimento e de produção possuem o mesmo arquivo.");
  }
  else if(arqProd.mtime > arqDev.mtime){
    copiaArquivo((data.prod + "/" + nomeArquivo), (data.local + "/" + nomeArquivo));
    console.log("Arquivo de produção possui data mais atual, copiado para " + data.local);
  }
  else if(arqProd.mtime < arqDev.mtime){
    copiaArquivo((data.desenv + "/" + nomeArquivo), (data.local + "/" + nomeArquivo));
    console.log("Arquivo de desenvolvimento possui data mais atual, copiado para " + data.local);
  }
}else if(arqProd !== undefined){
  copiaArquivo((data.prod + "/" + nomeArquivo), (data.local + "/" + nomeArquivo));
  console.log("Arquivo localizado apenas em produção, copiado para " + data.local);
}else if (arqDev !== undefined) {
  copiaArquivo((data.desenv + "/" + nomeArquivo), (data.local + "/" + nomeArquivo));
  console.log("Arquivo localizado apenas em desenvolvimento, copiado para " + data.local);
};



function copiaArquivo(origem, destino){
  exec("cp -p " + origem + " " + destino );
}


function salvaBkp(original, ambiente){

    var nomeSemExtensao = nomeArquivo.split('.')[0];
    var dia  = new Date();
    var pastaBackup = nomeSemExtensao + "_" + dia.getDate() + "_" + (dia.getMonth() + 1) + "_" + dia.getFullYear();
    var path = (data.bkp + "/" + pastaBackup);


    if (fs.existsSync(path)){  //Verifica pasta de backup do programa
      fs.exists((path + "/" + ambiente) ,function(exists){  // verifica pasta de bkp para ambiente
        if (exists){
          copiaArquivo(original, (path + "/" + ambiente + "/" + nomeArquivo));
        }
        else{
          fs.mkdir((path + "/" + ambiente),function(err){
            if (err) {
             console.log("Não foi possivel criar a pasta de backup" + ambiente);
            }
            else{
             copiaArquivo(original, (path + "/" + ambiente + "/" + nomeArquivo));
            }
          });
        }
      });
    } else{ //Se não existe pasta de backup para o programa
      fs.mkdir(path ,function(err){
        if (err) {
          console.log("Não foi possivel criar a pasta de backup do programa " + ambiente);
         }
         else{
          salvaBkp(original, ambiente);
         }
      });
    }

};

