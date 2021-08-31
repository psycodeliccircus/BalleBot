import UserRepository from '../../services/database/Models/UserRepository.js'

export default {
  name: 'sort',
  description: '',
  permissions: [],
  run: async ({ message }) => {
    const userRepository = new UserRepository();
    const length = await userRepository.getLength();
    for (let index = 0; index < length; index += 4) {
      const result = await userRepository.getRandomGroup(length);
      if (result.length !== 0)
        message.channel.send(`Aqui está a equipe:
${result.map(item => `* ${item.name} - ${item.username}: messageId: ${item.messageId}
`).join('')}`)
    }
  }
}
