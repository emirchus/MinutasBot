const { Client, MessageEmbed } = require("discord.js");
const fs = require('fs');
const path = require('path')
const { Minuta } = require('./minuta.pdf');

const bot = new Client();

bot.on("ready", () => {
    console.log("Bot conectado.");
});

bot.on("message", (message) => {
    if (message.content.startsWith("!luckyto:")) {
        var messageSplit = message.content.split(":")[1].split("\n");
        switch (messageSplit[0].toLowerCase().trim()) {
            case "minutas":
                if (message.channel.name === "minutas") {
                    //TODO: Envia todas las minutas con un attachment
                    fs.readdir("./minutas", (err, files) => {
                        if (err) {
                            sendErrorMessage({ errorTitle: "¿Error?", channel: message.channel, errorMessage: `Tenemos un problema!\n${err.message}` });
                        }
                        if (files && files.length > 0) {
                            files.map((m, index) => {
                                sendAttachMessage({ channel: message.channel, title: `Minuta nº${index}`, message: "Minuta neonctrada", file: path.join('./minutas', m) })
                            })
                        } else {
                            sendMessage({ title: "¡Sin minutas!", channel: message.channel, message: "No se han encontrado minutas!" })
                        }
                    })
                } else {
                    sendErrorMessage({ errorTitle: "Canal equivocado", channel: message.channel, errorMessage: `Lo sentimos, el canal no es el adecuado!, intenta usandolo en <#${735197623883006042}>` });
                }
                break;
            case "minuta":
                if (message.channel.name === "minutas") {
                    var lines = message.content.split('\n');
                    var ownVar;
                    var participantsVar = [];
                    var writterVar;
                    var duration;
                    var date;
                    var time;
                    var id = 0;
                    for (var i = 1; i < lines.length; i++) {
                        var line = lines[i];
                        if (line.startsWith('own')) {
                            ownVar = line.split(":")[1];
                        } else if (line.startsWith("- ")) {
                            var participantsSplit = line.split("-")[1].split(":");
                            participantsVar.push({ name: participantsSplit[0], task: participantsSplit[1] });
                        } else if (line.startsWith("writter")) {
                            writterVar = line.split(":")[1];
                        } else if (line.startsWith("duration")) {
                            duration = line.split(":")[1];
                            var dateValue = new Date();
                            switch (duration.split(" ")[1].toLowerCase()) {
                                case "horas":
                                    dateValue.setMinutes(dateValue.getMinutes() - duration.split(" ")[0])
                                    break;
                                case "hora":
                                    dateValue.setMinutes(dateValue.getMinutes() - duration.split(" ")[0])
                                    break;
                                case "minutos":
                                    dateValue.setHours(dateValue.getHours() - duration.split(" ")[0])
                                    break;
                                case "minuto":
                                    dateValue.setHours(dateValue.getHours() - duration.split(" ")[0])
                                    break;
                                default:
                                    break;
                            }
                            date = dateValue.toLocaleDateString();
                            time = dateValue.toLocaleTimeString();
                        }
                    }
                    var minuta = new Minuta(ownVar, participantsVar, writterVar, duration, { date, time }, id)
                    minuta.write();
                } else {
                    sendErrorMessage({ errorTitle: "Canal equivocado", channel: message.channel, errorMessage: `Lo sentimos, el canal no es el adecuado!, intenta usandolo en <#${735197623883006042}>` });
                }
                break;
            default:
                console.log("Qué hago acá");
                break;
        }
    }

});

function sendErrorMessage({ errorTitle: errorTitle, channel: channel, errorMessage: errorMessage }) {
    const embed = new MessageEmbed().setTitle(errorTitle).setColor(0xFF1744).setDescription(errorMessage);
    channel.send(embed);
}

function sendMessage({ title: title, channel: channel, message: message }) {
    const embed = new MessageEmbed().setTitle(title).setColor(0xC79B3B).setDescription(message);
    channel.send(embed);
}

function sendAttachMessage({ title: title, channel: channel, message: message, file: file }) {
    const embed = new MessageEmbed()
        .setTitle(title)
        .setDescription(message)
        .setColor(0x69F0AE)
        .attachFiles(file);
    channel.send(embed);
}

bot.login("NzM1MTg2OTc4MzgyODA3MDkw.XxcpgQ.th6odTbnzzlaBrDfRJSYh2oxg7o");
