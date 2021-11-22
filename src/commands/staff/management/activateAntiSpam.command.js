import Discord from 'discord.js';
import Colors from '../../../utils/layoutEmbed/colors.js';
import Icons from '../../../utils/layoutEmbed/iconsMessage.js';

export default {
  name: 'activateAntiSpam',
  description: `Ative ou Desative sistema de AntiSpam e AntiFlood nos canais que o BalleBot tem acesso apenas mandando esse comando`,
  permissions: ['staff'],
  aliases: ['antiSpam', 'disableAntiSpam', 'activeAntiSpam'],
  category: 'AntiSpam ⚠️',
  run: ({ message, client }) => {
    const guildIdDatabase = new client.Database.table(
      `guild_id_${message.guild.id}`
    );

    const antispam = guildIdDatabase.get('AntiSpam');
    if (antispam) {
      guildIdDatabase.set('AntiSpam', false);
      message.channel.send(
        message.author,
        new Discord.MessageEmbed()
          .setColor(Colors.pink_red)
          .setThumbnail(Icons.erro)
          .setTitle(`O Sitema de AntiSpam foi desativado!`)
          .setAuthor(
            message.author.tag,
            message.author.displayAvatarURL({ dynamic: true })
          )
          .setDescription(`Para reativar use o comando novamente!`)
          .setTimestamp()
      );
      return;
    }
    guildIdDatabase.set('AntiSpam', true);
    message.channel.send(
      message.author,
      new Discord.MessageEmbed()
        .setColor(Colors.pink_red)
        .setThumbnail(Icons.sucess)
        .setTitle(`O Sitema de AntiSpam foi Ativado!`)
        .setAuthor(
          message.author.tag,
          message.author.displayAvatarURL({ dynamic: true })
        )
        .setDescription(`Para desativar use o comando novamente!`)
        .setTimestamp()
    );
  },
};
