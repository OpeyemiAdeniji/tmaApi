import ErrorResponse from '../utils/error.util';
import { Request, Response, NextFunction } from 'express'
import User from '../models/User.model'

import { asyncHandler, protect as AuthCheck, authorize as Authorize } from '@btffamily/tmaapp';

declare global {
    namespace Express{
        interface Request{
            user?: any;
        }
    }
}

export const protect = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {

    try {

        let authCheck: any;
        // await AuthCheck(req, process.env.JWT_SECRET).then((resp) => {
        //     authCheck = resp || null
        // })

        authCheck = AuthCheck(req, process.env.JWT_SECRET || '');

        // make sure token exists
        if(authCheck === null){
            return next(new ErrorResponse('Invalid token', 401, ['user not authorized to access this route']))
        }

        req.user = await User.findOne({ _id: authCheck.id });

        if(req.user){
            return next();
        }else{
            return next(new ErrorResponse('Invalid token', 401, ['user not authorized to access this route']))
        }
        
    } catch (err) {

        // console.log(err);
        return next(new ErrorResponse('Error!', 401, ['user not authorized to access this route']))
        
    }

})

export const authorize = (roles: Array<string>) => {

    let authPermit: boolean;

    return asyncHandler(async (req: Request, res: Response, next: NextFunction) => {

        const user = req.user;

        if(!user){
            return next (new ErrorResponse('unauthorized!', 401, ['user is not signed in']))
        }

        await Authorize(roles, user.roles, process.env.AUTH_TYPE || 'development', process.env.MONGODB_URI || '').then((resp: any) => {
            authPermit = resp;
        });

        // console.log(authPermit);

        if(!authPermit){
            return next (new ErrorResponse('unauthorized!', 401, ['user is not authorized to access this route']))
        }else{
            return next();
        }

    })

}