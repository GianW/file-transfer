# File-transfer

### Objetivo
Para transferir arquivos de diretórios remotos (Dev e Produção), salvando uma versão de cada um e criando uma cópia do mais atual na pasta de desenvolvimento.

### Config.json
Informar os diretórios de desenvolvimento, produção, backup e local para edição no arquivo `config.json` com o seguinte formato:

```json
{
  "desenv" : "//99.999.9.999/sistema/desenv",
  "prod" : "//99.999.9.999/sistema/prod",
  "local" : "C:/Users/Gian/Documents/Fator7",
  "bkp" : "C:/Users/Gian/Documents/Fator7/backup"
}

```

### Executar

No console execute `node arquivo nome_arquivo_com_extensao.html` obs. Informe a extensão do arquivo.

