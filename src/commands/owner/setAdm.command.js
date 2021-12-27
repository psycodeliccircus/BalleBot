import { helpWithASpecificCommand } from '../everyone/comandosCommon/help.command.js';
import Colors from '../../utils/layoutEmbed/colors.js';

export default {
  name: 'setAdm',
  description: `Para adionar os cargos de administração use <prefix>addRolesAdm <idPadawan> <idModeradores> <idStaff>`,
  permissions: ['owner'],
  aliases: ['addAdm', 'addRolesAdm'],
  category: 'Owner 🗡️',
  run: ({ message, client, args, prefix }) => {
    const guildIdDatabase = new client.Database.table(
      `guild_id_${message.guild.id}`
    );
    if (!args[0]) {
      const [command] = message.content.slice(prefix.length).split(/ +/);
      helpWithASpecificCommand(command, client, message);
      return;
    }

    function messageErro() {
      return {
        color: Colors.pink_red,
        thumbnail: client.user.displayAvatarURL({ dynamic: true }),
        title: `Os Cargos Administrativos não foram encontrados!:`,
        description: `**Desculpa, mas não encontrei os cargos marcados.**
      \n**•** Mande no seguinte esquema (o nome do cargo pode ser qualquer um):
      \nprefix setAdm @cargoPadawan @cargoMods @cargoStaff\``,
      };
    }

    if (!args[2]) {
      return message.channel.send({
        content: `${message.author}`,
        embeds: [messageErro()],
      });
    }
    const loadsToBeConsidered = [args[0], args[1], args[2]];

    loadsToBeConsidered.forEach((idrole, roleIndex) => {
      if (idrole.indexOf('@') !== -1) {
        loadsToBeConsidered[roleIndex] = idrole.replace(/(<)|(@&)|(>)/g, '');
      }
    });

    for (let i = 0; i < loadsToBeConsidered.length; i++) {
      const cargo = client.guilds.cache
        .get(message.guild.id)
        .roles.cache.get(loadsToBeConsidered[i]);
      if (!cargo) {
        return message.channel.send({
          content: `${message.author}`,
          embeds: [messageErro()],
        });
      }
    }
    const permissionIDs = {
      everyone: message.guild.id,
      padawans: loadsToBeConsidered[0],
      mods: loadsToBeConsidered[1],
      staff: loadsToBeConsidered[2],
    };
    guildIdDatabase.set('admIds', permissionIDs);

    message.channel.send({
      content: `${message.author}`,
      embeds: [
        {
          color: Colors.pink_red,
          thumbnail: client.user.displayAvatarURL({ dynamic: true }),
          title: `Os Cargos Administrativos foram setados!:`,
          description: `**• Esses são os cargos que foram setados:**
**Padawan:** <@&${loadsToBeConsidered[0]}>
**Mods:** <@&${loadsToBeConsidered[1]}>
**Staff:** <@&${loadsToBeConsidered[2]}>
**• Todos os membros que possuem esses cargos vão ter acesso ao comandos respectivos que podem ser vistos em ${prefix}help ** `,
        },
      ],
    });
  },
};
