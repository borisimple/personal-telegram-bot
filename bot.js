const fetch = require("node-fetch");
const { Composer, Markup } = require("micro-bot");

const bot = new Composer();
const CRYPTOPANIC_API_KEY = process.env.CRYPTOPANIC_KEY;
const cpanicURL = `https://cryptopanic.com/api/v1/portfolio/?auth_token=${CRYPTOPANIC_API_KEY}`;

const portfolio = require("./portfolio");

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
  portfolio(ctx);
});

module.exports = bot;
