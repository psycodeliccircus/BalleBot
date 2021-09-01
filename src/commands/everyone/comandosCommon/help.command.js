import Discord from 'discord.js';
import { prefix } from '../../../assets/prefix.js';

function getMessageCommands(listTempleteCategories, namesCategories) {
  return listTempleteCategories.reduce((prev, arr, index) => {
    return `${prev}**${listTempleteCategories[index]}** \n ${namesCategories[
      listTempleteCategories[index]
    ].namesCommands.join(' | ')}\n\n`;
  }, '');
}

export default {
  name: 'help',
  description: `${prefix}help <comando> `,
  permissions: ['everyone'],
  aliases: ['help2', 'help3'],
  category: 'Utility ⛏️',
  run: ({ message, client, args }) => {
    const commandsDatabase = new client.Database.table('commandsDatabase');

    const helpCommand = args[0]?.replace(prefix, '');

    const fullCommand = commandsDatabase.get(`${helpCommand}`);

    const markedAliases = [];
    const markedPermissions = [];

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
      message.channel.send(
        message.author,
        new Discord.MessageEmbed()
          .setColor('#ff8997')
          .setAuthor(
            'Balle Bot',
            client.user.displayAvatarURL({ dynamic: true }),
            'https://discord.gg/ballerini'
          )
          .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
          .setTitle(`Ajuda Sobre Comandos e Funções:`)
          .setDescription(
            `**Essas são as categorias e comandos que podem ser usados: **\n\n${getMessageCommands(
              listTempleteCategories,
              namesCategories
            )}`
          )
          .setFooter(
            `• Para saber as informações de um comando específico, use ${prefix}help <comando>`
          )
      );
      return;
    }

    for (let i = 0; i < fullCommand.aliases.length; i++) {
      markedAliases[i] = `\`${prefix + fullCommand.aliases[i]}\``;
    }
    for (let i = 0; i < fullCommand.permissions.length; i++) {
      markedPermissions[i] = `\`${fullCommand.permissions[i]}\``;
    }

    if (markedAliases.length === 0)
      markedAliases[0] = '`Este comando não possui sinônimos`';
    const { category, description } = fullCommand;
    message.channel.send(
      message.author,
      new Discord.MessageEmbed()
        .setColor('#ff8997')
        .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
        .setTitle(`Informações sobre o comando \`${prefix}${helpCommand}\`:`)
        .setDescription(
          `**• Categoria: ${category || 'Sem Categoria'}**
          \n**• Como usar:**\n \`${description}\` \n**• Cargos necessários para usá-lo: **\n${markedPermissions.join(
            ' | '
          )}\n**• Sinônimos: **\n${markedAliases.join(' | ')}`
        )
    );
  },
};
