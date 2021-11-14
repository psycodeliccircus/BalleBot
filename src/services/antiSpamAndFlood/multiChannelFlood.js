import Discord from 'discord.js';
import Colors from '../../utils/layoutEmbed/colors.js';

export async function multiChannelFlood(client, message, it, maxMessageRep) {
  const idUser = message.author.id;

  if (it[idUser]) {
    const guildIdDatabase = new client.Database.table(
      `guild_id_${message.guild.id}`
    );
    const channelLog = client.channels.cache.get(
      guildIdDatabase.get('channel_log')
    );
    let i = 0;
    await it[idUser].idMessageRaid.forEach(async (messageDelete) => {
      client.channels.cache
        .get(it[idUser].idChannelRaid[i])
        .messages.fetch(messageDelete)
        .then((mesg) => mesg.delete());
      i++;
    });
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
              `**Usuário ${message.author.tag} mandou uma suspeita de Scam por enviar um Flood/Scam em VÁRIOS canais!**`
            )
            .setDescription(
              `**O usuário enviou a seguinte mensagem ${maxMessageRep} vezes em <#${it[idUser].lastChannel}>:**
  ${it[idUser].content}
  **Eu não tenho permissão de banir o usuário, verifique antes que seja tarde e me dê permissão!`
            )
            .setFooter(`ID do usuário: ${message.author.id}`)
            .setTimestamp()
        );
      }
      return;
    }

    const reason = `Flood em Canais, supeita de Scam pela mensagem:
    ${message.content}
      `;
    await message.guild.members
      .ban(message.author, {
        reason: `Punido por ${client.user.tag} | ${client.user.id}
       — Data: ${message.createdAt.toISOString()} — Motivo: ${reason}`,
      })
      .then(() => {
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
                `**Usuário ${message.author.tag} Banido por enviar um Flood/Scam em VÁRIOS canais!**`
              )
              .setDescription(
                `**O usuário enviou a seguinte mensagem ${maxMessageRep} vezes em ${maxMessageRep} chats:**
${it[idUser].content}`
              )
              .addFields({
                name: 'Enviada nos canais respectivos:',
                value: `${it[idUser].idChannelRaid.join(' **|** ')}`,
              })
              .setFooter(`ID do usuário: ${message.author.id}`)
              .setTimestamp()
          );
        }
        const listChannelsName = it[idUser].idChannelRaid.map(
          (channelId) => client.channels.cache.get(channelId).name
        );
        message.author
          .send(
            new Discord.MessageEmbed()
              .setColor(Colors.red)
              .setThumbnail(message.guild.iconURL())
              .setTitle(
                `Você foi banido no servidor ** ${message.guild.name}** `
              )
              .setDescription(
                `**Motivo:**
**Banido por enviar um Flood/Scam em VÁRIOS canais!**
${it[idUser].content}
\n**Fale com a administração do servidor para ser desbanido caso ache injusto**`
              )
              .addFields({
                name: 'Enviada nos canais respectivos:',
                value: `${listChannelsName.join(' **|** ')}`,
              })
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
  }
}
