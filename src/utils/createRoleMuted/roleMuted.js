export async function roleMuted(event, nameRoleMuted) {
  let muterole = event.guild.roles.cache.find(
    (muteroleObj) => muteroleObj.name === nameRoleMuted
  );
  if (!muterole) {
    muterole = await event.guild.roles.create({
      name: nameRoleMuted,
      permissions: [],
    });

    event.guild.channels.cache.forEach(async (channel) => {
      channel.permissionOverwrites.edit(muterole.id, {
        VIEW_CHANNEL: false,
      });
    });
  }

  return muterole;
}
