const discord = require("discord.js");

module.exports = {
  data: new discord.SlashCommandBuilder()
    .setName("ping")
    .setDescription("Check bot latency and uptime."),
  /**
   * @param {discord.Client} client
   * @param {discord.CommandInteraction} interaction
   */
  async execute(client, interaction) {
    const sent = await interaction.reply({
      embeds: [
        new discord.EmbedBuilder()
          .setColor("Blurple")
          .setDescription("Pinging..."),
      ],
      fetchReply: true,
    });

    const latency = sent.createdTimestamp - interaction.createdTimestamp;
    const uptime = formatUptime(client.uptime);

    await interaction.editReply({
      embeds: [
        new discord.EmbedBuilder()
          .setColor("Blurple")
          .setDescription(`🏓 Latency: ${latency}ms\n⏱️ Uptime: ${uptime}`),
      ],
    });
  },
};

function formatUptime(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const days = Math.floor(totalSeconds / (3600 * 24));
  const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return `${days}d ${hours}h ${minutes}m ${seconds}s`;
}
