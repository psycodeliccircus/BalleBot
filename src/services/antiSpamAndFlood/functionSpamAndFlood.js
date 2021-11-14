import { multiChannelFlood } from './multiChannelFlood.js';
import { singleChannelFlood } from './singleChannelFlood.js';

const it = {};
const maxMessageRep = 3;
export async function antiSpamAndFlood(client, message) {
  const messageDate = new Date();
  const valueMaxTimeInSeconds = 15;
  const idUser = message.author.id;
  const idChannel = message.channel.id;
  const contentMessage = message.content;

  if (it[idUser]) {
    const diffTime = Math.abs(it[idUser].time - new Date()) / 1000;

    if (diffTime > valueMaxTimeInSeconds) {
      delete it[idUser];
    }
  }
  if (it[idUser] && it[idUser].content === contentMessage) {
    // multichannel flood
    if (
      it[idUser].lastChannel !== idChannel &&
      it[idUser].content === contentMessage
    ) {
      it[idUser].idChannelRaid.push(idChannel);
      it[idUser].idMessageRaid.push(message.id);
      it[idUser].countRaid++;

<<<<<<< HEAD
      if (it[idUser].countRaid > maxMessageRep) {
=======
      if (it[idUser].countRaid > 3) {
>>>>>>> 04989e072c4acd55f45478f42097c060f6db6fbf
        await multiChannelFlood(client, message, it, maxMessageRep);

        delete it[idUser];
        return;
      }
    } else {
      it[idUser].countRaid = 1;
      it[idUser].idMessageRaid = [message.id];
      it[idUser].idChannelRaid = [idChannel];
    }
    // Flood in a Channel

    if (
      it[idUser].content === contentMessage &&
      it[idUser].lastChannel === idChannel
    ) {
      it[idUser].idFlood.push(message.id);
      it[idUser].countFlood++;

<<<<<<< HEAD
      if (it[idUser].countFlood > maxMessageRep) {
=======
      if (it[idUser].countFlood > 3) {
>>>>>>> 04989e072c4acd55f45478f42097c060f6db6fbf
        await singleChannelFlood(client, message, it, maxMessageRep);

        delete it[idUser];
      }
    } else {
      it[idUser].idFlood = [message.id];
      it[idUser].countFlood = 1;
    }
    if (it[idUser]) it[idUser].lastChannel = idChannel;
  } else {
    it[idUser] = {
      lastChannel: idChannel,
      content: message.content,
      time: messageDate,
      countFlood: 1,
      idFlood: [message.id],
      countRaid: 1,
      idMessageRaid: [message.id],
      idChannelRaid: [idChannel],
    };
  }
}
