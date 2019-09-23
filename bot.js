const http = require('http');
const fetch = require('node-fetch');
const Telegraf = require('telegraf');
const Markup = require('telegraf/markup');
const admin = require('firebase-admin');
const serviceAccount = require(process.env['FIREBASE_CREDS_CENT']);

const port = process.env.PORT || 3000;

const bot = new Telegraf(process.env['TELEGRAM_TOKEN']);
const CRYPTOPANIC_API_KEY = process.env['CRYPTOPANIC_KEY'];
const cpanicURL = `https://cryptopanic.com/api/v1/portfolio/?auth_token=${CRYPTOPANIC_API_KEY}`;

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount)
});

let db = admin.firestore();

const addNewAcc = email => {
	db.collection('accounts')
		.add({
			username: email.toLowerCase(),
			dateTimeAdded: admin.firestore.Timestamp.fromDate(new Date(Date.now())),
			banned: false
		})
		.catch(err => {
			console.log(`Error getting documents ${err}`);
		});
};

const server = http.createServer((req, res) => {
	res.statusCode = 200;
	res.setHeader('Content-Type', 'text/html');
	res.end('<h1>Bot is listening :)</h1>');
});

server.listen(port, () => {
	console.log(`Server running at port ${port}.`);
});

const validateEmail = email => {
	var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(String(email).toLowerCase());
};

bot.command('start', ({ reply }) => {
	return (
		reply(
			`How can I help you? 🤔`,
			Markup.keyboard([
				['💰 Portfolio', '🆕 Account'],
				['💻 Start Clicking', '🤑 Sum it up!']
			])
				.oneTime()
				.resize()
				.extra()
		),
		Markup.removeKeyboard()
	);
});

bot.hears('💰 Portfolio', ctx => {
	let coins = fetch(cpanicURL);
	coins.then(res => {
		if (res.status !== 200) {
			console.log(`HTTP response error: ${res.status}`);
			return 'Error 😢';
		}
		res
			.json()
			.then(data => {
				let amounts = '';
				for (let [key, value] of Object.entries(data.portfolio.totals)) {
					amounts += `${key}: ${value}\n`;
				}
				ctx.reply(amounts);
			})
			.catch(err => {
				console.log(err);
				ctx.reply('Error 😢');
			});
	});
});

bot.hears('🆕 Account', ctx => {
	ctx.reply('Ok 😎\nWhat 📧 address?');
	bot.on('text', ctx => {
		if (validateEmail(ctx.message.text)) {
			addNewAcc(ctx.message.text);
			ctx.reply(`Added ${ctx.message.text.toLowerCase()} 📩 to Firebase ‼`);
		} else {
			ctx.reply('Invalid E-Mail address  ‼');
		}
	});
});

bot.hears('💻 Start Clicking', ctx => ctx.reply('Disabled for now 🤷🏻‍♂️'));
bot.hears('🤑 Sum it up!', ctx => ctx.reply('Disabled for now 🤷🏻‍♂️'));

bot.launch();
