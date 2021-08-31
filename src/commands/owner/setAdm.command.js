import Discord from 'discord.js'
import { prefix } from '../../assets/prefix.js'
import { messageErro } from '../../utils/Embeds/error.template.js';

export default {
  name: 'setAdm',
  description: `Para adionar os cargos de administração use ${prefix}addRolesAdm <idPadawan> <idModeradores> <idStaff>`,
  permissions: ['owner'],
  aliases: ['addAdm', 'addRolesAdm'],
  category: 'Owner 🗡️',
  run: ({ message, client, args }) => {
    const guildIdDatabase = new client.Database.table(`guild_id_${message.guild.id}`)

    if (!args[2]) {
      message.channel.send(message.author, messageErro())
      return;
    }
    const loadsToBeConsidered = [args[0], args[1], args[2]];

    loadsToBeConsidered.map((idrole, roleIndex) => {
      if (idrole.indexOf('@') !== -1) {
        loadsToBeConsidered[roleIndex] = idrole.replace('<@&', '').replace('>', '')
      }
    })

    for (let i = 0; i < loadsToBeConsidered.length; i++) {
      const cargo = client.guilds.cache.get(message.guild.id).roles.cache.get(loadsToBeConsidered[i]);
      if (!cargo) {
        message.channel.send(message.author, messageErro())
        return
      }
    }
    const permissionIDs = {
      everyone: message.guild.id,
      padawans: loadsToBeConsidered[0],
      mods: loadsToBeConsidered[1],
      staff: loadsToBeConsidered[2]
    }
    guildIdDatabase.set('admIds', permissionIDs)

    message.channel.send(message.author, new Discord.MessageEmbed()
      .setColor('#ff8997')
      .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
      .setTitle(`Os Cargos Administrativos foram setados!:`)
      .setDescription(
        '**• Esses são os cargos que foram setados:**' +
        '\n*Padawan:* ' + '<@&' + loadsToBeConsidered[0] + '>' +
        '\n*Mods:* ' + '<@&' + loadsToBeConsidered[1] + '>' +
        '\n*Staff:* ' + '<@&' + loadsToBeConsidered[2] + '>' +
        `\n**• Todos os membros que possuem esses cargos vão ter acesso ao comandos respectivos que podem ser vistos em ${prefix}help ** `))
  }
};
