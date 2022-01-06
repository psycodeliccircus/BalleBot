import imgur from 'imgur';

export const uploadImage = (message) =>
  new Promise((resolve) => {
    const anexos = message.attachments;

    const linksImages = [];
    imgur.setClientId(process.env.IMGUR_TOKEN);
    imgur.getClientId();

    anexos.map(async (imageUrl) => {
      if (
        imageUrl.url.endsWith('.png') ||
        imageUrl.url.endsWith('.jpg') ||
        imageUrl.url.endsWith('.jpeg')
      ) {
        await imgur
          .uploadUrl(imageUrl.url)
          .then((json) => {
            linksImages.push(json.link);
          })
          .catch();

        if (linksImages.length === anexos.size) {
          resolve(linksImages);
        }
      }
    });
  });
