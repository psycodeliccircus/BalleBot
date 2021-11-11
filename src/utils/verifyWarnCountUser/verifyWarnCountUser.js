import Discord from 'discord.js';
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

          return new Discord.MessageEmbed()
            .setColor(Colors.pink_red)
            .setThumbnail(Icons.sucess)
            .setTitle(`O usuário ${user.tag} foi banido!`)
            .setDescription(
              `**Punido por receber ${maxWarns} warns**\n**Data: ${dateForMessage}**`
            )
            .setFooter(`ID do usuário: ${user.id}`)
            .setTimestamp();
        }
        if (channelLog) {
          channelLog.send(message.author, messageForChannelLog());
        } else {
          message.channel
            .send(message.author, messageForChannelLog())
            .then((msg) => msg.delete({ timeout: 15000 }));
        }
        user
          .send(
            new Discord.MessageEmbed()
              .setColor(Colors.pink_red)
              .setThumbnail(message.guild.iconURL())
              .setTitle(`Você foi banido do servidor **${message.guild.name}**`)
              .setDescription(
                `**Motivo: **\nVocê levou ${maxWarns}\nCaso ache que o banimento foi injusto, **fale com ${message.author}**`
              )
              .setFooter(`ID do usuário: ${user.id}`)
              .setTimestamp()
          )
          .catch(() => {
            if (channelLog) {
              channelLog.send(
                message.author,
                new Discord.MessageEmbed()
                  .setAuthor(
                    message.author.tag,
                    message.author.displayAvatarURL({ dynamic: true })
                  )
                  .setThumbnail(user.displayAvatarURL({ dynamic: true }))
                  .setColor(Colors.pink_red)
                  .setTitle(
                    `Não foi possível avisar na DM do usuário ${user.tag}!`
                  )
              );
            } else {
              message.channel
                .send(
                  message.author,
                  message.author,
                  new Discord.MessageEmbed()
                    .setAuthor(
                      message.author.tag,
                      message.author.displayAvatarURL({ dynamic: true })
                    )
                    .setThumbnail(user.displayAvatarURL({ dynamic: true }))
                    .setColor(Colors.pink_red)
                    .setTitle(
                      `Não foi possível avisar na DM do usuário ${user.tag}!`
                    )
                )
                .then((msg) => msg.delete({ timeout: 15000 }));
            }
          });
      })
      .catch(() => {
        // Failmessage
      });
  }
}
