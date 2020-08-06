const fetch = require("node-fetch");
const { Composer } = require("micro-bot");
const Telegraf = require("telegraf");
const Markup = require("telegraf/markup");

// const bot = new Telegraf(process.env["TELEGRAM_TOKEN"]);
const bot = new Composer;
const CRYPTOPANIC_API_KEY = process.env["CRYPTOPANIC_KEY"];
const cpanicURL = `https://cryptopanic.com/api/v1/portfolio/?auth_token=${CRYPTOPANIC_API_KEY}`;

bot.command("start", ({ reply }) => {
  return (
    reply(
      `How can I help you? 🤔`,
      Markup.keyboard([["💰 Portfolio"]])
        .oneTime()
        .resize()
        .extra()
    ),
    Markup.removeKeyboard()
  );
});

bot.hears("💰 Portfolio", (ctx) => {
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

module.exports = bot