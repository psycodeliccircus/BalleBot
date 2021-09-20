export function getUserFromText(client, text) {
  const matchRegex = /((.)+(#)([0-9]{4}))|([0-9]{18})/;
  console.log(text);
  const userTagOrId = text.trim()?.match(matchRegex)
    ? text.trim()?.match(matchRegex)[0]
    : text.id;
  const resultUser = client.users.cache.find((user) =>
    [user.tag, user.id].includes(userTagOrId)
  );
  return resultUser;
}
