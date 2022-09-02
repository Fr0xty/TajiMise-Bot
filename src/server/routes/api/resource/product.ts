import { Router } from 'express';
import TajiMiseClient from '../../../../bot/res/TajiMiseClient.js';
import { accessTokenCheck } from '../../../utils/accessTokenCheck.js';

const router = Router();

router.get('/product-list', accessTokenCheck, async (req, res) => {
    const productsCollection: FirebaseFirestore.QuerySnapshot = await TajiMiseClient.database
        .collection('products')
        .get();

    if (!productsCollection.size) return res.send([]);
    res.send(productsCollection.docs.map((product) => product.data()));
});

export default router;
