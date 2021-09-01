export default {
  name: 'olhando',
  description: '',
  permissions: [],
  run: async ({ message }) => {
    await message.react('👀');
  },
};
