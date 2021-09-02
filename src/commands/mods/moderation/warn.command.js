import Discord from 'discord.js';
import { prefix } from '../../../assets/prefix.js';
import { getUserOfCommand } from '../../../utils/getUserMention/getUserOfCommand.js';
import { confirmWarn } from './confirmWarn.js';

export default {
  name: 'warn',
  description: `${prefix}warn <userId> <motivo> ou ${prefix}warn @usuário <motivo> ou ${prefix}warn <userTag> <motivo>`,
  permissions: ['mods'],
  aliases: ['addwarn'],
  category: 'Moderação ⚔️',
  run: ({ message, client, args }) => {
    const { user, index } = getUserOfCommand(client, message);

    if (!user) {
      message.channel.send(
        message.author,
        new Discord.MessageEmbed()
          .setColor('#ff8997')
          .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
          .setTitle(`Não encontrei o usuário!`)
          .setDescription(
            `**Tente usar**\`\`\`${prefix}warn @usuário <motivo>\`\`\``
          )
          .setTimestamp()
      );
      return;
    }
    let reason = '<Motivo não especificado>';

    if (args[1]) {
      reason = message.content.slice(index, message.content.length);
    }

    confirmWarn(message, client, user, reason);
  },
};
