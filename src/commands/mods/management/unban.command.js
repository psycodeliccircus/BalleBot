import { helpWithASpecificCommand } from '../../everyone/comandosCommon/help.command.js';
import Colors from '../../../utils/layoutEmbed/colors.js';
import { getUserOfCommand } from '../../../utils/getUserMention/getUserOfCommand.js';
import Icons from '../../../utils/layoutEmbed/iconsMessage.js';

export default {
  name: 'unban',
  description: `<prefix>unban @Usuários/TAGs/Nomes/IDs/Citações para desbanir usuários`,
  permissions: ['mods'],
  aliases: ['removeban', 'removerban', 'retirarban', 'desban'],
  category: 'Moderação ⚔️',
  run: async ({ message, client, args, prefix }) => {
    const ban = await message.guild.fetchBans();
    const { users } = await getUserOfCommand(client, message, prefix);

    if (!args[0] && !users) {
      const [command] = message.content.slice(prefix.length).split(/ +/);
      helpWithASpecificCommand(command, client, message);
      return;
    }
    if (!message.member.permissions.has('BAN_MEMBERS')) {
      return message.channel.send({
        embeds: [
          {
            author: {
              name: message.author.tag,
              icon_url: message.author.displayAvatarURL({ dynamic: true }),
            },
            description:
              'Você não tem permissão de desbanir usuários, fale com um administrador',
            thumbnail: Icons.erro,
            color: Colors.pink_red,
            timestamp: new Date(),
          },
        ],
      });
    }
    if (!users) {
      return message.channel
        .send({
          content: `${message.author}`,
          embeds: [
            {
              color: Colors.pink_red,
              thumbnail: Icons.erro,
              author: {
                name: message.author.tag,
                icon_url: message.author.displayAvatarURL({ dynamic: true }),
              },
              title: `Não encontrei os usuários!`,
              description: `**Tente usar**\`\`\`${prefix}unban <@Usuários/TAGs/Nomes/IDs/Citações>\`\`\``,
              timestamp: new Date(),
            },
          ],
        })
        .then((msg) => msg.delete({ timeout: 15000 }));
    }

    users.forEach(async (userBanned) => {
      const member = await client.users.fetch(userBanned.id);

      if (!ban.get(member.id)) {
        return message.channel
          .send({
            embeds: [
              {
                title: `O usuário ${member.tag} não está banido!`,
                author: {
                  name: message.author.tag,
                  icon_url: message.author.displayAvatarURL({ dynamic: true }),
                },
                thumbnail: member.displayAvatarURL({ dynamic: true }),
                color: Colors.pink_red,
                description: `**Para banir usuários use:\n\`\`${prefix}ban @Usuários/TAGs/Nomes/IDs/Citações <motivo>\`\`**`,
                timestamp: new Date(),
              },
            ],
          })
          .then((msg) => msg.delete({ timeout: 15000 }));
      }

      message.guild.members.unban(member);

      function messageInviteLog() {
        return {
          title: `O usuário ${member.tag} foi desbanido!`,
          description: `**Pelo usuário: ${message.author}**`,
          author: {
            name: message.author.tag,
            icon_url: message.author.displayAvatarURL({ dynamic: true }),
          },
          footer: `ID do usuário: ${member.id}`,
          thumbnail: member.displayAvatarURL({ dynamic: true }),
          color: Colors.pink_red,
        };
      }
      const guildIdDatabase = new client.Database.table(
        `guild_id_${message.guild.id}`
      );
      const channelLog = client.channels.cache.get(
        guildIdDatabase.get('channel_log')
      );

      if (channelLog) {
        channelLog.send({
          content: `${message.author}`,
          embeds: [messageInviteLog()],
        });
      } else {
        message.channel
          .send({
            content: `${message.author}`,
            embeds: [messageInviteLog()],
          })
          .then((msg) => msg.delete({ timeout: 15000 }));
      }
    });
  },
};
