import { recaptcha } from '../../utils/verifications/humanVerify/recaptcha.js';

export default {
  name: 'guildMemberAdd',
  once: false,
  run: async (client, memberAdd) => {
    if (memberAdd.user.bot) return;

    await recaptcha(client, memberAdd);
  },
};
