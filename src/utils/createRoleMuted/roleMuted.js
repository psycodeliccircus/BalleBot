export async function roleMuted(event, nameRoleMuted) {
  let muterole = event.guild.roles.cache.find(
    (muteroleObj) => muteroleObj.name === nameRoleMuted
  );
  if (!muterole) {
    muterole = await event.guild.roles.create({
      data: {
        name: nameRoleMuted,
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
