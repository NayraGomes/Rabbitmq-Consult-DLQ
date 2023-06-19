#!/usr/bin/env node
var amqp = require('amqplib/callback_api');
var readlineSync = require('readline-sync');
var fs = require("fs");
 

var jsonData = JSON.parse(fs.readFileSync("./info.json", "utf8")); //Pega informações de fila e exchanges no arquivo info.json
//Declaração das variaveis de fila
var queue = jsonData.queue;
var exchange = jsonData.exchange;
var exchange_retry = jsonData.exchange_retry;


function main (){

    amqp.connect('<SERVER-ADDRESS>)', function(error0, connection) { //abrindo conexão
        if (error0) {
            throw error0;
        }

        function actions(){ //função actions para Exclusão e Reenvio de mensagens

            var answer = readlineSync.question("Pressione (1) para Excluir, (2) para Reprocessar, CRTL + C para sair. ");

            if(answer==1){ //Processo para Excluir uma mensagem da fila morta 'queue'
                console.log("Excluindo mensagem...");
                connection.createChannel(function(error1, channel) { //criação do canal
                    if (error1) {throw error1;}
                    channel.assertExchange(exchange, "fanout", {durable: true})
                    channel.assertExchange(exchange_retry, "fanout", {durable: true})
                    channel.assertQueue(queue, {durable: true, deadLetterExchange: exchange_retry,})
                    channel.bindQueue(queue, exchange, 'chave-aleatoria');
                    channel.get(queue, {noAck: false}, function(err, msgOrFalse) {
                        channel.ack(msgOrFalse) //Ack na mensagem para excluir a mesma da fila
                        console.log("Mensagem excluída!")
                        console.log(" ")
                        console.log(" ")
                        console.log("Próxima mensagem...")
                        setTimeout(function(){
                            exibirMensagens(); //chama a função exibirMensagens para exibir a proxima mensagem
                        },2000); 
                            });
                        });
                }
                else if(answer==2){ //Processo para reenviar a mensagem da fila morta 'queue' para a fila principal
                    console.log("Reenviando mensagem");
                    connection.createChannel(function(error1, channel) { //criação do canal
                        if (error1) {throw error1;}
                        channel.assertExchange(exchange, "fanout", {durable: true,})
                        channel.assertExchange(exchange_retry, "fanout", {durable: true})
                        channel.assertQueue(queue, {durable: true, deadLetterExchange: exchange_retry,})
                        channel.bindQueue(queue, exchange, 'chave-aleatoria');
                        channel.get(queue, {noAck: false}, function(err, msgOrFalse) {
                            channel.reject(msgOrFalse, false) //Reject com requeue 'false' na mensagem para excluir a mesma da fila
                            console.log("Mensagem reenviada!")
                            console.log(" ")
                            console.log(" ")
                            console.log("Próxima mensagem...")
                            setTimeout(function(){
                                exibirMensagens(); //chama a função exibirMensagens para exibir a proxima mensagem
                            },2000);
                        });
                    });                                
                }
                else{ //Processo caso o usuário não digite nem (1) nem (2)
                    console.log("Inválido")
                    setTimeout(function(){
                        exibirMensagens(); //chama a função exibirMensagens para exibir a mensagem atual novamente
                    },2500)           
                }
        } //fim da função actions()

        function exibirMensagens(){ //função para exibir mensagens da fila uma a uma
            connection.createChannel(async function(error1, channel) { //criação do canal
                if (error1) {throw error1;}
                channel.assertExchange(exchange, "fanout", {durable: true})
                channel.assertExchange(exchange_retry, "fanout", {durable: true})
                channel.assertQueue(queue, {durable: true, deadLetterExchange: exchange_retry})
                channel.bindQueue(queue, exchange, 'chave-aleatoria');
                channel.checkQueue(queue, async function(err, ok){

                    if(ok.messageCount==0){ //Verifica se a fila está vazia
                        console.log("Fila está vazia.")
                        console.log("Pressione CRTL+C para sair")
                    }
                    else{  //caso a fila não esteja vazia, o script pegará as mensagens para exibir (uma por vez)
                        channel.get(queue, {noAck: false}, function(err, msgOrFalse) {
                            var nro_mensagem=ok.messageCount-msgOrFalse.fields.messageCount;
                            console.log("");
                            console.log("Message: %d", nro_mensagem);
                            console.log("O servidor reportou %d mensagens restantes.", msgOrFalse.fields.messageCount);
                            console.log(" ");
                            console.log(" ##########     Informações gerais ################");
                            console.log(msgOrFalse.fields);
                            console.log(" ##########         Headers        ################");
                            console.log(msgOrFalse.properties.headers);
                            console.log(" ##########         Payload        ################");
                            console.log(msgOrFalse.content.toString());
                            console.log(" ");
                            console.log(" ");
                            console.log("Ações ");
                            actions(); //chama a função actions() para exibir o menu de exclusão e reenvio. 
                            channel.nackAll(msgOrFalse, false) //Nack com requeue 'false' na mensagem para apenas exibir a mesma sem altera-la
                        }
                        );  
                    }
                })
            });
        }//fim da função exibirMensagens()

        function iniciar(){  //função para exibir as informaçõe iniciais da fila como nome da fila, qtdd de consumidores e qtt d emensagens
            connection.createChannel(async function(error1, channel) { //criação do canal
                if (error1) {throw error1;}
                channel.assertExchange(exchange, "fanout", {durable: true})
                channel.assertExchange(exchange_retry, "fanout", {durable: true})
                channel.assertQueue(queue, {durable: true, deadLetterExchange: exchange_retry})
                channel.bindQueue(queue, exchange, 'chave-aleatoria');  
                channel.checkQueue(queue, async function(err, ok){ //checkQueue é responsavel por pegar as informações da fila. Devolve um array com 3 informações
                    console.log("Inicializando..."); 
                    setTimeout(function(){
                        console.log("...");
                    },1000);  
                    setTimeout(function(){
                        console.log("...");
                    },2000);
                    setTimeout(function(){
                        console.log("...");
                    },3000);
                    setTimeout(function(){
                        console.log(" ");
                        console.log(" ");
                        console.log("Informações da fila ");
                        console.log(" ");
                        console.log("Nome da Fila: ", ok.queue); //printa o nome da fila
                        console.log("Quantidade de Consumidores: ", ok.consumerCount); //printa a quantidade de consumidores da fila
                        console.log("Quantidade de Mensagens: ", ok.messageCount); //printa a quantidade de mensagens da fila
                        console.log(" ");
                        console.log(" ");
                    },5000);
                    setTimeout(function(){
                        if(ok.messageCount==0){ //caso a fila esteja vazia
                            console.log("A Fila está vazia.")
                            console.log("Pressione CRTL+C para sair")
                        }
                        else{ 
                            exibirMensagens(); //caso a fila tenha mensagens, exibirMensagens será chamado
                        }
                    },6000);
                });
            });           
        } //fim da função iniciar()

        iniciar(); //chama a função iniciar para começar o fluxo do script

    })//fechamento da conexão amqp com o servidor

}//fim da função main

main();//chamando a função principal main()