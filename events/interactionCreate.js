const {Events, EmbedBuilder} = require('discord.js');
const registrationModal = require('../components/modals/modal-register');
const store = require('../store/index');
const distributePlayers = require('../utils/distribute-players');
const balanceTeams = require('../utils/balance-teams');
const getPositionOnNumber = require('../utils/get-position-on-number');
const getEmojiOnNumber = require('../utils/get-emoji-on-number');

module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction) {
    if (interaction.isChatInputCommand()) {
      const command = interaction.client.commands.get(interaction.commandName);

      if (!command) {
        console.error(`No command matching ${interaction.commandName} was found.`);
        return;
      }

      try {
        await command.execute(interaction);
      } catch (error) {
        console.error(error);
        if (interaction.replied || interaction.deferred) {
          await interaction.followUp({content: 'There was an error while executing this command!', ephemeral: true});
        } else {
          await interaction.reply({content: 'There was an error while executing this command!', ephemeral: true});
        }
      }
    } else if (interaction.isModalSubmit()) {
      if (interaction.customId === 'modal-register') {
        const user = interaction.user;

        const fields = interaction.fields;

        const pos1 = +fields.getTextInputValue('pos1');
        const pos2 = +fields.getTextInputValue('pos2');
        const pos3 = +fields.getTextInputValue('pos3');
        const pos4 = +fields.getTextInputValue('pos4');
        const pos5 = +fields.getTextInputValue('pos5');

        store.set(user.username, {id: user.id, name: user.username, pos1, pos2, pos3, pos4, pos5});

        await interaction.reply(`${user.globalName}(${user.username}) зарегистрировался на клоз!`);
      }
    } else if (interaction.isButton()) {
      const user = interaction.user;

      switch (interaction.customId) {
        case 'register':
          await interaction.showModal(registrationModal);
          break;
        case 'list':
          let message = '**Список игроков:**\n\n';

          let count = 0;

          store.forEach((player) => {
            message += `${count + 1}. ${player.name} - Позиции: `;
            if (player.pos1) {
              message += `Легкая: ${player.pos1} `;
            }

            if (player.pos2) {
              message += `Центральная: ${player.pos2} `;
            }

            if (player.pos3) {
              message += `Сложная: ${player.pos3} `;
            }

            if (player.pos4) {
              message += `Частичная поддержка: ${player.pos4} `;
            }

            if (player.pos5) {
              message += `Полная поддержка: ${player.pos5} `;
            }

            count += 1;
          });

          if (message === '**Список игроков:**\n\n') {
            message += 'Нет зарегистрированных участников на клоз.';
          }

          await interaction.reply(message);
          break;
        case 'leave':
          if (store.has(user.username)) {
            store.delete(user.username);
            await interaction.reply(`${user.globalName}(${user.username}) покинул клоз.`);
            break;
          }
          await interaction.reply(`${user.globalName}(${user.username}) вы не зарегистрированы на клоз.`);
          break;
        case 'balance':
          const testData = [
            {id: 1, name: "1", pos1: 7000, pos2: 5000, pos3: 0, pos4: 0, pos5: 0},
            {id: 1, name: "2", pos1: 3000, pos2: 10000, pos3: 5000, pos4: 0, pos5: 0},
            {id: 1, name: "3", pos1: 0, pos2: 0, pos3: 3000, pos4: 5000, pos5: 5000},
            {id: 1, name: "4", pos1: 7000, pos2: 0, pos3: 0, pos4: 0, pos5: 7000},
            {id: 1, name: "5", pos1: 0, pos2: 0, pos3: 0, pos4: 0, pos5: 2000},
            {id: 1, name: "6", pos1: 6000, pos2: 6000, pos3: 0, pos4: 0, pos5: 0},
            {id: 1, name: "7", pos1: 5000, pos2: 5000, pos3: 5000, pos4: 5000, pos5: 5000},
            {id: 1, name: "8", pos1: 0, pos2: 3500, pos3: 3500, pos4: 3500, pos5: 3500},
            {id: 1, name: "9", pos1: 0, pos2: 3000, pos3: 3000, pos4: 3000, pos5: 3000},
            {id: 1, name: "10", pos1: 0, pos2: 7000, pos3: 0, pos4: 7000, pos5: 7000},
          ];

          const {players, error} = distributePlayers(testData);
          const [team1, team2] = balanceTeams(players);

          let description = `## Команда Radiant (${team1.reduce((acc, player) => acc + player.mmr, 0)})\n`;
          team1.forEach((player, index) => {
            description += `${getEmojiOnNumber(index + 1)}  ${getPositionOnNumber(player.pos)} (${player.mmr}) - <@${player.id}>\n\n`;
          });

          description += `## Команда Dire (${team2.reduce((acc, player) => acc + player.mmr, 0)})\n`;
          team2.forEach((player, index) => {
            description += `${getEmojiOnNumber(index + 1)}  ${getPositionOnNumber(player.pos)} (${player.mmr}) - <@${player.id}>\n\n`;
          });

          const embed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle('Распределение игроков по командам.')
            .setDescription(error ? error : description)
            .setTimestamp()
            .setFooter({text: 'Предоставлено Close Bot'});

          await interaction.reply({
            embeds: [embed],
          });
          break;
      }
    }
  },
}
;