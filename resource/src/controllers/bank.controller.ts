import { Request, Response, NextFunction } from 'express';
import ErrorResponse from '../utils/error.util';
import { asyncHandler, strIncludesEs6, strToArrayEs6 } from '@btffamily/tmat';

// import models
import Bank from '../models/Bank.model';
import { generate } from '../utils/random.util';

// @desc        Register user
// @route       POST /api/identity/v1/auth/register
// @access      Public
export const getBanks = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
	res.status(200).json(res.advancedResults);
})

// @desc     Get a bank
// @route    GET /api/resources/v1/banks/:id
// @access   Public
export const getBank = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
	
	const bank = await Bank.findById(req.params.id);
 
   if (!bank) {
       return next(
           new ErrorResponse(`Not found`, 404, [`Cannot find bank`])
       );
   }
 
   res.status(200).json({
       error: false,
       errors: [],
       data: bank,
       message: `successful`,
       status: 200,
   });

})

// @desc     Add a bank
// @route    POST /api/resources/v1/banks
// @access   Private
export const createBank = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
	
	

})

/** 
 * snippet
 * **/ 

// @desc        Login user (with verification)
// @route       POST /api/identity/v1/auth/login
// @access      Public
// export const funcd = asyncHandler(async (req: Request, res:Response, next: NextFunction) => {

// })