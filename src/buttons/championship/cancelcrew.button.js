import { MessageButton } from 'discord-buttons';
import GroupRepository from '../../services/database/Models/GroupRepository.js'

export default {
  name: 'CancelCrew',
  description: '',
  permissions: [],
  run: async ({ button }) => {
    if (button.id.endsWith(button.clicker.user.id)) {
      const groupRepository = new GroupRepository()

      await groupRepository.deleteOne(button.clicker.user.id);
      await button.reply.defer();

      const confirmButton = new MessageButton()
        .setLabel("Cancel")
        .setID(button.id)
        .setStyle("gray")
        .setDisabled(true);

      await button.message.edit("Ok, registro cancelado!", confirmButton);
    }
  },
};
