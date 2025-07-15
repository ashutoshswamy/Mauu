const discord = require("discord.js");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

module.exports = {
  data: new discord.SlashCommandBuilder()
    .setName("askai")
    .setDescription("Ask a question to AI")
    .addStringOption((option) =>
      option
        .setName("question")
        .setDescription("Your question for AI")
        .setRequired(true)
    ),
  /**
   * @param {discord.Client} client
   * @param {discord.CommandInteraction} interaction
   */
  async execute(client, interaction) {
    const userQuestion = interaction.options.getString("question");

    await interaction.deferReply();

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

      const prompt = `${userQuestion}\n\nPlease keep the answer concise and under 2000 characters due to Discord message limits.`;

      const result = await model.generateContent(prompt);
      let response = result.response.text();

      if (response.length > 1990) {
        response = response.slice(0, 1990) + "…";
      }

      await interaction.editReply({
        content: `🧠 **Answer:**\n${response}`,
      });
    } catch (error) {
      console.error("Gemini API Error:", error);
      await interaction.editReply({
        content: "❌ Failed to get a response from AI.",
      });
    }
  },
};
