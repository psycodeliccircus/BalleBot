import Discord from 'discord.js';
import Colors from '../../utils/layoutEmbed/colors.js';

export async function verifyDiscordNitro(client, message) {
  const contentMessage = message.content;
  const regex = [/discord/gi, /free/gi, /nitro/gi, /http(s?):\/\//gi];
  const linkTrue = /http(s?):\/\/discord\.gift\//gi;
  let scam = true;

  regex.forEach((reg) => {
    if (!reg.test(contentMessage)) {
      scam = false;
    }
  });
  if (linkTrue.test(contentMessage)) {
    scam = false;
  }

  if (scam) {
    const guildIdDatabase = new client.Database.table(
      `guild_id_${message.guild.id}`
    );
    const channelLog = client.channels.cache.get(
      guildIdDatabase.get('channel_log')
    );
    if (!message.guild.me.hasPermission('BAN_MEMBERS')) {
      if (channelLog) {
        channelLog.send(
          message.author,
          new Discord.MessageEmbed()
            .setColor(Colors.pink_red)
            .setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
            .setAuthor(
              message.author.tag,
              message.author.displayAvatarURL({ dynamic: true })
            )
            .setTitle(
              `**Usuário ${message.author.tag} mandou uma suspeita de Scam de discord nitro em um canal!**`
            )
            .setDescription(
              `**O usuário enviou a seguinte mensagem no canal ${message.channel}:
${message.content}
\n**Eu não tenho permissão de banir o usuário, verifique antes que seja tarde e me dê permissão!`
            )
            .setFooter(`ID do usuário: ${message.author.id}`)
            .setTimestamp()
        );
      }
      return;
    }

    const reason = `Scam de Discord Nitro Free falso:
    ${message.content}
      `;
    await message.guild.members
      .ban(message.author, {
        reason: `Punido por ${client.user.tag} | ${client.user.id}
       — Data: ${message.createdAt.toISOString()} — Motivo: ${reason}`,
      })
      .then(() => {
        message.delete();
        if (channelLog) {
          channelLog.send(
            message.author,
            new Discord.MessageEmbed()
              .setColor(Colors.pink_red)
              .setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
              .setAuthor(
                message.author.tag,
                message.author.displayAvatarURL({ dynamic: true })
              )
              .setTitle(
                `**Usuário ${message.author.tag} Banido por enviar um Scam de Discord Nitro!**`
              )
              .setDescription(
                `**O usuário enviou a seguinte mensagem em ${message.channel}:**
${message.content}`
              )
              .setFooter(`ID do usuário: ${message.author.id}`)
              .setTimestamp()
          );
        }
        message.author
          .send(
            new Discord.MessageEmbed()
              .setColor(Colors.red)
              .setThumbnail(message.guild.iconURL())
              .setTitle(
                `Você foi banido no servidor ** ${message.guild.name}** `
              )
              .setDescription(
                `**Banido por enviar Scam de Discord Nitro Free! Aqui está a mensagem:**
${message.content}
\n**Fale com a administração do servidor para ser desbanido caso ache injusto**`
              )
              .setFooter(`ID do usuário: ${message.author.id}`)
              .setTimestamp()
          )
          .catch(() => {
            if (channelLog) {
              channelLog.send(
                message.author,
                new Discord.MessageEmbed()
                  .setColor(Colors.pink_red)
                  .setThumbnail(
                    message.author.displayAvatarURL({ dynamic: true })
                  )
                  .setAuthor(
                    message.author.tag,
                    message.author.displayAvatarURL({ dynamic: true })
                  )
                  .setTitle(
                    `Não foi possível avisar na DM do usuário banido ${message.author.tag}!`
                  )
                  .setFooter(`ID do usuário: ${message.author.id}`)
                  .setTimestamp()
              );
            }
          });
      });
    return true;
  }
  return false;
}
