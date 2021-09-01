import { MessageButton } from 'discord-buttons';

export default {
  name: 'ConfirmCrew',
  description: '',
  permissions: [],
  run: async ({ button }) => {
    if (button.id.endsWith(button.clicker.user.id)) {
      console.log('teste');

      const confirmButton = new MessageButton()
        .setLabel('Confirm')
        .setID(button.id)
        .setStyle('gray')
        .setDisabled(true);

      button.message.edit('Confirm', confirmButton);

      await button.reply.send(`Muito obrigado pela confirmação! Só aguardar!`);
    }
  },
};
