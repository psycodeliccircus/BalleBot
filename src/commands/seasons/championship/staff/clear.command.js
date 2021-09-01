import UserRepository from '../../../../services/database/Models/UserRepository.js'

export default {
  name: 'clear',
  description: '',
  event: 'campeonato',
  category: 'Championship 🏅',
  permissions: ['staff'],
  run: async () => {
    const userRepository = new UserRepository();
    await userRepository.clear();
  }
}
