import { Request } from 'express';
import { decryptedAccessToken } from 'tajimise';

declare module 'express-serve-static-core' {
    export interface Request {
        accessToken: decryptedAccessToken;
    }
}
