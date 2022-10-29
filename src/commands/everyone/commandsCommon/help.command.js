import { dirname } from 'path';
import { fileURLToPath } from 'url';
import Colors from '../../../utils/commandsFunctions/layoutEmbed/colors.js';
import Icons from '../../../utils/commandsFunctions/layoutEmbed/iconsMessage.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
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
  dm: true,
  run: ({ message, client, args, prefix }) => {
    if (
      message.channel.type !== 'DM' &&
      message.channel.id === '969676874634641449'
    ) {
      return message.channel.send(
        'Esse comando só funciona na DM/privado >:D corra, vá para lá antes dos outros!'
      );
    }
    if (message.channel.type !== 'DM') return;
    message.channel.send({
      ephemeral: true,
      content: 'Qual o nome?',
      files: [
        {
          attachment: `${__dirname}/necessarioemaisumavezpedirajudamasagoranaoparaomonstromassimparaolugarquedetemmaisconhecimentodoplaneta.jpg`,
        },
      ],
    });
  },
};
