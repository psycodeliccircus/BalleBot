export function downloadDatabase(message) {
  message.channel.send({
    content: 'Aqui está o banco: ',
    files: ['json.sqlite'],
  });
}
