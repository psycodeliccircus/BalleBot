export default {
  name: 'clickButton',
  once: false,
  run: (client, button) => {
    client.Buttons.find(option =>
      button.id.startsWith(option.name.toLowerCase()))
      .run({ client, button })
  },
};
