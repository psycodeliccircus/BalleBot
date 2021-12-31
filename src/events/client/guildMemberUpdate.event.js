import { removeMuteRole } from '../../services/muteVerify/removeMuteRole.js';

export default {
  name: 'guildMemberUpdate',
  once: false,
  run: async (client, oldMember, newMember) => {
    await removeMuteRole(client, oldMember, newMember);
  },
};
