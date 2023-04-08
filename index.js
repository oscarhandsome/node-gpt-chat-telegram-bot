const { Telegraf } = require("telegraf");
// const { message } = require("telegraf/filters");
// const axios = require("axios");
const {
  runCompletion,
  promptFirst,
  promptSecond,
  generateImg,
} = require("./openai");

const bot = new Telegraf(process.env.BOT_TOKEN);
bot.start((ctx) =>
  ctx.reply("Welcome, please generate news! with /news command")
);
bot.on("message", async (ctx) => {
  if (ctx.message.text === "/news") {
    ctx.reply(`Please wait, i'm generating news!`);

    const basicWords = await runCompletion(promptFirst);
    const resultFakeNews = await runCompletion(
      promptSecond.replace("%", basicWords)
    );
    const imageNews = await generateImg(`${JSON.stringify(basicWords)}`);

    // ctx.replyWithPhoto(`${imageNews}`);
    // ctx.reply(`${resultFakeNews}`);

    ctx.replyWithPhoto(
      { url: `${imageNews}` },
      {
        caption: `${resultFakeNews}`,
        parse_mode: "MarkdownV2",
      }
    );

    return;
  }

  ctx.reply(`Oops! Request denied!`);
});

bot.launch();

// Enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
