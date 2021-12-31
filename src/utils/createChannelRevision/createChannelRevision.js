export function createChannelRevision(message, muterole) {
  const channelName = 'revisão-mute';

  const channelExist = message.guild.channels.cache.some(
    (channel) => channel.name === channelName
  );

  if (!channelExist) {
    message.guild.channels
      .create(channelName, {
        type: 'text',
      })
      .then((channel) => {
        message.guild.channels
          .create('REVISÃO', {
            type: 'GUILD_CATEGORY',
            permissionOverwrites: [
              {
                id: muterole.id,
                allow: ['VIEW_CHANNEL'],
              },
              {
                id: message.guild.roles.everyone,
                deny: ['VIEW_CHANNEL'],
              },
            ],
          })
          .then((category) => channel.setParent(category.id));
      })
      .catch();
  }
}
