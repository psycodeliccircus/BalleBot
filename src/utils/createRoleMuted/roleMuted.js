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
      await channel.overwritePermissions([
        {
          id: muterole.id,
          deny: ['SEND_MESSAGES', 'ADD_REACTIONS'],
        },
      ]);
    });
  }

  return muterole;
}
