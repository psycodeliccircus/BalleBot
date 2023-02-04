export function statusActivity(client) {
  const status = ['Radio CODE-FI'];
  let i = 0;

  setInterval(() => {
    i = (i + 1) % status.length;
    client.user.setActivity(`🎵 ${status[i]}`, {
      type: 'LISTENING',
    });
  }, 5000);
}
