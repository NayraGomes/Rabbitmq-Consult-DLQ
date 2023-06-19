
# RabbitMQ DLQs

Script para manuseio das filas de mensagens mortas (DLQ) via CLI, onde outras filas (filas de origem) usam como destinos para mensagens que não podem ser processadas (consumidas) com êxito.

## 🚀 Começando

Essas instruções permitirão que você obtenha uma cópia do projeto em operação na sua máquina local para fins de desenvolvimento e teste.

Consulte **Implantação** para saber como implantar o projeto.

### 📋 Pré-requisitos

- Node.js (v16.16.0 ou superior)
- Npm (v8.11.0 ou superior)
- Bibliotecas do Node.js: amqplib e readline-sync.


### 🔧 Instalação

1. Instale o Node.js na sua máquina através de <https://nodejs.org/en/download/>
2. As ultimas versões ja inlcuem o gerenciador de pacotes npm para o Node.JS certifique-se de consultar a versão de ambos.
3. Instale as bibliotecas amqplib e readline-sync via linha de comando atras de um CLI da sua preferencia;

```
npm install amqplib
```
E repita para a próxima biblioteca

```
npm install readline-sync
```

## ⚙️ Funcionamento

# Clone esse repositório:
$ git clone <url_do_script_no_github>

# Abra a pasta do projeto e edite o arquivo info.json
Use o editor de txt da sua preferência e altere os campos queue, exchange e exchange_retry para as informações da fila de mensagens mortas que deseja consultar.

```
{
	"queue": "<nome_da_fila_morta>",
	"exchange": "<nome_da_exchange_dle>",
	"exchange_retry": "<nome_da_exchange_reply>"
}

```
Salve o arquivo e abra o CLI.

# Navegue para o diretório raiz do projeto
```

$ cd RabbitMQ-consult-DLQ

```
#Execute o script de consult-DLQ

```

$ node consult-DLQ

```

Após esse comando o script será inicializado.


### ⌨️ Como usar

##Informações da fila

Após inicialização, será mostrado as informações gerais da fila com nome, quantidade de consumidores e quantidade de mensagens.
Se o número de mensagens for 0, aperte CTRL + C para sair.

##Mensagens

Se houver mensagens na fila será exibido na interface uma mensagem por vez por no qual você deverá escolher entre excluir a mensagem da fila ou reenvia-la para o fluxo principal.
Após exclusão ou reenviou, se houver uma nova mensagem na fila, está será exibida na tela e o fluxo continuará para as demais.


## 🛠️ Construído com


* [JavaScript] (https://www.javascript.com/) - Linguagem utilizada
* [Node.JS] (https://nodejs.org/en/download/) - Software para execução Javascript
* [Npm] (https://www.npmjs.com/) - Gerenciador de Dependências nodejs
* [amqplib](https://amqp-node.github.io/amqplib/channel_api.html) - Client API do rabbitmq para nodejs


## ✒️ Autores

* **Nayra Gomes Neves** - *Trabalho inicial e desenvolvimento* - [Arquitetura de Soluções]


## 🎁 Expressões de gratidão

* Conte a outras pessoas sobre este projeto 📢
* Obrigado publicamente 🤓.
---

