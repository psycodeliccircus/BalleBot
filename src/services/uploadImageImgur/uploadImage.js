import imgur from 'imgur';

export async function uploadImage(message) {
  const anexo = message.attachments.find((anex) => anex.url);

  let urlUpload;
  imgur.setClientId(process.env.IMGUR_TOKEN);
  imgur.getClientId();
  await imgur
    .uploadUrl(anexo.url)
    .then((json) => {
      urlUpload = json.link;
    })
    .catch();

  return urlUpload;
}
