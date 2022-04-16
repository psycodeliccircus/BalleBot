import Colors from '../../commandsFunctions/layoutEmbed/colors.js';

export async function verifyDiscordNitro(client, message) {
  let contentMessage = message.content;
  const regex = [/discord/gi, /free/gi, /nitro/gi, /http(s?):\/\//gi];
  const linkTrue = /http(s?):\/\/discord\.gift\//gi;
  let scam = true;

  const regexLink = /https:\/\/.* /;

  function removeLinkTenorGif() {
    let contentMessageClone = contentMessage;
    while (contentMessageClone.includes('https://tenor.com/')) {
      const matchcontent = contentMessageClone?.match(regexLink);
      const link = matchcontent
        ? matchcontent[0].split(' ')[0]
        : contentMessageClone;

      if (link.includes('https://tenor.com/')) {
        contentMessage = contentMessage.replace(link, '');
      }
      contentMessageClone = contentMessageClone.replace(link, '');
    }
  }
  removeLinkTenorGif();

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
            title: `**Usuário ${message.author.tag} mandou uma suspeita de Scam de discord nitro em um canal!**`,
            description: `*O usuário enviou a seguinte mensagem no canal ${message.channel}:
${message.content}
\n**Eu não tenho permissão de banir o usuário, verifique antes que seja tarde e me dê permissão!`,
            footer: `ID do usuário: ${message.author.id}`,
            timestamp: new Date(),
          },
        ],
      });
    }

    const reason = `Scam de Discord Nitro Free falso:\n${message.content}`;
    await message.guild.members
      .ban(message.author, {
        reason: `Punido por ${client.user.tag} | ${client.user.id}
       — Data: ${message.createdAt.toISOString()} — Motivo: ${reason}`,
      })
      .then(() => {
        message.delete();

        message.author
          .send({
            embeds: [
              {
                color: Colors.red,
                thumbnail: message.guild.iconURL(),
                title: `Você foi banido no servidor ** ${message.guild.name}** `,
                description: `**Banido por enviar Scam de Discord Nitro Free! Aqui está a mensagem:**
${message.content}
\n**Fale com a administração do servidor para ser desbanido caso ache injusto**`,
                footer: {
                  text: `ID do usuário: ${message.author.id}`,
                },
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
    return true;
  }
  return false;
}
