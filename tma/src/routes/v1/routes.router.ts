import express, { Request, Response, NextFunction } from 'express';

// import route files
import businessRoutes from './routers/business.router'
import talentRoutes from './routers/talent.router'
import userRoutes from './routers/user.router'

// create router
const router = express.Router();

// define routes
router.use('/users', userRoutes);
router.use('/talents', talentRoutes);
router.use('/businesses', businessRoutes);

router.get('/', (req: Request, res: Response, next: NextFunction) => {

    res.status(200).json({
        error: false,
        errors: [],
        message: 'successful',
        data: {
            name: 'tma-app-service',
            version: '1.0.0'
        },
        status: 200
    })

});

export default router;