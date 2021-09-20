import UserRepository from '../../../../services/database/Models/UserRepository';

export default {
  name: 'sort',
  description: '',
  event: 'campeonato',
  permissions: ['staff'],
  category: 'Championship 🏅',
  run: async ({ message }) => {
    const userRepository = new UserRepository();
    const length = await userRepository.getLength();
    for (let index = 0; index < length; index += 4) {
      const result = await userRepository.getRandomGroup(length);
      if (result.length !== 0) {
        const crewText = result
          .map(
            (item) =>
              `* ${item.name} - ${item.username}: messageId: ${item.messageId}`
          )
          .join('');
        message.channel.send(`Aqui está a equipe:
        ${crewText}`);
      }
    }
  },
};
