const fetch = require("node-fetch");
const { Composer, Markup } = require("micro-bot");
const fb = require("./firebase");

const bot = new Composer();
const CRYPTOPANIC_API_KEY = process.env.CRYPTOPANIC_KEY;
const cpanicURL = `https://cryptopanic.com/api/v1/portfolio/?auth_token=${CRYPTOPANIC_API_KEY}`;

bot.command("start", ({ reply }) => {
  return (
    reply(
      `How can I help you? 🤔`,
      Markup.keyboard([["💰 Portfolio", "٪ Prediction"]])
        .oneTime()
        .resize()
        .extra()
    ),
    Markup.removeKeyboard()
  );
});

bot.hears("💰 Portfolio", (ctx) => {
  ctx.reply(`Date: ${new Date().toLocaleDateString()}`);
  let coins = fetch(cpanicURL);
  coins.then((res) => {
    if (res.status !== 200) {
      console.log(`HTTP response error: ${res.status}`);
      return "Error 😢";
    }
    res
      .json()
      .then((data) => {
        let amounts = "";
        for (let [key, value] of Object.entries(data.portfolio.totals)) {
          amounts += `${key}: ${value}\n`;
        }
        ctx.replyWithHTML(`<b style="color: red">PORTFOLIO</b>\n\n${amounts}`);
      })
      .catch((err) => {
        console.log(err);
        ctx.reply(`Error occurred: ${err}`);
      });
  });
});

bot.hears("٪ Prediction", (ctx) => {
  ctx.reply("What % should I set up?\n");
  bot.on("text", (ctx) => {
    typeof ctx.message.text != "number"
      ? ctx.reply("You need to reply with a % number!")
      : fb.updatePercentage(parseInt(ctx.message.text));
  });
});

module.exports = bot;
