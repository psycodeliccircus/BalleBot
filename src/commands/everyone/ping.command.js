export default {
  name: 'Ping',
  description: '',
  permissions: [],
  run: ({ message }) => {
    message.reply('Pong!');
  },
};
