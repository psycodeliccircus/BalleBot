import { uploadImage } from '../../../services/uploadImageImgur/uploadImage.js';
import Colors from '../../../utils/layoutEmbed/colors.js';

export default {
  name: 'sendEmbed',
  description: `Comando para criar um embed para o sistema de cargos, envie o prefixo + sendEmbed + <channelID/#channel>`,
  permissions: ['staff'],
  aliases: ['sendEmbedRole', 'createEmbedRole', 'criarEmbed'],
  category: 'RolesSystem 👔',
  run: async ({ client, message, args, prefix }) => {
    const reactionEmoji = client.guilds.cache
      .get('836004917973614662')
      .emojis.cache.find((emoji) => emoji.name === 'sucess');

    const channel = message.guild.channels.cache.find(
      (chan) =>
        chan.id === args[0]?.replace(/(<)|(#)|(>)/g, '') ||
        chan.name === args[0]?.replace('@', '')
    );

    if (!channel || channel.type !== 'GUILD_TEXT') {
      return message.channel.send(
        `${message.author} Por favor, envie um canal de texto junto ao comando ${prefix}sendEmbed <channelID/#channel>`
      );
    }
    if (!channel.permissionsFor(client.user.id).has(['SEND_MESSAGES'])) {
      return message.channel.send(
        `${message.author} Eu não possuo permissão para enviar mensagens no canal ${channel}`
      );
    }

    const answers = [];

    let count = 0;

    const questions = [
      'Qual o título do embed?',
      'Qual a descrição do Embed?',
      'Envie a imagem do Embed ou apenas digite "não"',
    ];

    function inviteMessages(content) {
      message.channel.send({
        embeds: [
          {
            title: content,
            description: 'Digite no chat',
            color: Colors.pink_red,
          },
        ],
      });
      const filter = (m) => m.author.id === message.author.id;
      const collector = message.channel.createMessageCollector({
        filter,
        max: 1,
        time: 1000 * 60 * 2,
      });
      let answered = false;
      collector.on('collect', async (m) => {
        m.react(reactionEmoji);
        answered = true;
        if (count === 0) {
          if (m.content.length > 256) {
            return message.channel.send(
              'O título deve conter menos de 246 caracteres'
            );
          }
        }
        if (count === 1) {
          if (m.content.length > 5000) {
            return message.channel.send(
              'A descrição deve conter menos de 5000 caracteres'
            );
          }
        }
        if (count === 2) {
          if (m.attachments.size > 0) {
            const link = await uploadImage(m);
            answers.push(link[0]);
          }
        } else {
          answers.push(m.content);
        }
        count++;
        if (count < questions.length) {
          inviteMessages(questions[count]);
        } else {
          channel.send({
            embeds: [
              {
                color: Colors.pink_red,
                title: answers[0],
                description: answers[1],
                image: { url: answers[2] },
              },
            ],
          });
          message.channel.send({
            content: `${message.author} `,
            embeds: [
              {
                title: `Embed criado com sucesso no canal #${channel.name}!`,
              },
            ],
          });
        }
      });

      collector.on('end', () => {
        if (!answered) {
          message.channel.send(
            `${message.author} O tempo acabou e o comando foi cancelado`
          );
        }
      });
    }

    inviteMessages(questions[count]);
  },
};
