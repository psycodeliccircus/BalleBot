import { roleMuted } from '../../utils/createRoleMuted/roleMuted.js';

export async function checkIfItIsMutated(client, memberAdd) {
  const guildUndefinedMutated = new client.Database.table(
    `guild_users_mutated_${memberAdd.guild.id}`
  );
  const guildIdDatabase = new client.Database.table(
    `guild_id_${memberAdd.guild.id}`
  );
  const tableTemporarilyMutated = new client.Database.table(
    `tableTemporarilyMutated`
  );
  const muterole = await roleMuted(memberAdd, 'MutedBallebot');
  guildIdDatabase.set('roleMutedId', muterole.id);

  guildIdDatabase.set('roleMutedId', muterole.id);
  if (
    guildUndefinedMutated.has(`user_id_${memberAdd.user.id}`) ||
    tableTemporarilyMutated.has(
      `guild_id_${memberAdd.guild.id}_user_id_${memberAdd.user.id}`
    )
  ) {
    const userMember = client.guilds.cache
      .get(memberAdd.guild.id)
      .members.cache.get(memberAdd.id);

    await userMember.roles.add(muterole.id);
  }
}
