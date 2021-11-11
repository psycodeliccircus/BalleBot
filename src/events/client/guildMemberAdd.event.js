import { checkIfItIsMutated } from '../../services/muteVerify/checkIfItIsMutated.js';

export default {
  name: 'guildMemberAdd',
  once: false,
  run: async (client, memberAdd) => {
    await checkIfItIsMutated(client, memberAdd);
  },
};
