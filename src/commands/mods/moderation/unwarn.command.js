import Discord from 'discord.js';
import { prefix } from '../../../assets/prefix.js';
import { getUserOfCommand } from '../../../utils/getUserMention/getUserOfCommand.js';

export default {
  name: 'unwarn',
  description: `${prefix}unwarn <idUser> <aviso1> ou ${prefix}unwarn @user <aviso1> ou ${prefix}unwarn <tagUser> <aviso1>`,
  permissions: ['mods'],
  aliases: ['removewarn'],
  category: 'Moderação ⚔️',
  run: ({ message, client, args }) => {
    const guildIdDatabase = new client.Database.table(
      `guild_id_${message.guild.id}`
    );

    const { user } = getUserOfCommand(client, message);

    if (!user) {
      message.channel.send(
        message.author,
        new Discord.MessageEmbed()
          .setColor('#ff8997')
          .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
          .setTitle(`Não encontrei o usuário!`)
          .setDescription(
            `**Tente usar**\`\`\`${prefix}unwarn @usuário <aviso 1 >\`\`\``
          )
          .setTimestamp()
      );
      return;
    }

    const warnRemove = isNaN(args[args.length - 1])
      ? args[args.length - 1]
      : Number(args[args.length - 1]) - 1;

    if (guildIdDatabase.has(`user_id_${user.id}`)) {
      if (!args[1]) {
        return message.channel.send(
          'selecione um aviso que existe: ex. aviso1 returnnn'
        );
      }

      if (isNaN(warnRemove)) {
        if (warnRemove.toLowerCase() === 'all') {
          guildIdDatabase.delete(`user_id_${user.id}.reasons`);
          guildIdDatabase.set(`user_id_${user.id}.warnsCount`, 0);
          guildIdDatabase.set(`user_id_${user.id}.reasons`, []);

          message.channel.send(
            message.author,
            new Discord.MessageEmbed()
              .setColor('#ff8997')
              .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
              .setTitle(
                `Todos os avisos foram removidos do usuário ${user.tag}`
              )
              .setDescription(`**O usuário não possui avisos**`)
              .setFooter(`Id do user: ${user.id}`)
              .setTimestamp()
          );
          return;
        }

        return message.channel.send(
          'selecione um aviso que existe: ex. aviso1'
        );
      }

      const reasons = guildIdDatabase.get(`user_id_${user.id}.reasons`);

      if (reasons.length !== 0) {
        if (warnRemove > reasons.length) {
          return message.channel.send(
            `este usuário não possui o aviso ${warnRemove + 1}`
          );
        }

        const avisoDeleted = reasons[warnRemove];
        reasons.splice(warnRemove, 1);

        guildIdDatabase.delete(`user_id_${user.id}.reasons`);
        guildIdDatabase.set(`user_id_${user.id}.reasons`, reasons);

        guildIdDatabase.subtract(`user_id_${user.id}.warnsCount`, 1);

        message.channel.send(
          message.author,
          new Discord.MessageEmbed()
            .setColor('#ff8997')
            .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
            .setTitle(
              `Aviso ${warnRemove + 1} foi removido do usuário ${user.tag}`
            )
            .setDescription(`**Aviso:**\n ${avisoDeleted}`)
            .setFooter(`Id do user: ${user.id}`)
            .setTimestamp()
        );
        return;
      }
      message.channel.send('este usuário não possui avisos');
      return;
    }
    message.channel.send('usuário não encontrado no banco');
  },
};
