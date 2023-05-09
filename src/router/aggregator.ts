import { Request, Response, Router }    from 'express';

import { getPriceFor } from '../utils';


class AggregatorRouter {
    router: Router

    constructor() {
        this.router = Router();
        this.routes();
    }

    public async Reserves(req: Request, res: Response) {
        const token0 = req.params.token0;
        const token1 = req.params.token1;

        const price = await getPriceFor(token0, token1);
        return res.json({});
    }

    routes() {
        this.router.get('/pricefor/:token0/:token1', this.Reserves);
    }

}

// export
const aggregatorRoutes: AggregatorRouter = new AggregatorRouter();
aggregatorRoutes.routes();

export default aggregatorRoutes;