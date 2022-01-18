import express, { Request, Response, NextFunction } from 'express';

// import route files
import businessRoutes from './routers/business.router'
import talentRoutes from './routers/talent.router'
import userRoutes from './routers/user.router'
import languageRoutes from './routers/language.router';
import educationRoutes from './routers/education.router';
import interviewRoutes from './routers/interview.router';
import preselectRoutes from './routers/preselect.router';
import skillRoutes from './routers/skill.router';
import frameworkRoutes from './routers/framework.router';
import cloudRoutes from './routers/cloud.router';
import industryRoutes from './routers/industry.router';
import workRoutes from './routers/work.router';

// create router
const router = express.Router();

// define routes
router.use('/users', userRoutes);
router.use('/talents', talentRoutes);
router.use('/languages', languageRoutes);
router.use('/businesses', businessRoutes);
router.use('/education', educationRoutes);
router.use('/interviews', interviewRoutes);
router.use('/preselects', preselectRoutes);
router.use('/skills', skillRoutes);
router.use('/frameworks', frameworkRoutes);
router.use('/clouds', cloudRoutes);
router.use('/industries', industryRoutes);
router.use('/works', workRoutes);

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