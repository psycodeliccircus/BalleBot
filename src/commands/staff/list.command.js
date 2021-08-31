import GroupRepository from "../../services/database/Models/GroupRepository.js";

export default {
  name: 'list',
  description: 'Vai listar todas as equipes cadastradas no banco de dados, com o mesmo botão para criar o repositório',
  permissions: [],
  run: async ({ message }) => {
    try {
      const repository = new GroupRepository();
      const groupList = await repository.listAll();
      for (const group of groupList) {
        const embed = loadTemplate(group)
        await message.send({ embed })
      }
      await message.send(`${groupList.length} equipes registradas!`)
    } catch (error) {
      console.log(error)
      await message.send('Ocorreu um erro');
    }
  }
}
