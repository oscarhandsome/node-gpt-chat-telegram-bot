const { Telegraf } = require("telegraf");
const { message } = require("telegraf/filters");
const axios = require("axios");

const {
  runCompletion,
  generateImg,
} = require("./controllers/openAiController");

const promptFirst = `Imagine 3 random words corresponding to these points: famous man or women name and surname, some place name on a earth or some popular event, any verb for a action`;
const promptSecond = `Write joke news using this following words: %`;

const bot = new Telegraf(process.env.BOT_TOKEN);
bot.start((ctx) =>
  ctx.reply("Welcome, please generate news! with /news command")
);
bot.on("message", async (ctx) => {
  if (ctx.message.text === "/news") {
    try {
      ctx.reply(`Please wait, i'm generating news!`);

      const basicWords = await runCompletion(promptFirst);
      console.log(basicWords);
      console.log(stringCleaner(basicWords));
      const resultFakeNews = await runCompletion(
        promptSecond.replace("%", basicWords)
      );
      ctx.reply(`News preapared. I'm drawing image for this news...`);
      const imageNews = await generateImg(`${JSON.stringify(basicWords)}`);

      ctx.replyWithPhoto(`${imageNews}`);
      ctx.reply(`${resultFakeNews}`);
      console.log(imageNews);
      console.log(resultFakeNews);

      ctx.replyWithPhoto(
        { url: `${imageNews}` },
        {
          caption: `${stringCleaner(resultFakeNews)}`,
          parse_mode: "MarkdownV2",
        }
      );
    } catch (error) {
      ctx.reply(`Sorry. Something went wrong.`);
      throw new Error(error);
    } finally {
      return;
    }
  }

  if (ctx.message.text === "/help") {
    ctx.reply(`Generator News - working after typing /news command`);
  }
  if (ctx.message.text === "/info") {
    ctx.reply(
      `Introducing the wackiest news channel on the internet! Our news generator channel is dedicated to creating fake, but funny news stories that will leave you in stitches. From aliens invading Earth to dogs learning how to speak, our outrageous headlines will keep you entertained for hours. So sit back, relax, and get ready to laugh out loud as we bring you the most absurd and hilarious news stories you'll ever hear.`
    );
  }

  ctx.reply(`Oops! Request denied!`);
});

bot.launch();

// Enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
