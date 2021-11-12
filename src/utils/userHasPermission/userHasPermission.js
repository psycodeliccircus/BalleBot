export function userHasPermission(
  client,
  message,
  commandName,
  commandIsPersonal,
  rolePerm
) {
  const commandToBeExecuted = client.Commands.get(commandName);
  const guildIdDatabase = new client.Database.table(
    `guild_id_${message.guild.id}`
  );

  const rolesPermissions = guildIdDatabase.get('admIds') || {};
  rolesPermissions.owner = message.guild.ownerID;

  const rolesUser = client.guilds.cache
    .get(message.guild.id)
    .members.cache.get(message.author.id)
    .roles.cache.map((role) => role.id);

  const namesOfRoles = Object.keys(rolesPermissions).reverse();

  const userHasPermissionOf = namesOfRoles.find((nameRole) => {
    if (rolesPermissions[nameRole]) {
      if (
        rolesUser.indexOf(rolesPermissions[nameRole]) > -1 ||
        message.author.id === rolesPermissions.owner ||
        message.member.hasPermission('ADMINISTRATOR')
      ) {
        return nameRole;
      }
    }
    return false;
  });

  const permissionIsTrueOrFalse = commandToBeExecuted?.permissions?.some(
    (permissionName) => {
      const dic = {
        owner: 4,
        staff: 3,
        mods: 2,
        padawans: 1,
        everyone: 0,
      };
      const positionUser = dic[userHasPermissionOf];
      const positionPermissionCommand = dic[permissionName];

      const args = message.content.split(/ +/);

      if (
        commandIsPersonal === false &&
        positionUser >= positionPermissionCommand
      ) {
        return true;
      }
      if (
        (commandIsPersonal === true && !args[1]) ||
        positionUser >= dic[rolePerm]
      ) {
        return true;
      }
      return false;
    }
  );
  return { userHasPermissionOf, permissionIsTrueOrFalse };
}
