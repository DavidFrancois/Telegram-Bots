var Bot = require('telegram-api').default;
var Message = require('telegram-api/types/Message');

//Import du module Question
var Question = require('telegram-api/types/Question');

//Import du module Keyboard
var Keyboard = require('telegram-api/types/Keyboard'); 

var S = require('string');

var token = '205654328:AAHhfJccVjpdZLf05Bmz_jO-PdQ_JRv8FGE';

var bot = new Bot({token: token});
var ids = {};
var votes = {};
var options = require('./options.json').options;
var idTonton = '132295905';

bot.start();

//Création d'une Keyboard cachée par défaut
const hide = new Keyboard().hide();

bot.command('vote', function(message) {
	//Création d'une question, prototype à trouver sur github petit branleur
	const q = new Question().text("Où mange-t'on ?").answers([['CROUS'],['Chinois'],['Grec'],['Boulangerie'],['Franprix'],['MacDo']]).to(message.chat.id).reply(message.message_id);
	
	//envoie de la question au chat, petit pb -> utilisation de .sendMessage pas fonctionnel sous cette API
	//une fois lancée la Keyboard reste jusqu'a ce que l'utilisateur quitte le chat/deco/le bot se stop (je crois)
	bot.send(q).then(message => {vote(message)}, message => {bot.sendMessage(message.chat.id, "")})
});

var vote = function(msg) {
	var fromId = msg.from.id;
	var resp = msg.text;
	if (ids[fromId] != true) {
		if (options.indexOf(resp) != -1) {
			ids[fromId] = true;		
			votes[resp] = votes[resp] + 1 || 1;
			var Str = S(JSON.stringify(votes, null,2));
			
			var alrt = new Message().text(Str.between('{\n','\n}').s.toString()).to(msg.chat.id).keyboard(hide);
			bot.send(alrt);
		}
	} else if (ids[fromId] == true)
       		bot.send(new Message().text("Tu as déjà voté, coquin !").to(msg.chat.id).keyboard(hide));//utiliser hide sinon la keyboard reste affichée après le vote.
}

var count = function(count) {
	var str = "";

	for (var i = 0; i < count; ++i) {
		str += "|||||";
	}
	
	return str;
}


bot.command('check', function(msg) {
	var fromId = msg.chat.id;
	var string = "";
	var tab = Object.keys(votes);
      	
	for (var i = 0; i < tab.length; ++i) {
		string += tab[i] + '\t\t' + ' ' + count(votes[tab[i]]) + '\n';
	}
	
	var message = new Message().text(string).to(msg.chat.id);
	bot.send(message);
});

bot.command('end', function(msg) {
	var fromId = msg.chat.id;
	var tab = Object.keys(votes);
	
	if (msg.from.id == idTonton) {
		bot.send(new Message().text("Nope").to(msg.chat.id));
	} else if (msg.from.id == idTonton) {
		console.log("weshwesh");
	}
});

bot.command('rand', function(msg) {
	if ((Math.floor((Math.random() * 10) + 1)) % 2 != 0) 
		bot.send(new Message().text("c'est pair").to(msg.chat.id));
	else
		bot.send(new Message().text("c'est impair").to(msg.chat.id));
});
