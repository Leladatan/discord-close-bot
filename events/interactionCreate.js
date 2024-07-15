const {Events} = require('discord.js');
const registrationModal = require('../components/modals/modal-register');
const store = require('../store/index');

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
        case
        'leave'
        :
          if (store.has(user.username)) {
            store.delete(user.username);
            await interaction.reply(`${user.globalName}(${user.username}) покинул клоз.`);
            break;
          }
          await interaction.reply(`${user.globalName}(${user.username}) вы не зарегистрированы на клоз.`);
          break;
      }
    }
  },
}
;