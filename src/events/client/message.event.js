import Discord from 'discord.js';
import { verifyBannedWords } from './messageVerify/messageVerifyWords.js';

const { prefix } = process.env;

export default {
  name: 'message',
  once: false,
  run: (client, message) => {
    if (!message.author.bot && verifyBannedWords(client, message)) return;

    if (!message.author.bot && message.content.startsWith(prefix)) {
      const args = message.content.slice(prefix.length).split(/ |\n+/);
      const commandName = args.shift().toLowerCase();
      try {
        const commandToBeExecuted = client.Commands.get(commandName);
        if (commandToBeExecuted) {
          if (message.channel.type === 'dm' && commandToBeExecuted.dm)
            return commandToBeExecuted.run({ client, message, args });

          const guildIdDatabase = new client.Database.table(
            `guild_id_${message.guild.id}`
          );

          const isEventCommand = commandToBeExecuted.event;

          if (isEventCommand) {
            if (!guildIdDatabase.get(`event_${isEventCommand}`)) {
              return;
            }
          }

          const rolesPermissions = guildIdDatabase.get('admIds') || {
            owner: message.guild.ownerID,
          };

          const rolesUser = client.guilds.cache
            .get(message.guild.id)
            .members.cache.get(message.author.id)
            .roles.cache.map((role) => role.id);

          const userHasPermission = commandToBeExecuted.permissions.find(
            (permissionName) =>
              rolesUser.includes(rolesPermissions[permissionName]) ||
              message.guild.ownerID === message.author.id
          );

          if (
            (!userHasPermission ||
              commandToBeExecuted.name.toLowerCase() !== 'setadm') &&
            !rolesPermissions.staff
          ) {
            message.channel.send(
              message.author,
              new Discord.MessageEmbed()
                .setColor('#ff8997')
                .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
                .setTitle(
                  `${message.author.tag} Olá! Fico muito feliz e agredecida por ter me adicionado!!!!`
                )
                .setDescription(`Primeiramente, nós do servidor Ballerini ficamos honrado por usar nosso bot. Isso é incrível! 🙀 😻
                    \nPara começar vamos definir os cargos administrativos:
                    \nEu ofereço 4 cargos de hierarquia, Everyone, Padawan, Moderadores e Staff.
                    \nO único que poderá definir os cargos será o dono do servidor!
                    \nEntão mande a seguinte mensagem para definir os cargos repectivamente e saiba sobre os comandos com ${prefix}help!
                    \n${prefix}setAdm @cargoPadawan @cargoModeradores @cargoStaff `)
            );
            return;
          }

          if (userHasPermission) {
            return commandToBeExecuted.run({ client, message, args });
          }
          message.channel.send(
            message.author,
            new Discord.MessageEmbed()
              .setColor('#ff8997')
              .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
              .setTitle(`${message.author.tag} Hey, você não tem permissão :(`)
              .setDescription(
                `Apenas ${commandToBeExecuted.permissions.join(
                  ' | '
                )} possuem permissão para usar esse comando`
              )
          );
        }
      } catch (e) {
        console.error(e);
      }
    }
  },
};
