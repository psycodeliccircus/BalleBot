/* eslint-disable prettier/prettier */
import Discord from 'discord.js';
import Colors from '../../utils/layoutEmbed/colors.js';
import { parseDateForDiscord } from '../../utils/TimeMessageConversor/parseDateForDiscord.js';

export default {
  name: 'guildBanAdd',
  once: false,
  run: async (client, eventGuildBan) => {
    const guildIdDatabase = new client.Database.table(`guild_id_${eventGuildBan.guild.id}`);
    const channelLog = client.channels.cache.get(
      guildIdDatabase.get('channel_log')
    );
    const userBanned = eventGuildBan.user
    const dataValidation =
      /(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}).(\d{3})Z/;
    const autorValidation = /(Punido por )(.*)\n/;

    const usersBanneds = await eventGuildBan.guild.bans.fetch();

    const GuildBanJson = usersBanneds.find(userObj => userObj.user.id === userBanned.id)

    const reasonFull = GuildBanJson.reason;

    const userDataBanned = dataValidation.test(reasonFull)
      ? parseDateForDiscord(reasonFull.match(dataValidation)[0])
      : '`<Data não especificada, utilize o ballebot sempre que for banir para ter essa função>`';

    const userAutorBanned = autorValidation.test(reasonFull)
      ? reasonFull.match(autorValidation)[0].replace(/(Punido por )|(\n)/g, '')
      : `<sem autor>`;

    const descriptionBan = reasonFull
      ? reasonFull
        .replace(' — Data: ', '')
        .replace(dataValidation, '')
        .replace(autorValidation, '')
        .replace('— Motivo: ', '')
      : '<Descrição ou motivo não especificado>';

    channelLog?.send({
      content: `${userBanned}`,
      embeds: [{
        color: Colors.pink_red,
        thumbnail: userBanned.displayAvatarURL({ dynamic: true }),
        title: `Usuário ${userBanned.tag} foi banido!`,
        description: `**Data: ${userDataBanned}**\n**Punido por: ${userAutorBanned}**\n**Motivo: **${descriptionBan} \n`,
        footer: `ID do usuário: ${userBanned.id}`,
        timestamp: new Date()
      }]
    }).catch(() => {

      const buffer = Buffer.from(
        reasonFull
      );
      const attachment = new Discord.MessageAttachment(
        buffer,
        `ban_of_${userBanned.tag}.txt`
      );
      channelLog?.send({
        content: `${userBanned} O usuário possui um motivo muito grande e por esse motivo enviei um arquivo para você ver todo o motivo`,
        files: [attachment]
      });
    });

  },
};
