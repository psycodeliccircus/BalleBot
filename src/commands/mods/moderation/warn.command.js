import Discord from 'discord.js';

import { prefix } from '../../../assets/prefix.js';
import { getUserOfCommand } from '../../../utils/getUserMention/getUserOfCommand.js';
import { confirmMessage } from './confirmMessage.js';

export default {
  name: 'warn',
  description: `${prefix}warn <userId> <motivo> ou ${prefix}warn @usuário <motivo> ou ${prefix}warn <userTag> <motivo>`,
  permissions: ['mods'],
  aliases: ['addwarn', 'advertencia', 'avisar'],
  category: 'Moderação ⚔️',
  run: async ({ message, client, args }) => {
    if (!args[0]) {
      return;
    }
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

    const messageAnt = await message.channel.send(
      new Discord.MessageEmbed()
        .setColor('#ff8997')
        .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
        .setAuthor(`${user.tag}`, user.displayAvatarURL({ dynamic: true }))
        .setTitle(`Você está preste a avisar o Usuário`)
        .setDescription(
          `**Pelo Motivo de : **\n\n\`\`\`${reason}\`\`\` \nPara confirmar clique em ✅\n para cancelar clique em ❎`
        )
        .setFooter(`Id do user: ${user.id}`)
        .setTimestamp()
    );

    function messageInviteLog() {
      return new Discord.MessageEmbed()
        .setColor('#ff8997')
        .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
        .setTitle(`O usuário ${user.tag} foi avisado!`)
        .addFields(
          {
            name: '**Motivo: **',
            value: `\n\n\`\`\`${reason}\`\`\``,
          },
          {
            name: '**Aplicadado por:**',
            value: `${message.author.tag} - ${message.author.id}`,
          }
        )
        .setFooter(`Id do user avisado: ${user.id}`)
        .setTimestamp();
    }

    if (await confirmMessage(message, messageAnt)) {
      messageAnt.delete();

      const memberUser = client.guilds.cache
        .get(message.guild.id)
        .members.cache.get(user.id);

      if (
        memberUser.roles.highest.position >=
        message.guild.me.roles.highest.position
      ) {
        message.channel
          .send(
            message.author,
            new Discord.MessageEmbed()
              .setColor('#ff8997')
              .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
              .setTitle(`Eu não tenho permissão para avisar o usuário`)
              .setDescription(
                `O usuário ${user.tag} está acima de mim, eleve meu cargo acima do dele`
              )
              .setTimestamp()
          )
          .then((msg) => msg.delete({ timeout: 15000 }));
      } else if (
        memberUser.roles.highest.position >=
        message.member.roles.highest.position
      ) {
        message.channel
          .send(
            message.author,
            new Discord.MessageEmbed()
              .setColor('#ff8997')
              .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
              .setTitle(`Você não tem permissão para avisar o usuário`)
              .setDescription(
                `O usuário ${user.tag} está acima de você, por isso não podes adicionar um aviso a ele`
              )
              .setTimestamp()
          )
          .then((msg) => msg.delete({ timeout: 15000 }));
      } else {
        const guildIdDatabase = new client.Database.table(
          `guild_id_${message.guild.id}`
        );

        const channelLog = client.channels.cache.get(
          guildIdDatabase.get('channel_log')
        );

        if (channelLog) {
          channelLog.send(message.author, messageInviteLog());
        } else {
          message.channel.send(
            message.author,
            messageInviteLog().then((msg) => msg.delete({ timeout: 15000 }))
          );
        }

        if (guildIdDatabase.has(`user_id_${user.id}`)) {
          guildIdDatabase.set(`user_id_${user.id}.name`, user.username);
          guildIdDatabase.set(
            `user_id_${user.id}.discriminator`,
            user.discriminator
          );

          guildIdDatabase.add(`user_id_${user.id}.warnsCount`, 1);
          guildIdDatabase.push(`user_id_${user.id}.reasons`, reason);
          guildIdDatabase.push(
            `user_id_${user.id}.dataReasonsWarns`,
            new Date()
          );
        } else {
          guildIdDatabase.set(`user_id_${user.id}`, {
            name: user.username,
            discriminator: user.discriminator,
            id: user.id,
            warnsCount: 1,
            reasons: [reason],
            dataReasonsWarns: [new Date()],
          });
        }

        user.send(
          new Discord.MessageEmbed()
            .setColor('#ff8997')
            .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
            .setTitle(
              `Você recebeu um warn do servidor **${message.guild.name}**`
            )
            .setDescription(
              `**Motivo: **\n\`\`\`${reason}\`\`\`\n**Aplicada por: ${message.author.tag}**`
            )
            .setFooter(`Id do user: ${user.id}`)
            .setTimestamp()
        );
      }
    } else {
      await messageAnt.delete();
    }
  },
};
