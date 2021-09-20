import JuryRepository from '../../../../services/database/Models/JuryRepository.js';
import { registeredGithubUser } from '../../../../services/embedTemplates/championship.templates.js';
import { githubRequests } from '../../../../services/githubRequests.js';

export default {
  name: 'registerjury',
  description:
    'Vai registrar um jurado ao campeonado, deve passar o username no github dele como primeiro parâmetro, depois o nome',
  event: 'campeonato',
  category: 'Championship 🏅',
  permissions: ['staff'],
  run: async ({ message }) => {
    const [, githubUsername, ...name] = message.content.substr(1).split(' ');
    const juryRepository = new JuryRepository();
    const { login } = await githubRequests.findUser(githubUsername);
    await juryRepository.insertOne({
      name: name.join(' '),
      github: login,
      avatar_url: `https://github.com/${login}.png`,
    });
    const embed = registeredGithubUser({
      avatar_url: `https://github.com/${login}.png`,
      github: login,
      name: name.join(' '),
    });
    await message.channel.send({ embed });
  },
};
