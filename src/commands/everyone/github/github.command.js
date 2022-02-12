import axios from 'axios';
import Discord from 'discord.js';
import Colors from '../../../utils/commandsFunctions/layoutEmbed/colors.js';
import { parseDateForDiscord } from '../../../utils/commandsFunctions/TimeMessageConversor/parseDateForDiscord.js';

export default {
  name: 'github',
  description: `Pesquise usuários no github e veja diretamente pelo discord`,
  permissions: ['everyone'],
  aliases: ['git'],
  dm: true,
  category: 'Utility ⛏️',
  run: async ({ message, client, args }) => {
    if (args.join(' ').length < 4) {
      return message.channel.send({
        content: `${message.author} Você precisa dar pelo menos 4 letras para pesquisar um github`,
      });
    }

    const getBreeds = async () => {
      try {
        const queryString = `q=${encodeURIComponent(args.join(' '))}+in:user`;
        return await axios.get(
          `https://api.github.com/search/users?${queryString}`,
          {
            headers: {
              Authorization: `token ${process.env.GITHUB_TOKEN}`,
            },
          }
        );
      } catch (e) {
        return message.channel.send({
          content: `${message.author} estou sem conexão com o github, aguarde um pouco!`,
        });
      }
    };

    const users = [];

    const breeds = await getBreeds();

    const userBru = breeds.data.items;
    if (!userBru || userBru?.length === 0) {
      return message.channel.send({
        content: `${message.author} Não encontrei o usuário, digite corretamente o usuário`,
      });
    }

    if (userBru.length >= 25) userBru.length = 25;

    try {
      for (let index = 0; index < userBru.length; index++) {
        await axios
          .get(`https://api.github.com/users/${userBru[index].login}`, {
            headers: {
              Authorization: `token ${process.env.GITHUB_TOKEN}`,
            },
          })
          .then((user) => {
            users.push(user.data);
          });
      }
    } catch (e) {
      return message.channel.send({
        content: `${message.author} estou sem conexão com o github, aguarde um pouco!`,
      });
    }

    const menu = new Discord.MessageSelectMenu()
      .setCustomId('search_menu')
      .setPlaceholder('Escolha o user')
      .setMinValues(1)
      .setMaxValues(1)
      .addOptions(
        users.map((user) => {
          // eslint-disable-next-line no-param-reassign
          if (user.bio?.length >= 70) user.bio = user.bio.slice(0, 70);

          const titleLabel = user.name
            ? `${user.name} (${user.login})`
            : user.login;
          return {
            label: titleLabel,
            description: user.bio,
            value: user.id.toString(),
          };
        })
      );

    const msg = await message.channel.send({
      content: `${message.author} Eu encontrei esses usuários, selecione um:`,
      components: [new Discord.MessageActionRow().addComponents([menu])],
    });

    const coletor = msg.createMessageComponentCollector({
      filter: (i) => i.user.id === message.author.id,
      max: 1,
      time: 1 * 1000 * 60,
    });

    coletor.on('collect', async (collect) => {
      const myUser = users.find((u) => u.id.toString() === collect.values[0]);

      const emoji = client.emojis.cache.get('941841017227857941');

      const btn = new Discord.MessageButton()
        .setStyle('LINK')
        .setLabel('SEGUIR')
        .setURL(myUser.html_url);

      msg.channel.send({
        components: [new Discord.MessageActionRow().addComponents([btn])],
        content: `${message.author}`,
        embeds: [
          {
            color: Colors.black,
            thumbnail: { url: myUser.avatar_url },
            title: `${emoji} ${myUser.login}`,

            fields: [
              {
                name: 'Nome:',
                value: myUser.name || 'Não definido',
                inline: true,
              },
              {
                name: 'Email:',
                value: myUser.email || 'Não definido',
                inline: true,
              },
              {
                name: 'Descrição:',
                value: myUser.bio || 'Não definida',
              },
              {
                name: 'Site Blog:',
                value: myUser.blog || 'Não definido',
                inline: true,
              },
              {
                name: 'Localização:',
                value: myUser.location || 'Não definido',
              },
              {
                name: 'Followers:',
                value: myUser.followers.toString() || 'Não definido',
                inline: true,
              },
              {
                name: 'Following:',
                value: myUser.following.toString() || 'Não definido',
                inline: true,
              },
              {
                name: 'Entrou no Github em:',
                value: parseDateForDiscord(myUser.created_at) || 'Não definido',
              },
            ],
            timestamp: new Date(),
          },
        ],
      });
    });
    coletor.on('end', async () => {
      msg.delete();
    });
  },
};
