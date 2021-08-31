import UserRepository from '../../services/database/Models/UserRepository.js'

export default {
  name: 'clear',
  description: '',
  permissions: [],
  run: async () => {
    const userRepository = new UserRepository();
    await userRepository.clear();
  }
}
