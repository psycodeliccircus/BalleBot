import { checkIfItIsMutated } from '../../services/muteVerify/checkIfItIsMutated.js';
import { recaptcha } from '../../services/humanVerify/recaptcha.js';

export default {
  name: 'guildMemberAdd',
  once: false,
  run: async (client, memberAdd) => {
    await checkIfItIsMutated(client, memberAdd);
    await recaptcha(client, memberAdd);
  },
};
