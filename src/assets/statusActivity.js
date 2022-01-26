export function statusActivity(client) {
  const status = ['Radio CODE-FI'];
  const i = 0;

  client.user.setActivity(`${status[i]}`, {
    type: 'LISTENING',
  });
}
