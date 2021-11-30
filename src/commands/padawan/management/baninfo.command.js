/* eslint-disable prettier/prettier */
import Discord from 'discord.js';
import { helpWithASpecificCommand } from '../../everyone/comandosCommon/help.command.js';
import { getUserOfCommand } from '../../../utils/getUserMention/getUserOfCommand.js';
import { parseDateForDiscord } from '../../../utils/TimeMessageConversor/parseDateForDiscord.js';
import Colors from '../../../utils/layoutEmbed/colors.js';
import Icons from '../../../utils/layoutEmbed/iconsMessage.js';

export default {
  name: 'baninfo',
  description: `<prefix>baninfo @Usuários/TAGs/Nomes/IDs/Citações para saber o motivo de membros terem sidos banidos`,
  permissions: ['padawans'],
  aliases: ['verban', 'viewban', 'banuser', 'infoban'],
  category: 'Moderação ⚔️',
  run: async ({ message, client, args, prefix }) => {
    const { users } = await getUserOfCommand(client, message, prefix);

    if (!args[0] && !users) {
      const [command] = message.content.slice(prefix.length).split(/ +/);
      helpWithASpecificCommand(command, client, message);
      return;
    }

    if (users === undefined) {
      message.channel.send(
        message.author,
        new Discord.MessageEmbed()
          .setColor(Colors.pink_red)
          .setThumbnail(Icons.erro)
          .setTitle(`Não encontrei o usuário!`)
          .setDescription(
            `**Tente usar**\n\`\`${prefix}baninfo <@Usuários/TAGs/Nomes/IDs/Citações>\`\``
          )
          .setFooter(
            `${message.author.tag}`,
            `${message.author.displayAvatarURL({ dynamic: true })}`
          )
          .setTimestamp()
      );
      return;
    }
    const usersBanneds = await message.guild.fetchBans();
    users.forEach(async (user) => {
      if (!usersBanneds.some((x) => x.user.id === user.id)) {
        message.channel.send(
          new Discord.MessageEmbed()
            .setTitle(`O usuário ${user.tag} não está banido!`)
            .setAuthor(
              message.author.tag,
              message.author.displayAvatarURL({ dynamic: true })
            )
            .setThumbnail(user.displayAvatarURL({ dynamic: true }))
            .setColor(Colors.pink_red)
            .setDescription(
              `**Para banir usuários use:\n\`\`${prefix}ban @Usuários/TAGs/Nomes/IDs/Citações <motivo>\`\`**`
            )
            .setTimestamp()
        );
        return;
      }
      const userBanned = usersBanneds.find((x) => x.user.id === user.id);
      const dataValidation =
        /(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}).(\d{3})Z/;
      const autorValidation = /(Punido por )(.*)\n/;

      const reasonFull = userBanned.reason;

      const userDataBanned = dataValidation.test(reasonFull)
        ? parseDateForDiscord(reasonFull.match(dataValidation)[0])
        : '`<Data não especificada, utilize o ballebot sempre que for banir para ter essa função>`';

      const userAutorBanned = autorValidation.test(reasonFull)
        ? reasonFull
          .match(autorValidation)[0]
          .replace(/(Punido por )|(\n)/g, '')
          .replace(/(\d{18})/, `<@$1>`)
        : `<sem autor>`;

      const descriptionBan = userBanned.reason
        ? userBanned.reason
          .replace(' — Data: ', '')
          .replace(dataValidation, '')
          .replace(autorValidation, '')
          .replace('— Motivo: ', '')
        : '<Descrição ou motivo não especificado>';

      message.channel
        .send(
          message.author,
          new Discord.MessageEmbed()
            .setColor(Colors.pink_red)
            .setThumbnail(user.displayAvatarURL({ dynamic: true }))
            .setTitle(`Informações sobre o banimento do usuário: ${user.tag} `)
            .setDescription(
              `**Data: ${userDataBanned}**\n**Punido por: ${userAutorBanned}**\n**Motivo: **${descriptionBan} \n`
            )
            .setFooter(`ID do usuário: ${user.id}`)
            .setTimestamp()
        )
        .catch(() => {
          const buffer = Buffer.from(reasonFull);
          const attachment = new Discord.MessageAttachment(
            buffer,
            `ban_of_${user.tag}.txt`
          );
          message.channel.send(
            `${user} O usuário possui um motivo muito grande e por esse motivo enviei um arquivo para você ver todo o motivo`,
            attachment
          );
        });
    });
  },
};
