import Colors from '../../../utils/layoutEmbed/colors.js';

export default {
  name: 'viewAdm',
  description: `Para ver os cargos administrativos do seu servidor digite <prefix>viewAdm`,
  permissions: ['staff'],
  aliases: ['verAdm', 'adm'],
  category: 'Moderação ⚔️',
  run: ({ message, client, prefix }) => {
    const guildIdDatabase = new client.Database.table(
      `guild_id_${message.guild.id}`
    );

    const permissions = guildIdDatabase.get('admIds');
    const serverMember = client.guilds.cache.get(message.guild.id);

    // eslint-disable-next-line guard-for-in
    for (const role in permissions) {
      permissions[role] = serverMember.roles.cache.get(permissions[role]);
    }

    message.channel.send({
      content: `${message.author}`,
      embeds: [
        {
          color: Colors.pink_red,
          thumbnail: client.user.displayAvatarURL({ dynamic: true }),
          title: `Esses são os cargos Administrativos:`,
          timestamp: new Date(),
          description: `**Para atualizar os cargos use ${prefix}setAdm @padawan @mods @staff.**
            \nCada cargo possui acesso a comandos de acordo com sua hierarquia, para saber se um cargo pode usar um comando use ${prefix}help <comando>`,
          fields: [
            { name: 'Padawan', value: `${permissions.padawans}`, inline: true },
            { name: 'Mods', value: `${permissions.mods}`, inline: true },
            { name: 'Staff', value: `${permissions.staff}`, inline: true },
          ],
        },
      ],
    });
  },
};
