const { Configuration, OpenAIApi } = require("openai");
require("dotenv").config();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const promptFirst = `Please create words: 1) famous man or women name and surname, 2) some place name on a earth or some popular event, 3) any verb for a action`;
const promptSecond = `Please create funny fake news from 25 to 150 words with this words: %`;

const runCompletion = async (prompt) => {
  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt,
    });
    return completion.data.choices[0].text;
  } catch (error) {
    throw new Error(error);
  }
};

const generateImg = async (prompt) => {
  try {
    const imgData = await openai.createImage({
      prompt,
      n: 1,
      size: "256x256",
    });

    const dataURL = imgData.data.data[0].url;
    return dataURL;
  } catch (error) {
    throw new Error(error);
  }
};

// generateImg();

module.exports = {
  runCompletion,
  promptFirst,
  promptSecond,
  generateImg,
};
