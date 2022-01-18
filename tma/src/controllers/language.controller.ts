import { Request, Response, NextFunction } from 'express';
import ErrorResponse from '../utils/error.util';
import { asyncHandler, strIncludesEs6 } from '@btffamily/tmat';

// import models
import Language from '../models/Language.model';

// @desc           Get all Languages
// @route          GET /api/tma/v1/languages
// @access         Private
export const getLanguages = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    res.status(200).json(res.advancedResults);
});

// @desc           Get a Language
// @route          GET /api/tam/v1/languages/:id
// @access         Private/Superadmin/Admin
export const getLanguage = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {

    const language = await Language.findById(req.params.id);

    if (!language) {
        return next(new ErrorResponse('Error', 404, ['cannot find the language']))
    }

    res.status(200).json({
        error: false,
        errors: [],
        data: language,
        message: 'successful',
        status: 200
    });
});