export async function removeMuteRole(client, oldMember, newMember) {
  const oldRoles = oldMember.roles.cache.map((value) => value.id);
  const newRoles = newMember.roles.cache.map((value) => value.id);

  const guildUndefinedMutated = new client.Database.table(
    `guild_users_mutated_${oldMember.guild.id}`
  );
  const tableTemporarilyMutated = new client.Database.table(
    `tableTemporarilyMutated`
  );
  const guildIdDatabase = new client.Database.table(
    `guild_id_${oldMember.guild.id}`
  );
  const roleRemoved = oldRoles
    .filter((role) => !newRoles.includes(role))
    .toString();
  const roleMutedId = guildIdDatabase.get('roleMutedId');

  if (roleRemoved === roleMutedId) {
    if (guildUndefinedMutated.has(`user_id_${oldMember.id}`)) {
      return guildUndefinedMutated.delete(`user_id_${oldMember.id}`);
    }
    if (
      tableTemporarilyMutated.has(
        `guild_id_${oldMember.guild.id}_user_id_${oldMember.id}`
      )
    ) {
      return tableTemporarilyMutated.delete(`user_id_${oldMember.id}`);
    }
  }
}
