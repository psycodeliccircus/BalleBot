export default {
  name: 'cagatayulusoy',
  description: ` `,
  permissions: ['everyone'],
  aliases: ['cagatay'],
  category: 'Utility ⛏️',
  dm: true,
  run: ({ message, client, args, prefix }) => {
    if (message.channel.type !== 'DM') return;

    message.channel.send({
      ephemeral: true,
      content:
        'O guardião gosta de comer, ele adora comer, programar tomates e recheios, ele sai todo sábado, em busca da chave para encontrar. O que ele come? dica (Palazzo Conte Federico)',
    });
  },
};
