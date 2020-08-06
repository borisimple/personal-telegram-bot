const fetch = require("node-fetch");
const Telegraf = require("telegraf");
const Markup = require("telegraf/markup");

const bot = new Telegraf(process.env["TELEGRAM_TOKEN"]);
const CRYPTOPANIC_API_KEY = process.env["CRYPTOPANIC_KEY"];
const cpanicURL = `https://cryptopanic.com/api/v1/portfolio/?auth_token=${CRYPTOPANIC_API_KEY}`;

bot.command("portfolio", (ctx) => {
  // return (
  //   reply(
  //     `How can I help you? 🤔`,
  //     Markup.keyboard([["💰 Portfolio"]])
  //       .oneTime()
  //       .resize()
  //       .extra()
  //   ),
  //   Markup.removeKeyboard()
  // );
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
        ctx.reply(`Error occured: ${err}`);
      });
  });
});

// bot.hears("💰 Portfolio", (ctx) => {
//   let coins = fetch(cpanicURL);
//   coins.then((res) => {
//     if (res.status !== 200) {
//       console.log(`HTTP response error: ${res.status}`);
//       return "Error 😢";
//     }
//     res
//       .json()
//       .then((data) => {
//         let amounts = "";
//         for (let [key, value] of Object.entries(data.portfolio.totals)) {
//           amounts += `${key}: ${value}\n`;
//         }
//         ctx.replyWithHTML(`<b style="color: red">PORTFOLIO</b>\n\n${amounts}`);
//       })
//       .catch((err) => {
//         console.log(err);
//         ctx.reply(`Error occured: ${err}`);
//       });
//   });
// });

bot.launch();
