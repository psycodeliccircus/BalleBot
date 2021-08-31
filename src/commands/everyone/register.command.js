import { MessageButton } from "discord-buttons";
import { loadTemplate } from "../../services/embedTemplates/championship.templates.js";
import GroupRepository from "../../services/database/Models/GroupRepository.js";

const fillGroupData = (acc, curr) => {
  const [key, value] = curr.split(':');
  const hasEquipe = key.toLowerCase().includes('equipe');
  const hasMembro = key.toLowerCase().includes('membro');
  const hasGithub = key.toLowerCase().includes('github');
  const hasDiscord = key.toLowerCase().includes('discord');
  const hasLider = key.toLowerCase().includes('lider')
  const isLeader = (hasLider && !(hasGithub || hasDiscord));

  acc.name = hasEquipe ? value.trim() : acc.name;
  acc.lider = isLeader ? value.trim() : acc.lider;
  acc.crew = hasMembro ? value.split('|').map(item => item.trim()) : acc.crew;
  acc.liderGH = hasGithub ? value.trim() : acc.liderGH;
  acc.liderDisc = hasDiscord ? value.trim() : acc.liderDisc;

  return acc;
}

export default {
  name: 'register',
  description: 'Vai registrar uma equipe',
  permissions: [],
  run: async ({ message, args }) => {
    const { id } = message.author;
    const content = args.join(' ');

    const groupRepository = new GroupRepository()
    const findedGroup = await groupRepository.findById(id);
    if (!findedGroup) {

      const confirmButton = new MessageButton()
        .setLabel("Confirmar")
        .setID(`confirmcrew${message.author.id}`)
        .setStyle("blurple");

      const cancelButton = new MessageButton()
        .setLabel("Cancelar")
        .setID(`cancelcrew${message.author.id}`)
        .setStyle("blurple");

      const objectModel = {
        id,
        lider: '',
        name: '',
        crew: [],
        liderGH: '',
        liderDisc: '',
      };

      const data = content.split('\n').reduce(fillGroupData, objectModel)
      data.crew = data.crew.filter(member => !member.includes(data.liderDisc));

      if (data.crew.length < 0 || data.crew.length > 3) {
        throw new Error('A equipe deve ter entre 2 a 4 membros');
      }

      await groupRepository.insertOne(data);

      const embed = loadTemplate(data);

      await message.channel.send("Equipe criada", { buttons: [confirmButton, cancelButton], embed });
      return;
    }
    await message.channel.send("Você já está em uma equipe, não pode participar de mais uma");
  }
}
/*
crew: ["Lawless#7439 - Alpha Vylly", "Matan#9968 - Mateus Andriola"],
name:"Grupo de teste",
lider:"",
liderDisc:"Matan#9968",
liderGH:"Matan18Cobaia",

A pessoa vai mandar um comando de register:
  - O primeiro argumento é o nome da equipe;
  - O membro pode citar os outros membros e os primeiros 3 membros serão adicionados como membros da equipe:
    - Posteriormente, será usado a pesquisa de usuários usada no correio elegante;
  - Será devolvido uma mensagem com os dados prévios da equipe, e será solicitado o github do lider:
    - Se a reação for positiva, será adicionado no banco os dados da equipe;
    - Se a reação for negativa, será testado novamente de alguma forma;
- Se o membro já estiver em uma equipe, o parâmetro que é o nome da equipe será adicionado no sistema como github do lider;
*/
