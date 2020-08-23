const { Composer, Markup } = require("micro-bot");
const bot = new Composer();
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
