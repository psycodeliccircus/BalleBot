export function statusActivity(client) {
  const status = [
    'Radio CODE-FI',
    'the music of your life',
    'the best tunes',
  ];
  let i = 0;

  setInterval(() => {
    i = (i + 1) % status.length;
    client.user.setPresence({
      activity: {
        name: `🎵 ${status[i]}`,
        type: 'LISTENING',
      },
      status: 'online',
    });
  }, 5000);
}
