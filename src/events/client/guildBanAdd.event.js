import Discord from 'discord.js';
import Colors from '../../utils/layoutEmbed/colors.js';

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
    channelLog?.send(
      user,
      new Discord.MessageEmbed()
        .setColor(Colors.pink_red)
        .setThumbnail(user.displayAvatarURL({ dynamic: true }))
        .setTitle(`Usuário ${user.tag} foi banido manualmente!`)
        .setDescription(`**Descrição: ** \n${userBanned.reason} \n`)
        .setFooter(`ID do usuário: ${user.id}`)
        .setTimestamp()
    );
  },
};
