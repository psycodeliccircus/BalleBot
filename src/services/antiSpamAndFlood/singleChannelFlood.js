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

    channelLog?.send({
      content: `${message.author}`,
      embeds: [
        {
          color: Colors.pink_red,
          thumbnail: message.author.displayAvatarURL({ dynamic: true }),
          author: {
            name: message.author.tag,
            icon_url: message.author.displayAvatarURL({ dynamic: true }),
          },
          title: `**Usuário ${message.author.tag} mutado por enviar um flood em UM canal!**`,
          description: `**O usuário enviou a seguinte mensagem ${maxMessageRep} vezes em <#${it[idUser].lastChannel}>:**
${it[idUser].content}
**Data final do Mute: ${inviteMessageDate}**`,
          footer: { text: `ID do usuário: ${message.author.id}` },
          timestamp: new Date(),
        },
      ],
    });

    message.author
      .send({
        embeds: [
          {
            color: Colors.red,
            thumbnail: message.guild.iconURL(),
            title: `Você foi mutado no servidor ** ${message.guild.name}** `,
            description: `**Data final do Mute: ${inviteMessageDate}**
**Motivo:**
**Envio de Flood em UM canal do servidor com a seguinte mensagem:**
${it[idUser].content}
\n**fale com a administração do servidor para ser desmutado**`,
            footer: `ID do usuário: ${message.author.id}`,
            timestamp: new Date(),
          },
        ],
      })
      .catch(() => {
        channelLog?.send({
          content: `${message.author}`,
          embeds: [
            {
              color: Colors.pink_red,
              thumbnail: message.author.displayAvatarURL({ dynamic: true }),
              author: {
                name: message.author.tag,
                icon_url: message.author.displayAvatarURL({ dynamic: true }),
              },
              title: `Não foi possível avisar na DM do usuário mutado ${message.author.tag}!`,
              footer: { text: `ID do usuário: ${message.author.id}` },
              timestamp: new Date(),
            },
          ],
        });
      });
  }
}
