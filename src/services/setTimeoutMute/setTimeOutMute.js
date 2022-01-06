import Colors from '../../utils/commandsFunctions/layoutEmbed/colors.js';

export function setIntervalRemoveMute(client) {
  const tableTemporarilyMutated = new client.Database.table(
    `tableTemporarilyMutated`
  );
  const myList = tableTemporarilyMutated.all();

  myList.forEach((element) => {
    const userMuted = JSON.parse(element.data);

    let dataUserMuted = userMuted.dateMuted;

    if (dataUserMuted) {
      dataUserMuted = new Date(dataUserMuted);
      if (dataUserMuted < new Date()) {
        const userMember = client.guilds.cache
          .get(userMuted.guildId)
          .members.cache.get(userMuted.id);
        userMember?.roles.remove(userMuted.roleId);

        const user = client.users.cache.get(userMuted.id);
        const guildIdDatabase = new client.Database.table(
          `guild_id_${userMuted.guildId}`
        );

        const channelLog = client.channels.cache.get(
          guildIdDatabase.get('channel_log')
        );

        channelLog?.send({
          embeds: [
            {
              title: `Usuário foi desmutado após o tempo limite!`,
              author: {
                name: user.tag,
                icon_url: user.displayAvatarURL({ dynamic: true }),
              },
              description: `**Descrição:**\n${userMuted.reason}`,
              thumbnail: user.displayAvatarURL({ dynamic: true }),
              color: Colors.pink_red,
              footer: { text: `ID do usuário : ${user.id}` },
              timestamp: new Date(),
            },
          ],
        });

        tableTemporarilyMutated.delete(
          `guild_id_${userMuted.guildId}_user_id_${userMuted.id}`
        );
      }
    }
  });
}
