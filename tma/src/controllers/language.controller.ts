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
export const getLanguage = asyncHandler(async(req: Request, res: Response, next: NextFunction) => {

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
}) 

// @desc           Add a Language
// @route          POST /api/tma/v1/languages
// @access         Private
export const addLanguage = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {

    const { name, code, description } = req.body;

    const existsByName = await Language.findOne({ name: name });

    if(existsByName){
        return next(new ErrorResponse('Error!', 400, ['language already exist. use another name']));
    }

    const existsByCode = await Language.findOne({ code: code });

    if(existsByCode){
        return next(new ErrorResponse('Error!', 400, ['language already exist. use another code']));
    }

    const language = await Language.create({
        name,
        code,
        description: description ? description : ''
    })

    res.status(200).json({
        error: false,
        errors: [],
        data: language,
        message: 'succesful',
        status: 200
    })
})

// @desc           Update a Language
// @route          PUT /api/tma/v1/languages/:id
// @access         Private
export const updateLanguage = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {

    const { name, code, description } = req.body;

    const language = await Language.findById(req.params.id);

    if(!language){
        return next(new ErrorResponse('Error', 404, ['language does not exist']))
    }

    const existsByName = await Language.findOne({ name: name });

    if(existsByName){
        return next(new ErrorResponse('Error!', 400, ['language already exist. use another name']));
    }

    const existsByCode = await Language.findOne({ code: code });

    if(existsByCode){
        return next(new ErrorResponse('Error!', 400, ['language already exist. use another code']));
    }

    language.name = name ? name : language.name;
    language.code = code ? code : language.code;
    language.description = description ? description : language.description;
    await language.save();

    res.status(200).json({
        error: false,
        errors: [],
        data: language,
        message: 'succesful',
        status: 200
    })

})