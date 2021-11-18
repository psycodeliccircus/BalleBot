import Discord from 'discord.js';
import { getUserOfCommand } from '../../../utils/getUserMention/getUserOfCommand.js';
import { parseDateForDiscord } from '../../../utils/TimeMessageConversor/parseDateForDiscord.js';
import Colors from '../../../utils/layoutEmbed/colors.js';
import Icons from '../../../utils/layoutEmbed/iconsMessage.js';
import { userHasPermission } from '../../../utils/userHasPermission/userHasPermission.js';

export default {
  name: 'warnlist',
  description: `<prefix>warnlist @Usuários/TAGs/Nomes/IDs/Citações para ver os warns de um usuários`,
  permissions: ['everyone'],
  aliases: ['warns'],
  category: 'Moderação ⚔️',
  run: async ({ message, client, args, prefix }) => {
    let { users } = await getUserOfCommand(client, message, prefix);
    users = !users && !args[0] ? [message.author] : users;

    if (!users) {
      message.channel
        .send(
          message.author,
          new Discord.MessageEmbed()
            .setColor(Colors.pink_red)
            .setAuthor(
              message.author.tag,
              message.author.displayAvatarURL({ dynamic: true })
            )
            .setThumbnail(Icons.erro)
            .setTitle(`Não encontrei os usuários!`)
            .setDescription(
              `**Tente usar**\`\`\`${prefix}warnlist @Usuários/TAGs/Nomes/IDs/Citações\`\`\``
            )
            .setTimestamp()
        )
        .then((msg) => msg.delete({ timeout: 15000 }));
      return;
    }
    const permissionRequired = 'mods';
    const { userHasPermissionOf } = userHasPermission(
      client,
      message,
      'warnlist',
      true,
      permissionRequired
    );
    if (userHasPermissionOf) {
      const guildIdDatabase = new client.Database.table(
        `guild_id_${message.guild.id}`
      );

      users.forEach(async (user) => {
        if (guildIdDatabase.has(`user_id_${user.id}`)) {
          const myUser = guildIdDatabase.get(`user_id_${user.id}`);
          const warnsUser = myUser.reasons;

          if (warnsUser) {
            const messageCommands = warnsUser.reduce(
              (previous, current, index) =>
                `${previous}**Aviso ${index + 1}:**
**Punido por: <@${myUser.autor[index]}>**
**Data: ${parseDateForDiscord(myUser.dataReasonsWarns[index])}**
**Motivo:**
${current}\n\n`,
              ''
            );

            if (messageCommands.length >= 4096) {
              const removeAsteriskMessage = /\*\*([^**]+(?=\*\*))\*\*/gi;

              const buffer = Buffer.from(
                messageCommands.replace(removeAsteriskMessage, '$1')
              );
              const attachment = new Discord.MessageAttachment(
                buffer,
                `warnlist_of_${user.tag}.txt`
              );
              message.channel.send(
                `${message.author} O usuário possui muitos aviso e por esse motivo enviei um arquivo para você ver todos eles`,
                attachment
              );
            } else {
              message.channel.send(
                message.author,
                new Discord.MessageEmbed()
                  .setColor(Colors.pink_red)
                  .setThumbnail(user.displayAvatarURL({ dynamic: true }))
                  .setAuthor(
                    message.author.tag,
                    message.author.displayAvatarURL({ dynamic: true })
                  )
                  .setTitle(`Lista de warns do usuário ${user.tag}`)
                  .setDescription(messageCommands)
                  .setFooter(`ID do usuário: ${user.id}`)
                  .setTimestamp()
              );
            }
            return;
          }
        }
        message.channel.send(
          message.author,
          new Discord.MessageEmbed()
            .setColor(Colors.pink_red)
            .setThumbnail(Icons.erro)
            .setAuthor(
              message.author.tag,
              message.author.displayAvatarURL({ dynamic: true })
            )
            .setFooter(`ID do usuário: ${user.id}`)
            .setTitle(`O Usuário ${user.tag} não possui avisos`)
            .setTimestamp()
        );
      });
    } else {
      message.channel
        .send(
          message.author,
          new Discord.MessageEmbed()
            .setColor(Colors.pink_red)
            .setTitle(
              `Hey, você não tem permissão de ver avisos de outros membros :(`
            )
            .setDescription(
              `**Apenas ${permissionRequired} possuem permissão para usar esse comando com outros membros**`
            )
        )
        .then((msg) => {
          msg.delete({ timeout: 15000 });
        });
    }
  },
};
