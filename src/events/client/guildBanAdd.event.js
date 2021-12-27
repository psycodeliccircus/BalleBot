/* eslint-disable prettier/prettier */
import Discord from 'discord.js';
import Colors from '../../utils/layoutEmbed/colors.js';
import { parseDateForDiscord } from '../../utils/TimeMessageConversor/parseDateForDiscord.js';

export default {
  name: 'guildBanAdd',
  once: false,
  run: async (client, guild, user) => {
    const guildIdDatabase = new client.Database.table(`guild_id_${guild.id}`);
    const channelLog = client.channels.cache.get(
      guildIdDatabase.get('channel_log')
    );

    const usersBanneds = await guild.fetchBans();
    const userBanned = usersBanneds.find((x) => x.user.id === user.id);
    const dataValidation =
      /(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}).(\d{3})Z/;
    const autorValidation = /(Punido por )(.*)\n/;

    const reasonFull = userBanned.reason;

    const userDataBanned = dataValidation.test(reasonFull)
      ? parseDateForDiscord(reasonFull.match(dataValidation)[0])
      : '`<Data não especificada, utilize o ballebot sempre que for banir para ter essa função>`';

    const userAutorBanned = autorValidation.test(reasonFull)
      ? reasonFull.match(autorValidation)[0].replace(/(Punido por )|(\n)/g, '')
      : `<sem autor>`;

    const descriptionBan = userBanned.reason
      ? userBanned.reason
        .replace(' — Data: ', '')
        .replace(dataValidation, '')
        .replace(autorValidation, '')
        .replace('— Motivo: ', '')
      : '<Descrição ou motivo não especificado>';


    channelLog?.send({
      content: `${user}`,
      embeds: [{
        color: Colors.pink_red,
        thumbnail: user.displayAvatarURL({ dynamic: true }),
        title: `Usuário ${user.tag} foi banido!`,
        description: `**Data: ${userDataBanned}**\n**Punido por: ${userAutorBanned}**\n**Motivo: **${descriptionBan} \n`,
        footer: `ID do usuário: ${user.id}`,
        timestamp: new Date()
      }]
    }).catch(() => {

      const buffer = Buffer.from(
        reasonFull
      );
      const attachment = new Discord.MessageAttachment(
        buffer,
        `ban_of_${user.tag}.txt`
      );
      channelLog?.send({
        content: `${user} O usuário possui um motivo muito grande e por esse motivo enviei um arquivo para você ver todo o motivo`,
        files: [attachment]
      });
    });

  },
};
