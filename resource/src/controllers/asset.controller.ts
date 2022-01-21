import { Request, Response, NextFunction } from 'express';
import ErrorResponse from '../utils/error.util';
import { asyncHandler, strIncludesEs6, strToArrayEs6, isString, isObject } from '@btffamily/tmaapp';
import { uploadBase64File } from '../utils/google.util'

// import models
import Asset from '../models/Asset.model';
import { generate } from '../utils/random.util';

// @desc        Get Assets
// @route       POST /api/resource/v1/assets
// @access      Public
export const getAssets = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
	res.status(200).json(res.advancedResults);
})

// @desc     Get an Asset
// @route    GET /api/resources/v1/assets/:id
// @access   Public
export const getAsset = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
	
	const asset = await Asset.findById(req.params.id);
 
   if (!asset) {
       return next(
           new ErrorResponse(`Not found`, 404, [`cnnot find asset`])
       );
   }
 
   res.status(200).json({
       error: false,
       errors: [],
       data: asset,
       message: `successful`,
       status: 200,
   });

})

// @desc     Add a Asset
// @route    POST /api/resources/v1/assets
// @access   Public
export const addAsset = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
	
	const { name, type, data, isEnabled } = req.body;

    const existing = await Asset.findOne({ name: name });

    if(existing){
        return next(new ErrorResponse('Error', 400, ['asset is already existing']));
    }

    const asset = await Asset.create({
        name,
        type,
        isEnabled
    });

    if(type === 'image'){

        if(!data) {
            return next(new ErrorResponse(`Error`, 400, ['image data is required']));
        }
    
        if(!isString(data)){
            return next(new ErrorResponse(`Eror!`, 400, ['image data should be a string']));
        }

        const mime = data.split(';base64')[0].split(':')[1];

        if(!mime || mime === '') {
            return next(new ErrorResponse(`invalid format`, 400, ['image data is is expected to be base64 string']));
        }

        // upload file
        const fileData = {
            file: data,
            filename: name,
            mimeType: mime
        }

        // upload to google cloud storage
        const gData = await uploadBase64File(fileData);

        asset.data = {
            selfLink: gData.selfLink,
            mediaLink: gData.mediaLink,
            name: gData.name,
            bucket: gData.bucket,
            url: gData.publicUrl,
            created: gData.timeCreated
        }

        await asset.save();

    }

    if(type === 'label'){

        if(!data) {
            return next(new ErrorResponse(`Error`, 400, ['label data is required']));
        }

        if(!isObject(data)){
            return next(new ErrorResponse(`Eror!`, 400, ['label data should be an object']));
        }

        asset.data = data;
        await asset.save();

    }

    res.status(200).json({
        error: false,
        errors: [],
        data: asset,
        message: `successful`,
        status: 200,
    });

})

// @desc     Remove an Asset
// @route    DELETE /api/resources/v1/assets/:id
// @access   Public
export const removeAsset = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {

    const asset = await Asset.findById(req.params.id);

    if(!asset){
        return next(new ErrorResponse('Error', 404, ['asset does not exist']));
    }

    await Asset.findByIdAndDelete(asset._id);

    res.status(200).json({
        error: false,
        errors: [],
        data: null,
        message: `successful`,
        status: 200,
    });
})

/** 
 * snippet
 * **/ 

// @desc        Login user (with verification)
// @route       POST /api/identity/v1/auth/login
// @access      Public
// export const funcd = asyncHandler(async (req: Request, res:Response, next: NextFunction) => {

// })