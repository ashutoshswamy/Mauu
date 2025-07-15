const discord = require("discord.js");
const { GoogleGenAI, Modality } = require("@google/genai");
const fs = require("node:fs");
const path = require("node:path");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

module.exports = {
  data: new discord.SlashCommandBuilder()
    .setName("imagegen")
    .setDescription("Generate an image using AI")
    .addStringOption((option) =>
      option
        .setName("prompt")
        .setDescription("Describe the image to generate")
        .setRequired(true)
    ),
  /**
   * @param {discord.Client} client
   * @param {discord.CommandInteraction} interaction
   */
  async execute(client, interaction) {
    const prompt = interaction.options.getString("prompt");
    await interaction.deferReply();

    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash-preview-image-generation",
        contents: prompt,
        config: {
          responseModalities: [Modality.TEXT, Modality.IMAGE],
        },
      });

      const parts = response.candidates?.[0]?.content?.parts || [];
      let imageBuffer = null;
      let responseText = null;

      for (const part of parts) {
        if (part.text) responseText = part.text;
        if (part.inlineData?.data) {
          imageBuffer = Buffer.from(part.inlineData.data, "base64");
        }
      }

      if (!imageBuffer) {
        return await interaction.editReply(
          "❌ AI did not return an image. Try a different prompt."
        );
      }

      const fileName = `gemini-image-${Date.now()}.png`;
      const filePath = path.join("/tmp", fileName);
      fs.writeFileSync(filePath, imageBuffer);

      const attachment = new discord.AttachmentBuilder(filePath);
      await interaction.editReply({
        content: `🧠 **Prompt:** ${prompt}\n📸 **Image generated**`,
        files: [attachment],
      });

      fs.unlinkSync(filePath);
    } catch (err) {
      console.error("Gemini image generation error:", err);
      await interaction.editReply(
        "❌ Failed to generate image. Please try again later."
      );
    }
  },
};
