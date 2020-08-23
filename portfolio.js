const fetch = require("node-fetch");

const CRYPTOPANIC_API_KEY = process.env.CRYPTOPANIC_KEY;
const cpanicURL = `https://cryptopanic.com/api/v1/portfolio/?auth_token=${CRYPTOPANIC_API_KEY}`;

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

module.exports = portfolio;