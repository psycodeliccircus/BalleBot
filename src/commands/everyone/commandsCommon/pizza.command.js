export default {
  name: 'pizza',
  description: ` `,
  permissions: ['everyone'],
  aliases: [''],
  category: 'Utility ⛏️',
  dm: true,
  run: ({ message, client, args, prefix }) => {
    if (message.channel.type !== 'DM') return;

    message.channel.send({
      content:
        'Parabéns!!!! Eu adoro uma zueira não é mesmo? E pizza também!! 😆. Acho que foi muito fácil... Sua chave está logo aqui, no covil do guardião do monstro. Ache e vá pegar as outras (Ou termine o enigma!) https://github.com/tauz-hub',
    });
  },
};
