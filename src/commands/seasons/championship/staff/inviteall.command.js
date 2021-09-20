import JuryRepository from '../../../../services/database/Models/JuryRepository.js';
import GroupRepository from '../../../../services/database/Models/GroupRepository.js';
import { githubRequests } from '../../../../services/githubRequests.js';
import { invitedJuryToRepo } from '../../../../services/embedTemplates/championship.templates.js';

export default {
  name: 'inviteall',
  description: 'Vai convidar todos os jurados para os repositórios.',
  event: 'campeonato',
  category: 'Championship 🏅',
  permissions: ['staff'],
  run: async ({ message }) => {
    const juryRepository = new JuryRepository();
    const groupRepository = new GroupRepository();
    const jurys = await juryRepository.listAll();
    const groups = await groupRepository.listAcceptedGroups();
    for (const jury of jurys) {
      for (const group of groups) {
        await githubRequests.inviteToRepo(group.name, jury.github);
      }
      const embed = invitedJuryToRepo(groups, jury);
      await message.send({ embed });
    }
  },
};
