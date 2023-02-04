export function statusActivity(client) {
  const status = [
    'Radio CODE-FI',
    'the music of your life',
    'the best tunes',
  ];
  let i = 0;

  function setStatus() {
    i = (i + 1) % status.length;
    client.user.setPresence({
      activity: {
        name: `🎵 ${status[i]}`,
        type: 'LISTENING',
      },
      status: 'online',
    })
      .then(() => {
        console.log(`Status set to "${status[i]}"`);
      })
      .catch(error => {
        console.error(`Error setting status: ${error}`);
      });
  }

  setInterval(setStatus, 5000);
}

export function stopStatusActivity(client) {
  clearInterval(statusIntervalId);
}
