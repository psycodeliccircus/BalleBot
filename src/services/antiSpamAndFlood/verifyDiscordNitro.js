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
              title: `**Usuário ${message.author.tag} Banido por enviar um Scam de Discord Nitro!**`,
              description: `**O usuário enviou a seguinte mensagem em ${message.channel}:**
${message.content}`,
              footer: `ID do usuário: ${message.author.id}`,
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
