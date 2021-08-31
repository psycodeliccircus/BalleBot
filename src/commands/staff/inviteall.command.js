import JuryRepository from "../../services/database/Models/JuryRepository.js";
import GroupRepository from "../../services/database/Models/GroupRepository.js";
import { GithubRequests } from "../../services/githubRequests.js";

export default {
  name: 'inviteall',
  description: 'Vai convidar todos os jurados para os repositórios.',
  permissions: [],
  run: async ({ message }) => {
    const juryRepository = new JuryRepository();
    const githubRequests = new GithubRequests();
    const groupRepository = new GroupRepository();
    const jurys = await juryRepository.listAll();
    const groups = await groupRepository.listAcceptedGroups();
    for (const jury of jurys) {
      for (const group of groups) {
        await githubRequests.inviteToRepo(group.name, jury.github);
      }
      const embed = invitedJuryToRepo(groups, jury)
      await message.send({ embed })
    }
  }
}
