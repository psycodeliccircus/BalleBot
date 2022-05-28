import { checkIfItIsMutated } from '../../utils/verifications/muteVerify/checkIfItIsMutated.js';
import { recaptcha } from '../../utils/verifications/humanVerify/recaptcha.js';

export default {
  name: 'guildMemberAdd',
  once: false,
  run: async (client, memberAdd) => {
    if (memberAdd.user.bot) return;
    await checkIfItIsMutated(client, memberAdd);
    await recaptcha(client, memberAdd);
  },
};
