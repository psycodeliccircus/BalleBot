import { verifyWarnCountUser } from '../../utils/verifyWarnCountUser/verifyWarnCountUser.js';

export async function messageWarnAndMute(message, client, messageMarked) {
  function messageDmAlert() {
    message.author
      .send({
        embeds: [
          {
            color: 'YELLOW',
            thumbnail: message.guild.iconURL(),
            title: `Você enviou uma mensagem suspeita em ${message.guild}:`,
            description: `**Um moderador irá rever seu caso! Por hora você está mutado**
            \n**Essa foi a mensagem:**
            ${messageMarked}`,
            fields: [
              {
                name: 'Mensagem enviada no canal:',
                value: message.channel,
              },
            ],
            timestamp: new Date(),
          },
        ],
      })
      .catch();
  }

  message.channel
    .send({
      content: `${message.author}`,
      embeds: [
        {
          color: 'YELLOW',
          title: `${message.author.tag} você usou uma palavra ou link proibido e recebeu +1 warn, não use novamente ou será banido⚠️`,
        },
      ],
    })
    .then((msg) => msg.delete({ timeout: 15000 }));

  const guildIdDatabase = new client.Database.table(
    `guild_id_${message.guild.id}`
  );

  if (guildIdDatabase.has(`user_id_${message.author.id}`)) {
    guildIdDatabase.push(
      `user_id_${message.author.id}.reasons`,
      `Palavra/Link proibido : ${messageMarked}`
    );
    guildIdDatabase.push(
      `user_id_${message.author.id}.dataReasonsWarns`,
      new Date()
    );
    guildIdDatabase.push(`user_id_${message.author.id}.autor`, client.user.id);
  } else {
    guildIdDatabase.set(`user_id_${message.author.id}`, {
      id: message.author.id,
      autor: [client.user.id],
      reasons: [`Palavra/Link proibido : ${messageMarked}`],
      dataReasonsWarns: [new Date()],
    });
  }

  if (guildIdDatabase.has('channel_log')) {
    const channel = client.channels.cache.get(
      guildIdDatabase.get('channel_log')
    );

    if (channel) {
      channel.send({
        embeds: [
          {
            color: 'YELLOW',
            title: `Usuário ${message.author.tag} enviou uma mensagem suspeita:`,
            timestamp: new Date(),
            author: {
              name: `${message.author.tag}`,
              icon_url: message.author.displayAvatarURL({ dynamic: true }),
              footer: { text: `ID do usuário: ${message.author.id}` },
              fields: [
                {
                  name: 'Essa foi a mensagem:',
                  value: messageMarked,
                },
                {
                  name: 'Mensagem enviada no canal:',
                  value: message.channel,
                },
              ],
              thumbnail: message.author.displayAvatarURL({ dynamic: true }),
            },
          },
        ],
      });
    }
  }
  verifyWarnCountUser(client, message, message.author.id);

  await message.delete();
  messageDmAlert();
}
