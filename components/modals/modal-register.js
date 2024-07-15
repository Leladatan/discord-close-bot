const { ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');

const registrationModal = new ModalBuilder()
  .setCustomId('modal-register')
  .setTitle('Регистрация')
  .addComponents(
    new ActionRowBuilder().addComponents(
      new TextInputBuilder()
        .setCustomId('pos1')
        .setLabel('Рейтинг на позиции "Легкая (1)"')
        .setPlaceholder('Введите ваш рейтинг')
        .setStyle(TextInputStyle.Short)
        .setMaxLength(5)
        .setMinLength(2)
        .setRequired(false)
    ),
    new ActionRowBuilder().addComponents(
      new TextInputBuilder()
        .setCustomId('pos2')
        .setLabel('Рейтинг на позиции "Центральная (2)"')
        .setPlaceholder('Введите ваш рейтинг')
        .setStyle(TextInputStyle.Short)
        .setMaxLength(5)
        .setMinLength(2)
        .setRequired(false)
    ),
    new ActionRowBuilder().addComponents(
      new TextInputBuilder()
        .setCustomId('pos3')
        .setLabel('Рейтинг на позиции "Сложная (3)"')
        .setPlaceholder('Введите ваш рейтинг')
        .setStyle(TextInputStyle.Short)
        .setMaxLength(5)
        .setMinLength(2)
        .setRequired(false)
    ),
    new ActionRowBuilder().addComponents(
      new TextInputBuilder()
        .setCustomId('pos4')
        .setLabel('Рейтинг на позиции "Частичной поддержки (4)"')
        .setPlaceholder('Введите ваш рейтинг')
        .setStyle(TextInputStyle.Short)
        .setMaxLength(5)
        .setMinLength(2)
        .setRequired(false)
    ),
    new ActionRowBuilder().addComponents(
      new TextInputBuilder()
        .setCustomId('pos5')
        .setLabel('Рейтинг на позиции "Полной поддержки (5)"')
        .setPlaceholder('Введите ваш рейтинг')
        .setStyle(TextInputStyle.Short)
        .setMaxLength(5)
        .setMinLength(2)
        .setRequired(false)
    ),
  );

module.exports = registrationModal;