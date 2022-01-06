import { autoRolesInteraction } from '../../utils/eventsFunctions/autoRoles/autoRolesInteraction.js';

export default {
  name: 'interactionCreate',
  once: false,
  run: async (client, interaction) => {
    autoRolesInteraction(interaction);
  },
};
