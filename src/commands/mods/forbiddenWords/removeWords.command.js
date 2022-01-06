import { helpWithASpecificCommand } from '../../everyone/commandsCommon/help.command.js';
import Colors from '../../../utils/commandsFunctions/layoutEmbed/colors.js';
import Icons from '../../../utils/commandsFunctions/layoutEmbed/iconsMessage.js';

function allNull(arrayT) {
  return !arrayT.some((elementT) => elementT !== null);
}

export default {
  name: 'removewords',
  description: `<prefix>removewords para remover palavras proibidas no servidor`,
  permissions: ['mods'],
  aliases: ['rmvwords', 'wordsremove', 'removerPalavras'],
  category: 'AntiSpam ⚠️',
  run: ({ message, client, args, prefix }) => {
    if (!args[0]) {
      const [command] = message.content.slice(prefix.length).split(/ +/);
      helpWithASpecificCommand(command, client, message);
      return;
    }

    const deleteRegexList = [];
    const guildIdDatabase = new client.Database.table(
      `guild_id_${message.guild.id}`
    );

    for (let i = 0; i < args.length; i++) {
      deleteRegexList.push(args[i].toLowerCase());
    }

    if (guildIdDatabase.has('listOfWordsBanned')) {
      const listRegexInDatabase = guildIdDatabase.get('listOfWordsBanned');
      if (!allNull(listRegexInDatabase)) {
        for (let i = 0; i < deleteRegexList.length; i++) {
          for (let j = 0; j < listRegexInDatabase.length; j++) {
            if (deleteRegexList[i] === listRegexInDatabase[j]) {
              guildIdDatabase.delete(`listOfWordsBanned.${j}`);
            }
          }
        }

        return message.channel.send({
          content: `${message.author}`,
          embeds: [
            {
              color: Colors.pink_red,
              thumbnail: Icons.subwords,
              title: `As Palavras ou Links foram **removidos** do banco! `,
              description: `**Essas foram as palavras ou links removidos:** \n> \`${deleteRegexList.join(
                ' | '
              )}\``,
              footer: {
                text: `${message.author.tag}`,
                icon_url: `${message.author.displayAvatarURL({
                  dynamic: true,
                })}`,
              },
            },
          ],
        });
      }
    }
    message.channel.send({
      content: `${message.author}`,
      embeds: [
        {
          color: Colors.pink_red,
          thumbnail: client.user.displayAvatarURL({ dynamic: true }),
          title: `O seu servidor **não possui** um banco para excluir palavras e links proibidos`,
          description: `**Para usar o comando:**\n> primeiro adicione palavras no banco com o comando:\n>\`${prefix}addwords <palavra1> <palavra2> <palavra3> etc \``,
          footer: {
            text: `${message.author.tag}`,
            icon_url: `${message.author.displayAvatarURL({ dynamic: true })}`,
          },
          timestamp: new Date(),
        },
      ],
    });
  },
};
