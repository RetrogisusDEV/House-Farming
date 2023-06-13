require('dotenv').config();
const Discord = require('discord.js');
const client = new Discord.Client();
const fs = require('fs');

var json = require("./config.json");
var adminID = json.adminID;
var invite = json.inviteURL;
var repo = json.repoURL;

var db = require("./db.json");

let interval;

console.log("Loading... \n");

 client.on('ready', async () => {
 console.log(`${client.user.username} hosting \n`);
     client.user.setActivity('Hello :)', {type: 'Playing'});

console.log("Commamds : \n");
client.on('message', async msg => {
  switch (msg.content) {
    case "-ping":
      msg.reply(`>>> Pong! \n latency: ${Math.round(client.ws.ping)} ms `);
      break;
    case "-eye":
      msg.channel.send(">>> You are now subscribed to eye reminders. \n (in 1 hours you receive a message...");
       interval = setInterval (function () {
        msg.author.send(">>> Please take an eye break now!")
        .catch(console.error);
      }, 3600000); //every hour
      break;
    case "-stop":
      msg.channel.send(">>> I have stopped eye reminders.");
      clearInterval(interval);
      break;
    case "-catch":
      let gain = 1;
      let id = msg.author.id;

      if (db[`money_${id}`] == null) db[`money_${id}`] = (id, 0);
      let saved = {id: db[`money_${id}`]};
      db[`money_${id}`] += (id, gain)
      bal = db[`money_${id}`];
        msg.channel.send(`>>> You catch ${gain} \nyou balance is **${bal}**`);

fs.writeFile('db.json', JSON.stringify(saved),'utf8', (err) => {
  if (err) throw err;
  console.log('The file has been saved!');
});

break;
case "-global":
      if (typeof moneyglobal === "undefined") moneyglobal = 0;
      msg.channel.send(moneyglobal);
      break;
    case "-invite":
      msg.channel.send(invite);
      break;
    case "-help":
      msg.channel.send(">>> Help command \n prefix: **-** \n \n commands: \n -help : help command \n -catch : catch 1 global point \n -eye : ... \n -stop : ... \n -invite : get invite link ");
 break;
    case "-info":
      msg.channel.send(`>>> **Bot Infomation** \n join in: ${client.guilds.size} \n name bot : ${client.user.username} \n Prefix: **-** \n \n **module ver: \n discord.js@12.5.3 (newer : 14.x) \n quick.db@newer (no installed  now)`);
break;
     case "-repo":
      msg.channel.send(repo);
      break;
}
});

client.on('message', async (msg, args) => {

  if (!msg.content.startsWith("-slots")) return;
   let amount = msg.content;
  let money = amount.replace("-slots", "");

const slotItem = ["🔅", "✴️", "🎶"]

let id = msg.author.id;
let allmoney = db[`money_${id}`];

if (!money) return msg.channel.send("specify an amount!");
if (money > allmoney) return msg.channel.send("you are betting more than you have");

let win = false;
let number = []

    for (i = 0; i < 3; i++) { number[i] = Math.floor(Math.random() * slotItem.length); }

    if (number[0] == number[1] && number[1] == number[2]) {
        money *= 3
        win = true;
    } else if (number[0] == number[1] || number[0] == number[2] || number[1] == number[2]) {
        money *= 2
        win = true;
    }
 if (win) {
 msg.channel.send(`>>> [${slotItem[number[0]]}] |  [${slotItem[number[1]]}] | [${slotItem[number[2]]}] \n You Win ${money} !!!`);
 db[`money_${id}`] += (id , money);
}else{
 msg.channel.send(`>>> [${slotItem[number[0]]}] |  [${slotItem[number[1]]}] | [${slotItem[number[2]]}] \n You Lose **${money}** !!!`);
 db[`money_${id}`] -= (id , money);
}
})
});
client.login(process.env.TOKEN);
