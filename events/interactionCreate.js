const {Events, EmbedBuilder} = require('discord.js');
const registrationModal = require('../components/modals/modal-register');
const store = require('../store/index');
const distributePlayers = require('../utils/distribute-players');
const BalanceMMR = require('../utils/balance-mmr');

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

        store.set(user.username, {name: user.username, pos1, pos2, pos3, pos4, pos5});

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
            { name: "1", pos1: 0, pos2: 0, pos3: 0, pos4: 0, pos5: 10 },
            { name: "2", pos1: 0, pos2: 20, pos3: 0, pos4: 0, pos5: 0 },
            { name: "3", pos1: 0, pos2: 0, pos3: 30, pos4: 0, pos5: 0 },
            { name: "4", pos1: 0, pos2: 0, pos3: 0, pos4: 40, pos5: 0 },
            { name: "5", pos1: 0, pos2: 0, pos3: 0, pos4: 0, pos5: 50 },
            { name: "6", pos1: 10, pos2: 20, pos3: 30, pos4: 40, pos5: 50 },
            { name: "7", pos1: 10, pos2: 20, pos3: 30, pos4: 40, pos5: 50 },
            { name: "8", pos1: 10, pos2: 20, pos3: 30, pos4: 40, pos5: 50 },
            { name: "9", pos1: 10, pos2: 20, pos3: 30, pos4: 40, pos5: 50 },
            { name: "10", pos1: 10, pos2: 10, pos3: 10, pos4: 10, pos5: 50 },
          ];
          const {players, error} = distributePlayers(testData);

          const balanced = BalanceMMR(players);

          const description = '## Команда A \n## Команда B  ';

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