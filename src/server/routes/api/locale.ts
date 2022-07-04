import { Router } from 'express';
import { setLocaleCookie } from '../../utils/setCookies.js';

const router = Router();

/**
 * get language code from given locale cookie
 */
router.get('/', async (req, res) => {
    const { locale } = req.signedCookies;

    if (!locale) return res.sendStatus(404);
    res.send(locale);
});

/**
 * set locale cookie
 */
router.post('/set', async (req, res) => {
    const languageCode = req.query['language-code']?.toString();
    if (!languageCode) return res.status(400).send('Please provide a language code.');

    const acceptedLanguageCode = ['en', 'ja', 'zh-cn', 'zh-tw'];
    if (!acceptedLanguageCode.includes(languageCode)) return res.status(400).send('Unsupported language code.');

    await setLocaleCookie(res, languageCode);
    res.sendStatus(200);
});

export default router;
