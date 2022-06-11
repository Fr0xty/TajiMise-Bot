/**
 * provides simple url to redirect to various resources
 */
import 'dotenv/config';
import { Router } from 'express';

const router = Router();

/**
 * redirect to respective oauth urls
 */
router.get('/oauth/:strategy', async (req, res) => {
    const { strategy } = req.params;

    switch (strategy) {
        case 'discord':
            res.redirect(process.env.DISCORD_OAUTH_URL!);
            break;

        default:
            return res.sendStatus(400);
    }
});

router.get('/discord-server', async (req, res) => {
    res.redirect(process.env.DISCORD_SERVER_INVITE_URL!);
});

export default router;
