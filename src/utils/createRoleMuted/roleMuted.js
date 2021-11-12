export async function roleMuted(event) {
  let muterole = event.guild.roles.cache.find(
    (muteroleObj) => muteroleObj.name === 'muted'
  );
  if (!muterole) {
    muterole = await event.guild.roles.create({
      data: {
        name: 'muted',
        color: 'ligth_brown',
        permissions: [],
      },
    });

    event.guild.channels.cache.forEach(async (channel) => {
      channel.updateOverwrite(muterole, {
        VIEW_MESSAGES: false,
        SEND_MESSAGES: false,
        VIEW_CHANNEL: false,
      });
    });
  }

  return muterole;
}
