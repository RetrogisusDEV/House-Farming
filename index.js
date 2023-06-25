require("dotenv").config();
const Discord = require("discord.js");
const client = new Discord.Client();
const fs = require("fs");
const os = require("os");

var json = require("./config.json");
var adminID = json.adminID;
var invite = json.inviteURL;
var invite2 = json.inviteBOT
var repo = json.repoURL;
var db = JSON.parse(fs.readFileSync("./db.json"));
var id = 0;

let interval;

var time = new Date();
var hour = time.getHours();
var minute = time.getMinutes();
var second = time.getSeconds();

console.log("Loading... \n");

var otalmem = os.totalmem / 1000000000;
var reemem = os.freemem / 1000000000;
var usedmem = os.totalmem - os.freemem;
usedmem = usedmem / 1000000000;

var otalmems = otalmem.toString().slice(0, 4);
var reemems = reemem.toString().slice(0, 4);
var usedmems = usedmem.toString().slice(0, 4);

var memory =
  "total memory: " +
  otalmems +
  " GB\n" +
  "memory free:" +
  reemems +
  " GB\n" +
  "used: " +
  usedmems +
  " GB\n";

console.log(memory);

function eco() {
  db = JSON.parse(fs.readFileSync("./db.json"));
  if (db[id] == null) db[id] = { money: 0, exp: 0, pick: 0, clootbox: 0 };
  console.log(db[id].money);
}

eco();
client.on("ready", async () => {
  console.log(`${client.user.username} hosting \n`);
  client.user.setActivity(`Try **-help**`, { type: "PLAYING" });

  console.log("Commamds : Ready :D");
  console.log("servers: " + client.guilds.cache.size);

  client.on("message", async (msg) => {
    switch (msg.content) {
      case "-ping":
        let pings = Math.floor(client.ws.ping);
        let pingss;
        if (pings <= 100) pingss = pings + " ms, good ping :)";
        if (pings > 100 && pings < 301)
          pingss = pings + " ms, bad ping, network is slow";
        if (pings > 300 && pings < 1001)
          pingss = pings + " ms, api is very slow";
        if (pings > 1000)
          pingss = pings + " s, api and network are very bad, now";

        msg.channel.send(`>>> Pong! \n latency: ${pingss} `);
        break;

      case "-eye":
        msg.channel.send(
          ">>> You are now subscribed to eye reminders. \n (in 1 hours you receive a message..."
        );
        interval = setInterval(function () {
          msg.author
            .send(">>> Please take an eye break now!")
            .catch(console.error);
        }, 3600000); //every hour
        break;

      case "-stop":
        msg.channel.send(">>> I have stopped eye reminders.");
        clearInterval(interval);
        break;

      case "-catch":
        id = msg.author.id;
        eco();

        let gain = Math.floor(Math.random() * 100) + 100 * db[id].pick;
        let expgain = Math.floor(gain / 2);

        db[id].money += gain;
        db[id].exp += expgain;
        msg.channel.send(
          `>>> You catch ${gain} \nyou balance is **${db[id].money}** \nyou gain: **${expgain} experience** \n Pick Level: ${db[id].pick}`
        );
        fs.writeFile("db.json", JSON.stringify(db), "utf8", (err) => {
          if (err) throw err;
        });

        break;

      case "-invite":
msg.channel.send(invite2);
        msg.channel.send(invite);
        break;

      case "-help":
        msg.channel.send(
          ">>> Help command \n prefix: **-** \n \n commands: \n -help: help command \n \n __**Economy**__ -catch: catch 1 global point \n -slots: play slots \n \n __**utils**__  \n -eye: ... \n -stop: ... \n \n __**Bot commands**__ \n \n -info: view info the bot \n -invite :get invite link \n -repo: view source"
        );
        break;

      case "-info":
        otalmem = os.totalmem / 1000000000;
        reemem = os.freemem / 1000000000;
        memory =
          "total memory: " +
          otalmem +
          " GB\n" +
          "memory free: " +
          reemem +
          " GB";
        usedmem = os.totalmem - os.freemem;
        usedmem = usedmem / 1000000000;
        hour = time.getHours();
        var minute = time.getMinutes();
        var second = time.getSeconds();
        let timeget = ";" + hour + ":" + minute + "," + second;
        msg.channel.send(
          `>>> **Bot Infomation** \n join in: ${client.guilds.cache.size} \n name bot : ${client.user.username} \n Prefix: **-** \n \n **module** ver: \n discord.js@12.5.3\n fs@newer \n Time: ${timeget} - GMT-4 \n \n ${memory} \n used: ${usedmem} GB`
        );
        break;

      case "-repo":
        msg.channel.send(repo);
        break;
    }
  });

  client.on("message", async (msg, args) => {
    if (!msg.content.startsWith("-slots")) return;
    let amount = msg.content;
    let money = amount.replace("-slots", "");

    const slotItem = ["🎰", "🎁", "💎", "💰", "💵"];

    let id = msg.author.id;
    eco();
    let allmoney = db[id].money;

    if (!money) return msg.channel.send("specify an amount!");
    if (money > allmoney)
      return msg.channel.send("you are betting more than you have");

    let win = false;
    let number = [];

    for (i = 0; i < 3; i++) {
      number[i] = Math.floor(Math.random() * slotItem.length);
    }

    if (number[0] == number[1] && number[1] == number[2]) {
      money *= 3;
      win = true;
    } else if (
      number[0] == number[1] ||
      number[0] == number[2] ||
      number[1] == number[2]
    ) {
      money *= 2;
      win = true;
    }
    if (win) {
      msg.channel.send(
        `>>> [${slotItem[number[0]]}]` +
          `|` +
          ` [${slotItem[number[1]]}]` +
          `|` +
          `[${slotItem[number[2]]}]` +
          `\n You Win ${money} !!!`
      );
      db[id].money += money;
      db[id].exp += Math.floor(money / 10000);
    } else {
      msg.channel.send(
        `>>> [${slotItem[number[0]]}]` +
          `|` +
          `[${slotItem[number[1]]}]` +
          `|` +
          `[${slotItem[number[2]]}]` +
          `\n You Lose **${money}** !!!`
      );
      db[id].money -= money;
    }

    fs.writeFile("db.json", JSON.stringify(db), "utf8", (err) => {
      if (err) throw err;
    });
  });

  client.on("message", async (msg, args) => {
    if (msg.content.startsWith("-calc")) {
      let args = msg.content.split(" ").slice(1);
      let operation = args.join(" ");
      let ope1 = operation.replace("x", "*");
      let ope2 = ope1.replace("÷", "/");
      try {
        let result = eval(ope2);
        msg.channel.send(`El resultado es: ${result}`);
      } catch (e) {
        msg.channel.send("Operación inválida. ");
      }
    }
  });

  client.on("message", async (msg, args) => {
    if (msg.content.startsWith("-bal")) {
      let user = msg.mentions.members.first() || msg.author;
      id = user.id;
      eco();
      let bal = db[id].money;
      let expe = db[id].exp;
      let bals = bal.toLocaleString();
let expes = expe.toLocaleString();
      msg.channel.send(
        `>>> you balance is : ${bals} \n you experience is : ${expes} `
      );
    }
  });

  client.on("message", async (msg) => {
    if (msg.content === "-chat") {
      let db = JSON.parse(fs.readFileSync("./db.json"));

      if (db[chat] == null)
        db[chat] = {
          chats: "No have messages",
          chatss: "No have messages",
          chatsss: "No have messages",
          chatssss: "No have messages",
          chatsssss: "No have messages",
        };

      time = new Date();
      hour = time.getHours();
      minute = time.getMinutes();
      second = time.getSeconds();
      let timeget = hour + ":" + minute + ";" + second;
      msg.channel.send(
        `>>> Chat Global: \n \n messages sends: \n  ${db[chat].chats} \n ${db[chat].chatss} \n ${db[chat].chatsss} \n ${db[chat].chatssss} \n ${db[chat].chatsssss} \n \n time now: ${timeget} (GMT-4)`
      );
    }
  });

  client.on("message", async (msg, args) => {
    if (msg.content.startsWith("-send")) {
      let db = JSON.parse(fs.readFileSync("./db.json"));
      let sending = msg.content;
      let sendings = sending.replace("-send", "");
      if (db[chat] == null)
        db[chat] = {
          chats: "No have messages",
          chatss: "No have messages",
          chatsss: "No have messages",
          chatssss: "No have messages",
          chatsssss: "No have messages",
        };

      time = new Date();
      hour = time.getHours();
      minute = time.getMinutes();
      second = time.getSeconds();
      let timeget = hour + ":" + minute + ";" + second;
      msg.channel.send("sending!!!");
    }
  });

  client.on("message", async (msg, args) => {
    if (msg.content.startsWith("-shop")) {
    }
  });
});
client.login(process.env.TOKEN);
