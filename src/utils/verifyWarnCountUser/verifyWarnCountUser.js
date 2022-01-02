import { parseDateForDiscord } from '../TimeMessageConversor/parseDateForDiscord.js';
import Colors from '../layoutEmbed/colors.js';
import Icons from '../layoutEmbed/iconsMessage.js';

export async function verifyWarnCountUser(client, message, userId) {
  const guildIdDatabase = new client.Database.table(
    `guild_id_${message.guild.id}`
  );
  const maxWarns = guildIdDatabase.get(`maxWarns`);
  const userObject = guildIdDatabase.get(`user_id_${userId}`);
  const user = client.users.cache.find((u) => u.id === userId);

  if (maxWarns && userObject.reasons.length >= maxWarns) {
    await message.guild.members
      .ban(user, {
        reason: `recebeu ${maxWarns} warns em ${message.guild}
        (máximo de warns: ${maxWarns}) — Data: ${message.createdAt.toISOString()} - Autor: BalleBot `,
      })
      .then(() => {
        const channelLog = client.channels.cache.get(
          guildIdDatabase.get('channel_log')
        );
        function messageForChannelLog() {
          const dateMessage = message.createdAt.toISOString();
          const dataConvert = parseDateForDiscord(dateMessage);

          const dateForMessage = `${dataConvert}`;

          return {
            color: Colors.pink_red,
            thumbnail: Icons.sucess,
            title: `O usuário ${user.tag} foi banido!`,
            description: `**Punido por receber ${maxWarns} warns**\n**Data: ${dateForMessage}**`,
            footer: { text: `ID do usuário: ${user.id}` },
            timestamp: new Date(),
          };
        }
        if (channelLog) {
          channelLog.send({
            content: `${message.author}`,
            embeds: [messageForChannelLog()],
          });
        } else {
          message.channel
            .send({
              content: `${message.author}`,
              embeds: [messageForChannelLog()],
            })
            .then((msg) => setTimeout(() => msg.delete(), 15000));
        }
        user
          .send({
            embeds: [
              {
                color: Colors.pink_red,
                thumbnail: message.guild.iconURL(),
                title: `Você foi banido do servidor **${message.guild.name}**`,
                description: `**Motivo: **\nVocê levou ${maxWarns} ou mais warns\nCaso ache que o banimento foi injusto, **fale com ${message.author.tag}**`,
                footer: { text: `ID do usuário: ${user.id}` },
                timestamp: new Date(),
              },
            ],
          })
          .catch(() => {
            if (channelLog) {
              channelLog.send({
                content: `${message.author}`,
                embeds: [
                  {
                    author: {
                      name: message.author.tag,
                      icon_url: message.author.displayAvatarURL({
                        dynamic: true,
                      }),
                    },
                    thumbnail: user.displayAvatarURL({ dynamic: true }),
                    color: Colors.pink_red,
                    title: `Não foi possível avisar na DM do usuário ${user.tag}!`,
                  },
                ],
              });
            } else {
              message.channel
                .send({
                  content: `${message.author}`,
                  embeds: [
                    {
                      author: {
                        name: message.author.tag,
                        icon_url: message.author.displayAvatarURL({
                          dynamic: true,
                        }),
                      },
                      thumbnail: user.displayAvatarURL({ dynamic: true }),
                      color: Colors.pink_red,
                      title: `Não foi possível avisar na DM do usuário ${user.tag}!`,
                    },
                  ],
                })
                .then((msg) => setTimeout(() => msg.delete(), 15000));
            }
          });
      })
      .catch(() => {
        // just ignore exception
      });
  }
}
