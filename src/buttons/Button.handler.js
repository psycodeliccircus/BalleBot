import path from 'path';
import { readdirSync } from 'fs';
import { Collection } from 'discord.js';

const commandFolders = ['championship'];

function genCommand(folder, returnCollection) {
  const folderPath = path.resolve(path.dirname(''), 'src', 'buttons', folder);

  const commandFiles = readdirSync(folderPath, { withFileTypes: true });
  commandFiles.forEach(async (file) => {
    if (file.isDirectory()) {
      genCommand(path.join(folder, file.name), returnCollection);
      return;
    }
    if (!file.name.endsWith('button.js')) return;
    const name = `./${path.join('.', folder, file.name).replace(/\\/g, '/')}`;

    try {
      const { default: command } = await import(`${name}`);
      command.name = command.name.toLowerCase();
      returnCollection.set(command.name, command);
    } catch (e) {
      console.log('error:', name, e);
    }
  });
}

const ButtonHandler = () => {
  const returnCollection = new Collection();

  if (commandFolders) {
    commandFolders.forEach((folder) => genCommand(folder, returnCollection));
  }

  return returnCollection;
};

export default ButtonHandler;
