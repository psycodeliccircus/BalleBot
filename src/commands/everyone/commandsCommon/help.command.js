import Colors from '../../../utils/commandsFunctions/layoutEmbed/colors.js';
import Icons from '../../../utils/commandsFunctions/layoutEmbed/iconsMessage.js';

function getMessageCommands(listTempleteCategories, namesCategories) {
  return listTempleteCategories.reduce((prev, _arr, index) => {
    return `${prev}**${listTempleteCategories[index]}**
> ${namesCategories[listTempleteCategories[index]].namesCommands.join(
      ' **|** '
    )}\n\n`;
  }, '');
}

export function helpWithASpecificCommand(nameCommand, client, message) {
  const fullCommand = client.Commands.get(nameCommand.toLowerCase());
  const stringMarkedAliases = [];
  const stringMarkedPermissions = [];
  const nullAlias = '`<Este comando não possui sinônimos>`';

  fullCommand.aliases?.forEach((_alias, i) => {
    stringMarkedAliases[i] = `\`${fullCommand.aliases[i]}\``;
  });
  fullCommand.permissions?.forEach((_perm, i) => {
    stringMarkedPermissions[i] = `\`${fullCommand.permissions[i]}\``;
  });
  const { category, description } = fullCommand;
  message.channel.send({
    content: `${message.author}`,
    embeds: [
      {
        color: Colors.pink_red,
        thumbnail: Icons.interrogation,
        title: `Informações sobre o comando \`${fullCommand.name}\`:`,
        description: `**📝 Categoria: ${category || 'Sem Categoria'}**
\n**Sobre o Comando:**
> \`\`${description || `<Sem Descrição>`}\`\`
**Cargos necessários para utilizar o comando: **
> ${stringMarkedPermissions.join(' | ') || '`<Não especificado>`'}
**Sinônimos: **
> ${stringMarkedAliases.join(' **|** ') || nullAlias}`,
      },
    ],
  });
}

export default {
  name: 'help',
  description: `<prefix>help <comando> `,
  permissions: ['everyone'],
  aliases: ['ajuda', 'h'],
  category: 'Utility ⛏️',
  run: ({ message, client, args, prefix }) => {
    const commandsDatabase = new client.Database.table('commandsDatabase');

    const helpCommand = args[0]?.replace(prefix, '').toLowerCase();

    const fullCommand = commandsDatabase.get(`${helpCommand}`);

    if (!fullCommand) {
      const getNamesCommands = [];
      const allCommands = commandsDatabase.all();
      const namesCategories = {};

      for (let i = 0; i < allCommands.length; i++) {
        const commandAmongAll = JSON.parse(allCommands[i].data);

        const categoryCommand = commandAmongAll.category;

        if (namesCategories[categoryCommand]) {
          namesCategories[categoryCommand].namesCommands.push(
            `\`${prefix + commandAmongAll.name}\``
          );
        } else if (categoryCommand === undefined) {
          if (namesCategories['Sem categoria ❔']) {
            namesCategories['Sem categoria ❔'].namesCommands.push(
              `\`${prefix + commandAmongAll.name}\``
            );
          } else {
            namesCategories['Sem categoria ❔'] = {
              namesCommands: [`\`${prefix + commandAmongAll.name}\``],
            };
          }
        } else {
          namesCategories[categoryCommand] = {
            namesCommands: [`\`${prefix + commandAmongAll.name}\``],
          };
        }
      }
      const listTempleteCategories =
        Object.getOwnPropertyNames(namesCategories).sort();

      getNamesCommands.sort();

      const descriptInviteInMessage = `
Hey ${message.author}, muito prazer!
Eu sou a Bot do servidor Ballerini (pode me chamar de Balle).
Fui criada para várias funções dentro de um servidor,\n
Entre elas: Moderação, Cargos, AntiSpam, Forbidden Words, Welcome, Eventos Especiais, Diversão, Economia, e muito mais!\n
Meus criadores me criaram para ser um bot completo com praticamente tudo que é necessário para um servidor e um pouquinho a mais,
trazendo segurança e diversão para o seu servidor!\n
Caso queira suporte com nossos desenvolvedores entre em contato com a equipe responsável no servidor Ballerini:\n
> **Ballerini:** https://discord.gg/ballerini \n
**Essas são as categorias e comandos que podem ser usados: **\n
${getMessageCommands(listTempleteCategories, namesCategories)}`;

      return message.channel.send({
        content: `${message.author}`,
        embeds: [
          {
            color: Colors.pink_red,
            author: {
              name: 'Balle Bot • Ballerini',
              icon_url: client.user.displayAvatarURL({ dynamic: true }),
              url: 'https://discord.gg/ballerini',
            },
            thumbnail: client.user.displayAvatarURL({ dynamic: true }),
            title: `Ajuda Sobre Comandos e Funções:`,
            description: descriptInviteInMessage,
            footer: `• Para saber as informações de um comando específico, use ${prefix}help <comando>`,
          },
        ],
      });
    }
    helpWithASpecificCommand(helpCommand, client, message);
  },
};
