import Discord from 'discord.js';
import { verifyBannedWords } from '../../services/messageVerify/messageVerifyWords.js';
import { antiSpamAndFlood } from '../../services/antiSpamAndFlood/functionSpamAndFlood.js';
import Colors from '../../utils/layoutEmbed/colors.js';
import { userHasPermission } from '../../utils/userHasPermission/userHasPermission.js';
import { downloadDatabase } from '../../services/developersCommands/downloadDatabase.js';

export default {
  name: 'message',
  once: false,
  run: (client, message) => {
    if (message.author.bot) return;
    let { prefix } = process.env;
    if (message.author.id === process.env.developers) {
      if (message.content === 'database') downloadDatabase(message);
    }
    if (message.channel.type !== 'dm') {
      const guildIdDatabase = new client.Database.table(
        `guild_id_${message.guild.id}`
      );
      if (verifyBannedWords(client, message)) return;

      const { userHasPermissionOf } = userHasPermission(client, message);
      if (!message.member.hasPermission('ADMINISTRATOR')) {
        const dic = {
          owner: 4,
          staff: 3,
          mods: 2,
          padawans: 1,
          everyone: 0,
        };
        const positionUser = dic[userHasPermissionOf];

        if (positionUser === 0) {
          const antispam = guildIdDatabase.get('AntiSpam');

          if (antispam) {
            antiSpamAndFlood(client, message);
          }
        }
      }

      if (guildIdDatabase.has(`prefix`)) {
        prefix = guildIdDatabase.get(`prefix`);
      }
    }
    if (
      message.mentions.users.first() &&
      message.mentions.users.first().id === message.guild.me.id &&
      message.content === `<@!${message.guild.me.id}>`
    ) {
      message.channel.send(
        message.author,
        new Discord.MessageEmbed()
          .setColor(Colors.pink_red)
          .setTitle(`Meu prefixo no servidor é **\`${prefix}\`**`)
          .setFooter(
            `${message.author.tag}`,
            `${message.author.displayAvatarURL({ dynamic: true })}`
          )
          .setTimestamp()
      );
      return;
    }

    if (!message.content.startsWith(prefix)) return;

    const args = message.content.slice(prefix.length).split(/ +/);
    const commandName = args.shift().toLowerCase();
    try {
      const commandToBeExecuted = client.Commands.get(commandName);
      if (commandToBeExecuted) {
        const dmTrueOrFalse = commandToBeExecuted.dm;
        if (message.channel.type === 'dm') {
          if (dmTrueOrFalse) {
            return commandToBeExecuted.run({ client, message, args, prefix });
          }
          return;
        }

        const { permissionIsTrueOrFalse } = userHasPermission(
          client,
          message,
          commandName,
          false
        );
        const guildIdDatabase = new client.Database.table(
          `guild_id_${message.guild.id}`
        );
        const rolesPermissions = guildIdDatabase.get('admIds') || {};

        if (
          (!permissionIsTrueOrFalse ||
            commandToBeExecuted.name.toLowerCase() !== 'setadm') &&
          !rolesPermissions.staff
        ) {
          message.channel.send(
            message.author,
            new Discord.MessageEmbed()
              .setColor(Colors.pink_red)
              .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
              .setTitle(
                `${message.author.tag} Olá! Fico muito feliz e agredecida por ter me adicionado!!!!`
              )
              .setDescription(`Primeiramente, nós do servidor Ballerini ficamos honrados por usar nosso bot. Isso é incrível! 🙀 😻
Para começar vamos definir os cargos administrativos:
Eu ofereço 4 cargos de hierarquia, Everyone, Padawan, Moderadores e Staff.
O único que poderá definir os cargos será o dono do servidor!
Então mande a seguinte mensagem para definir os cargos repectivamente e saiba sobre os comandos com ${prefix}help!
${prefix}setAdm @cargoPadawan @cargoModeradores @cargoStaff `)
          );
          return;
        }
        if (permissionIsTrueOrFalse) {
          commandToBeExecuted.run({ client, message, args, prefix });
        } else {
          message.channel
            .send(
              message.author,
              new Discord.MessageEmbed()
                .setColor(Colors.pink_red)
                .setTitle(`Hey, você não tem permissão :(`)
                .setDescription(
                  `**Apenas ${commandToBeExecuted.permissions.join(
                    ' **|** '
                  )} possuem permissão para usar esse comando**`
                )
            )
            .then((msg) => {
              msg.delete({ timeout: 10000 });
            });
        }
        message.delete();
      }
    } catch (e) {
      console.error(e);
    }
  },
};
