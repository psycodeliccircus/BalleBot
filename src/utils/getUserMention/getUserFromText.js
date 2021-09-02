export function getUserFromText(client, text) {
  const matchRegex = /((.)+(#)([0-9]{4}))|([0-9]{18})/;
  const userTagOrId = text.trim()?.match(matchRegex)[0] || text.id;
  console.log(text);
  const resultUser = client.users.cache.find((user) =>
    [user.tag, user.id].includes(userTagOrId)
  );
  return resultUser;
}
