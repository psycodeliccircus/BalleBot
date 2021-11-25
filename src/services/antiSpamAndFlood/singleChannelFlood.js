import Discord from 'discord.js';
import { muteUserInDatabase } from '../../utils/createRoleMuted/roleMutedUserInDatabase.js';
import Colors from '../../utils/layoutEmbed/colors.js';

export async function singleChannelFlood(client, message, it, maxMessageRep) {
  const idUser = message.author.id;
  const reason = `Flood em Canais, supeita de spam pela mensagem:
${message.content}
  `;
  const { inviteMessageDate } = await muteUserInDatabase(
    client,
    message,
    reason,
    message.author
  );

  if (it[idUser]) {
    it[idUser].idFlood.forEach(async (messageDelete) => {
      client.channels.cache
        .get(it[idUser].lastChannel)
        .messages.fetch(messageDelete)
        .then((mesg) => mesg.delete());
    });

    const guildIdDatabase = new client.Database.table(
      `guild_id_${message.guild.id}`
    );
    const channelLog = client.channels.cache.get(
      guildIdDatabase.get('channel_log')
    );

    channelLog?.send(
      message.author,
      new Discord.MessageEmbed()
        .setColor(Colors.pink_red)
        .setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
        .setAuthor(
          message.author.tag,
          message.author.displayAvatarURL({ dynamic: true })
        )
        .setTitle(
          `**Usuário ${message.author.tag} mutado por enviar um flood em UM canal!**`
        )
        .setDescription(
          `**O usuário enviou a seguinte mensagem ${maxMessageRep} vezes em <#${it[idUser].lastChannel}>:**
${it[idUser].content}
**Data final do Mute: ${inviteMessageDate}**`
        )
        .setFooter(`ID do usuário: ${message.author.id}`)
        .setTimestamp()
    );

    message.author
      .send(
        new Discord.MessageEmbed()
          .setColor(Colors.red)
          .setThumbnail(message.guild.iconURL())
          .setTitle(`Você foi mutado no servidor ** ${message.guild.name}** `)
          .setDescription(
            `**Data final do Mute: ${inviteMessageDate}**
**Motivo:**
**Envio de Flood em UM canal do servidor com a seguinte mensagem:**
${it[idUser].content}
\n**fale com a administração do servidor para ser desmutado**`
          )
          .setFooter(`ID do usuário: ${message.author.id}`)
          .setTimestamp()
      )
      .catch(() => {
        channelLog?.send(
          message.author,
          new Discord.MessageEmbed()
            .setColor(Colors.pink_red)
            .setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
            .setAuthor(
              message.author.tag,
              message.author.displayAvatarURL({ dynamic: true })
            )
            .setTitle(
              `Não foi possível avisar na DM do usuário mutado ${message.author.tag}!`
            )
            .setFooter(`ID do usuário: ${message.author.id}`)
            .setTimestamp()
        );
      });
  }
}
