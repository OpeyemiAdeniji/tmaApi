import express, { Request, Response, NextFunction } from 'express';

// import route files
import authRoutes from './routers/auth.router'
import emailRoutes from './routers/email.router'
import notifyRoutes from './routers/notify.router'
import userRoutes from './routers/user.router'


// create router
const router = express.Router();

// define routes
router.use('/auth', authRoutes);
router.use('/emails', emailRoutes);
router.use('/notify', notifyRoutes);
router.use('/users', userRoutes);

router.get('/', (req: Request, res: Response, next: NextFunction) => {

    res.status(200).json({
        error: false,
        errors: [],
        message: 'successful',
        data: {
            name: 'tma-identity-service',
            version: '1.0.0'
        },
        status: 200
    })

});

export default router;