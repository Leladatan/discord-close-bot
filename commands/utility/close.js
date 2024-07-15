const {SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder} = require('discord.js');

const row = new ActionRowBuilder()
  .addComponents(
    new ButtonBuilder()
      .setCustomId('register')
      .setLabel('Зарегистрироваться')
      .setStyle(ButtonStyle.Primary),
    new ButtonBuilder()
      .setCustomId('balance')
      .setLabel('Сбалансировать')
      .setStyle(ButtonStyle.Primary),
    new ButtonBuilder()
      .setCustomId('list')
      .setLabel('Список')
      .setStyle(ButtonStyle.Secondary),
    new ButtonBuilder()
      .setCustomId('leave')
      .setLabel('Покинуть')
      .setStyle(ButtonStyle.Danger)
  );

const embed = new EmbedBuilder()
  .setColor(0x0099FF)
  .setTitle('«Close Bot — бот для автоматизации распределения игроков по командам».')
  .setDescription('«Close Bot — это удобный и эффективный бот для Discord, который помогает автоматизировать процесс распределения игроков по командам в игре Dota 2 и аналогичных играх. Бот использует алгоритмы машинного обучения и анализа данных для определения оптимального состава команд, учитывая уровень навыков игроков, их предпочтения и историю игры. Это позволяет создать сбалансированные составы команд, повысить эффективность игры и уменьшить количество споров и конфликтов между игроками. Close Bot также предоставляет инструменты для мониторинга и управления процессом распределения, позволяя администраторам серверов контролировать ситуацию и вносить корректировки при необходимости. Попробуйте Close Bot сегодня и улучшите игровой опыт вашей команды!»')
  .setImage('https://i.pinimg.com/564x/3a/84/ea/3a84ea8f5e24b3ab25322bf49cb66ad5.jpg')
  .setTimestamp()
  .setFooter({text: 'Предоставлено Close Bot'});

module.exports = {
  data: new SlashCommandBuilder()
    .setName('close')
    .setDescription('Информация о текущем клозе.'),
  async execute(interaction) {
    await interaction.reply({
      embeds: [embed],
      components: [row],
    });
  },
};