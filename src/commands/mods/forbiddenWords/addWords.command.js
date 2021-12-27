import { helpWithASpecificCommand } from '../../everyone/comandosCommon/help.command.js';
import Colors from '../../../utils/layoutEmbed/colors.js';
import Icons from '../../../utils/layoutEmbed/iconsMessage.js';

export default {
  name: 'addwords',
  description: `<prefix>words para ver mensagens proibidas no servidor`,
  permissions: ['mods'],
  aliases: ['setwords'],
  category: 'AntiSpam ⚠️',
  run: ({ message, client, args, prefix }) => {
    if (!args[0]) {
      const [command] = message.content.slice(prefix.length).split(/ +/);
      helpWithASpecificCommand(command, client, message);
      return;
    }
    const guildIdDatabase = new client.Database.table(
      `guild_id_${message.guild.id}`
    );

    if (!guildIdDatabase.has('channel_log')) {
      message.channel.send({
        content: `${message.author}`,
        embeds: [
          {
            color: Colors.pink_red,
            thumbnail: Icons.chat,
            title: `O seu servidor não possui um chat log para usar esse recurso!`,
            description: `> Use **${prefix}addlog <#chat/ID>** para adicionar o canal de **configurações**!`,
            footer: {
              text: `${message.author.tag}`,
              icon_url: `${message.author.displayAvatarURL({ dynamic: true })}`,
            },
            timestamp: new Date(),
          },
        ],
      });
      return;
    }

    const setRegexList = [];
    let position = 0;

    for (let i = 0; i < args.length; i++) {
      setRegexList.push(args[i].toLowerCase());
    }

    function messageSucess() {
      message.channel.send({
        content: `${message.author}`,
        embeds: [
          {
            color: Colors.pink_red,
            thumbnail: Icons.sucess,
            title: `As Palavras ou Links foram **adicionados** ao banco!`,
            description: `**Essas foram as palavras ou links adicionados:** \n> \`${args.join(
              ' | '
            )}\``,
            footer: {
              text: `${message.author.tag}`,
              icon_url: `${message.author.displayAvatarURL({ dynamic: true })}`,
            },
            timestamp: new Date(),
          },
        ],
      });
    }
    if (guildIdDatabase.has('listOfWordsBanned')) {
      const listRegexInDatabase = guildIdDatabase.get('listOfWordsBanned');

      for (let i = 0; i < setRegexList.length; i++) {
        for (let j = 0; j < listRegexInDatabase.length; j++) {
          if (setRegexList[i] === listRegexInDatabase[j]) {
            setRegexList.splice(i, 1);
          }
        }
      }

      for (let j = 0; j < listRegexInDatabase.length; j++) {
        if (listRegexInDatabase[j] === null) {
          if (setRegexList[position]) {
            guildIdDatabase.set(
              `listOfWordsBanned.${j}`,
              setRegexList[position]
            );
            position++;
          }
        }
      }

      for (let i = position; i < setRegexList.length - position; i++) {
        guildIdDatabase.push('listOfWordsBanned', setRegexList[i]);
      }
      messageSucess();
    } else {
      guildIdDatabase.set('listOfWordsBanned', setRegexList);
      messageSucess();
    }
  },
};
