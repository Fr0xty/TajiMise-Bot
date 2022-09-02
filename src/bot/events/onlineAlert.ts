import TajiMiseClient from '../res/TajiMiseClient.js';

TajiMiseClient.on('ready', async () => {
    console.log(`Logged into ${TajiMiseClient.user!.tag}!`);
});
