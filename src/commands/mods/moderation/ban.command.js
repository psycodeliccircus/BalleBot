import Discord from 'discord.js';
import { prefix } from '../../../assets/prefix.js';
import { getUserOfCommand } from '../../../utils/getUserMention/getUserOfCommand.js';
import { confirmMessage } from './confirmMessage.js';

export default {
  name: 'ban',
  description: `${prefix}ban <userId> ou ${prefix}ban @usuário ou ${prefix}warn <userTag> `,
  permissions: ['mods'],
  aliases: ['banir'],
  category: 'Moderação ⚔️',
  run: async ({ message, client, args }) => {
    const { user, index } = getUserOfCommand(client, message);
    if (!user) {
      message.channel.send(
        message.author,
        new Discord.MessageEmbed()
          .setColor('#ff8997')
          .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
          .setTitle(`Não encontrei o usuário!`)
          .setDescription(
            `**Tente usar**\`\`\`${prefix}ban @usuário <motivo>\`\`\``
          )
          .setTimestamp()
      );
      return;
    }
    let reason = '<Motivo não especificado>';

    if (args[1]) {
      reason = message.content.slice(index, message.content.length);
    }
    await message.delete();

    const messageAnt = await message.channel.send(
      new Discord.MessageEmbed()
        .setColor('#FF0000')
        .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
        .setTitle(`Você está preste a Banir ${user.tag}`)
        .setDescription(
          `**Pelo Motivo de : **\n\n\`\`\`${reason}\`\`\` \nPara confirmar clique em ✅\n para cancelar clique em ❎`
        )
        .setFooter(`Id do user: ${user.id}`)
        .setTimestamp()
    );

    if (await confirmMessage(message, messageAnt)) {
      await messageAnt.delete();
      await message.guild.members
        .ban(user, {
          reason: `Punido por ${message.author.tag} — Motivo: ${reason}`,
        })
        .then(() => {
          const guildIdDatabase = new client.Database.table(
            `guild_id_${message.guild.id}`
          );

          const channelLog = client.channels.cache.get(
            guildIdDatabase.get('channel_log')
          );

          if (channelLog) {
            channelLog.send(
              message.author,
              new Discord.MessageEmbed()
                .setColor('#ff8997')
                .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
                .setTitle(`O usuário ${user.tag} foi banido!`)
                .setDescription(`**Motivo: **\n\n\`\`\`${reason}\`\`\``)
                .setFooter(`Id do user: ${user.id}`)
                .setTimestamp()
            );
          } else {
            message.channel
              .send(
                message.author,
                new Discord.MessageEmbed()
                  .setColor('#ff8997')
                  .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
                  .setTitle(`O usuário ${user.tag} foi banido!`)
                  .setDescription(`**Motivo: **\n\n\`\`\`${reason}\`\`\``)
                  .setFooter(`Id do user: ${user.id}`)
                  .setTimestamp()
              )
              .then((msg) => msg.delete({ timeout: 15000 }));
          }

          user
            .send(
              new Discord.MessageEmbed()
                .setColor('#ff8997')
                .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
                .setTitle(`Você foi banido do servidor ${message.guild.name}`)
                .setDescription(
                  `**Motivo: **\n\`\`\`${reason}\`\`\`\n**Aplicada por: ${message.author.tag}**`
                )
                .setFooter(`Id do user: ${user.id}`)
                .setTimestamp()
            )
            .catch(() =>
              message.channel
                .send(
                  message.author,
                  new Discord.MessageEmbed()
                    .setColor('#ff8997')
                    .setThumbnail(
                      client.user.displayAvatarURL({ dynamic: true })
                    )
                    .setDescription(
                      `O usuário ${user.tag} possui a DM fechada, por isso não pude avisá-lo`
                    )
                    .setTitle(
                      `Não foi possível avisar na DM do usuário banido!`
                    )
                    .setTimestamp()
                )
                .then((msg) => msg.delete({ timeout: 15000 }))
            );
        })
        .catch(() =>
          message.channel
            .send(
              message.author,
              new Discord.MessageEmbed()
                .setColor('#ff8997')
                .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
                .setTitle(`Eu não tenho permissão para banir o usuário`)
                .setDescription(
                  `O usuário ${user.tag} está acima de mim, eleve meu cargo acima do dele`
                )
                .setTimestamp()
            )
            .then((msg) => msg.delete({ timeout: 15000 }))
        );
    } else {
      await messageAnt.delete();
    }
  },
};
