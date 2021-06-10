export default {
  name: 'Ping',
  description: '',
  permissions: ['KICK_MEMBERS'],
  run: ({ message }) => {
    message.reply('Pong!');
  },
};
