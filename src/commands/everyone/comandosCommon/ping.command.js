import Colors from '../../../utils/layoutEmbed/colors.js';
import Icons from '../../../utils/layoutEmbed/iconsMessage.js';

export default {
  name: 'ping',
  description: `comando de ping para saber a latência, para usar digite <prefix>ping`,
  permissions: ['everyone'],
  aliases: ['pong', 'peng'],
  dm: true,
  category: 'Utility ⛏️',
  run: ({ message, client }) => {
    message.channel.send({ content: 'Loading' }).then((msg) => {
      const timestampDiff = msg.createdTimestamp - message.createdTimestamp;

      msg.edit({
        embeds: [
          {
            color: Colors.pink_red,
            thumbnail: Icons.wifi,
            title: `🏓Pong!`,
            description: `A sua latência é ${timestampDiff}ms. A latência da API é ${Math.round(
              client.ws.ping
            )}ms`,
            timestamp: new Date(),
          },
        ],
      });
    });
  },
};
