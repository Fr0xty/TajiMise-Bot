import { Request } from 'express';
import TajiMiseClient from '../res/TajiMiseClient.js';

export const isAdmin = async (req: Request, adminHandle: string): Promise<boolean> => {
    const { strategy } = req.signedCookies;
    const { uid } = req.accessToken;

    const userDocData = await TajiMiseClient.database
        .collection('admin')
        .where('user_id', '==', { [strategy]: uid })
        .where('profile.handle', '==', adminHandle)
        .get();

    if (userDocData.empty) return false;
    return true;
};
