const { Telegraf } = require("telegraf");
// const { message } = require("telegraf/filters");
// const axios = require("axios");

// should be at top
// process.on("uncaughtException", (err) => {
//   console.log("UNCAUGHT EXCEPTION 🔴🔴🔴 Shutting down server...");
//   console.log(err.name, err.message);
//   process.exit(1);
// });

const {
  runCompletion,
  promptFirst,
  promptSecond,
  generateImg,
} = require("./openai");

const stringCleaner = (str) =>
  str
    .replace(/\w+(\n|\n1)/gi, "")
    .replace("_", "\\_")
    .replace("*", "\\*")
    .replace("[", "\\[")
    .replace("`", "\\`");

const bot = new Telegraf(process.env.BOT_TOKEN);
bot.start((ctx) =>
  ctx.reply("Welcome, please generate news! with /news command")
);
bot.on("message", async (ctx) => {
  if (ctx.message.text === "/news") {
    ctx.reply(`Please wait, i'm generating news!`);

    ctx.reply(`I'm searching a words...`);
    const basicWords = await runCompletion(promptFirst);
    ctx.reply(`I'm preparing news...`);
    const resultFakeNews = await runCompletion(
      promptSecond.replace("%", basicWords)
    );
    ctx.reply(`I'm drawing image for this news...`);
    const imageNews = await generateImg(`${JSON.stringify(basicWords)}`);

    // ctx.replyWithPhoto(`${imageNews}`);
    // ctx.reply(`${resultFakeNews}`);

    ctx.replyWithPhoto(
      { url: `${imageNews}` },
      {
        caption: `${stringCleaner(resultFakeNews)}`,
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

// process.on("unhandledRejection", (err) => {
//   console.log("UNHANDLED REJECTION 🔴🔴🔴 Shutting down server...");
//   // console.log(err);
//   console.log(err.name, err.message);
//   server.close(() => {
//     process.exit(1);
//     // }, 4000);
//   });
// });

// process.on("SIGTERM", () => {
//   console.log("👋 SIGTERM RECEIVED. Shutting down gracefully");
//   server.close(() => {
//     console.log("💥 Process terminated!");
//     // process.exit(1);
//   });
// });
