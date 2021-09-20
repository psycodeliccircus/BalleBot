export default {
  name: 'startnotify',
  description: 'Vai enviar mensagens para tomar água a cada 1 minuto.',
  event: 'campeonato',
  category: 'Championship 🏅',
  permissions: ['staff'],
  run: async ({ message }) => {
    setInterval(() => {
      message.channel.send('→Bebam Água←');
    }, 1000);
  },
};
