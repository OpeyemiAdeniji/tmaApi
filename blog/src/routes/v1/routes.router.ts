import express, { Request, Response, NextFunction } from 'express';

// import route files
import categoryRoutes from './routers/category.router'
import commentRoutes from './routers/comment.router'
import postRoutes from './routers/post.router'
import tagRoutes from './routers/tag.router';
import userRoutes from './routers/user.router';

// create router
const router = express.Router();

// define routes
router.use('/categories', categoryRoutes);
router.use('/comments', commentRoutes);
router.use('/posts', postRoutes);
router.use('/tags', tagRoutes);
router.use('/users', userRoutes);

router.get('/', (req: Request, res: Response, next: NextFunction) => {

    res.status(200).json({
        error: false,
        errors: [],
        message: 'successful',
        data: {
            name: 'tma-blog-service',
            version: '1.0.0'
        },
        status: 200
    })

});

export default router;