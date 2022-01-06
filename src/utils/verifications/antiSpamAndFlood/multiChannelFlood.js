import Colors from '../../commandsFunctions/layoutEmbed/colors.js';

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
    if (!message.guild.me.permissions.has('BAN_MEMBERS')) {
      return channelLog?.send({
        content: `${message.author}`,
        embeds: [
          {
            color: Colors.pink_red,
            thumbnail: message.author.displayAvatarURL({ dynamic: true }),
            author: {
              name: message.author.tag,
              icon_url: message.author.displayAvatarURL({ dynamic: true }),
            },
            title: `**Usuário ${message.author.tag} mandou uma suspeita de Scam por enviar um Flood/Scam em VÁRIOS canais!**`,
            description: `**O usuário floodou a seguinte mensagem ${maxMessageRep} vezes muitp rapidamente em <#${it[idUser].lastChannel}>:**
  ${it[idUser].content}
  **Eu não tenho permissão de banir o usuário, verifique antes que seja tarde e me dê permissão!`,
            footer: { text: `ID do usuário: ${message.author.id}` },
            timestamp: new Date(),
          },
        ],
      });
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
        const listOfChannelsFormated = [];

        it[idUser].idChannelRaid.forEach((channel) =>
          listOfChannelsFormated.push(`<#${channel}>`)
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
              title: `**Usuário ${message.author.tag} Banido por enviar um Flood/Scam em VÁRIOS canais!**`,
              description: `**O usuário enviou a seguinte mensagem ${maxMessageRep} vezes muito rapidamente em ${maxMessageRep} chats:**
${it[idUser].content}`,
              fields: [
                {
                  name: 'Enviada nos canais respectivos:',
                  value: `${listOfChannelsFormated.join(' **|** ')}`,
                },
              ],
              footer: { text: `ID do usuário: ${message.author.id}` },
              timestamp: new Date(),
            },
          ],
        });

        const listChannelsName = it[idUser].idChannelRaid.map(
          (channelId) => client.channels.cache.get(channelId).name
        );
        message.author
          .send({
            embeds: [
              {
                color: Colors.red,
                thumbnail: message.guild.iconURL(),
                title: `Você foi banido no servidor ** ${message.guild.name}** `,
                description: `**Motivo:**
**Banido por enviar um Flood/Scam em VÁRIOS canais!**
${it[idUser].content}
\n**Fale com a administração do servidor para ser desbanido caso ache injusto**`,
                fields: [
                  {
                    name: 'Enviada nos canais respectivos:',
                    value: `${listChannelsName.join(' **|** ')}`,
                  },
                ],
                footer: { text: `ID do usuário: ${message.author.id}` },
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
                    icon_url: message.author.displayAvatarURL({
                      dynamic: true,
                    }),
                  },
                  title: `Não foi possível avisar na DM do usuário banido ${message.author.tag}!`,
                  footer: { text: `ID do usuário: ${message.author.id}` },
                  timestamp: new Date(),
                },
              ],
            });
          });
      });
  }
}
