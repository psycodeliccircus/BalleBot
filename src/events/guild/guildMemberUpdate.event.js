import { removeMuteRole } from '../../utils/verifications/muteVerify/removeMuteRole.js';

export default {
  name: 'guildMemberUpdate',
  once: false,
  run: async (client, oldMember, newMember) => {
    await removeMuteRole(client, oldMember, newMember);
  },
};
