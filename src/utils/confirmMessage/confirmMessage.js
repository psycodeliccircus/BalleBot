export const confirmMessage = (message, messageAnt) =>
  new Promise((resolve) => {
    const reactions = ['✅', '❎', '🕵️‍♀️'];

    reactions.forEach((emojiReact) =>
      messageAnt.react(`${emojiReact}`).catch(() => {
        // the react function is asynchronous in nature, so a warning is thrown
        // after the user reacts faster and erases the old message
        // (which is the message to be reacted) and this ignores the warning.
      })
    );

    const filter = (reaction) => reactions.includes(reaction.emoji.name);

    const collector = messageAnt.createReactionCollector(filter, {
      time: 15000,
      dispose: true,
    });
    let messageReject = true;
    collector.on('collect', async (emojiAnt, userAnt) => {
      switch (emojiAnt.emoji.name) {
        case '✅':
          if (message.author.id === userAnt.id) {
            messageReject = false;
            resolve(true);
          }
          break;
        case '❎':
          if (message.author.id === userAnt.id) {
            messageReject = false;
            resolve(false);
          }
          break;
        case '🕵️‍♀️':
          if (message.author.id === userAnt.id) {
            messageReject = false;
            resolve('anonimo');
          }
          break;
        default:
          break;
      }
    });

    collector.on('end', async () => {
      if (messageReject) {
        message.channel
          .send({
            content: `${message.author} você não confirmou e o comando foi cancelado`,
          })
          .then((msg) => msg.delete({ timeout: 15000 }));
        resolve(false);
      }
    });
  });
