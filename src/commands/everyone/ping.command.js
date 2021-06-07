export default {
  name: 'Ping',
  description: '',
  run: ({ message }) => {
    if (message.content === 'ping') message.reply('Pong');
  },
};
