import Discord from 'discord.js';
import Colors from '../../../utils/layoutEmbed/colors.js';
import Icons from '../../../utils/layoutEmbed/iconsMessage.js';

export default {
  name: 'activateRecaptcha',
  description: `Ative ou Desative sistema de recaptcha contra selfbots!`,
  permissions: ['staff'],
  aliases: ['recaptcha', 'disableAnrecaptcha', 'activeRecaptcha', 'recaptcha'],
  category: 'AntiSpam ⚠️',
  run: ({ message, client }) => {
    const guildIdDatabase = new client.Database.table(
      `guild_id_${message.guild.id}`
    );

    const antiself = guildIdDatabase.get('recaptcha');
    if (antiself) {
      guildIdDatabase.set('recaptcha', false);
      message.channel.send(
        message.author,
        new Discord.MessageEmbed()
          .setColor(Colors.pink_red)
          .setThumbnail(Icons.erro)
          .setTitle(`O Sitema de Recaptcha foi desativado!`)
          .setAuthor(
            message.author.tag,
            message.author.displayAvatarURL({ dynamic: true })
          )
          .setDescription(`Para reativar use o comando novamente!`)
          .setTimestamp()
      );
      return;
    }
    guildIdDatabase.set('recaptcha', true);
    message.channel.send(
      message.author,
      new Discord.MessageEmbed()
        .setColor(Colors.pink_red)
        .setThumbnail(Icons.sucess)
        .setTitle(`O Sitema de Recaptcha foi Ativado!`)
        .setAuthor(
          message.author.tag,
          message.author.displayAvatarURL({ dynamic: true })
        )
        .setDescription(`Para desativar use o comando novamente!`)
        .setTimestamp()
    );
  },
};
