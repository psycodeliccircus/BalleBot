import GroupRepository from "../../services/database/Models/GroupRepository.js";
import { getRepoInfoTemplate } from "../../services/embedTemplates/championship.templates.js";
import { GithubRequests } from "../../services/githubRequests.js";

export default {
  name: 'repos',
  description: 'Vai verificar o estado de todos os repositórios',
  permissions: [],
  run: async ({ message }) => {
    const githubRequests = new GithubRequests();
    const groupsRepository = new GroupRepository();
    const groups = await groupsRepository.listAll();
    await message.channel.send(`${groups.length} equipes cadastradas`)
    for (const group of groups) {
      try {
        const { collaborators } = await githubRequests.getCollaborators(group.repo);
        const { commits } = await githubRequests.getCommits(group.repo)
        await message.channel.send({ embed: getRepoInfoTemplate({ group, collaborators, commits }) })
      } catch (error) {
        console.log(error)
        await message.channel.send(`Ocorreu um erro para buscar os dados da equipe ${group.name}`)
      }
    }
  }
}
