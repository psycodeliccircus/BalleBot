export function downloadDatabase(message) {
  message.channel.send('Aqui está o banco: ', {
    files: ['json.sqlite'],
  });
}
