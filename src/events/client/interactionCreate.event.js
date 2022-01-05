import { autoRolesInteraction } from '../../services/autoRoles/autoRolesInteraction.js';

export default {
  name: 'interactionCreate',
  once: false,
  run: async (client, interaction) => {
    autoRolesInteraction(client, interaction);
  },
};
