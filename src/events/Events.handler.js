import path from 'path';
import { Collection } from 'discord.js';
import { readdirSync } from 'fs';

const eventFolders = ['client'];

const EventHandler = () => {
  const returnCollection = new Collection();

  if (eventFolders) {
    eventFolders.forEach((folder) => {
      const folderPath = path.resolve(
        path.dirname(''),
        'src',
        'events',
        folder
      );

      const eventFiles = readdirSync(folderPath).filter((file) =>
        file.endsWith('.event.js')
      );

      eventFiles.forEach(async (file) => {
        const { default: command } = await import(`./${folder}/${file}`);
        returnCollection.set(command.name, command);
      });
    });
  }

  return returnCollection;
};

export default EventHandler;
