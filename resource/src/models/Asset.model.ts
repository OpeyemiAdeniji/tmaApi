import crypto from 'crypto';
import mongoose, { ObjectId } from 'mongoose';
import slugify from 'slugify';


interface IAssetModel extends mongoose.Model<IAssetDoc> {

    findByName(name: any): IAssetDoc,
}

interface IAssetDoc extends mongoose.Document {

    name: string;
    type: string;
    data: object | string | any;
    isEnabled: boolean;

    // time stamps
    createdAt: string;
    updatedAt: string;
    _version: number;
    _id: mongoose.Schema.Types.ObjectId;
    id: mongoose.Schema.Types.ObjectId;

    // props
    findByName(name: any): IAssetDoc,
    
}

const AssetSchema = new mongoose.Schema(

    {

        name:{
			type: String,
            required: [true, 'asset name is required']
		},

        type:{
			type: String,
            required: [true, 'asset type is required'],
            enum: ['image', 'label']
		},
		
		isEnabled: {
			type: Boolean
		},

        data: {
            type: Object
        }

    },
    {

        timestamps: true,
		versionKey: '_version',
		toJSON: {
			transform(doc, ret){
				ret.id = ret._id
			}
		}

    }

)

AssetSchema.set('toJSON', {getters: true, virtuals: true});

// Encrypt password using bcrypt
AssetSchema.pre<IAssetDoc>('save', async function (next) {
	next()
});

// define the model
const Asset = mongoose.model<IAssetDoc, IAssetModel>('Asset', AssetSchema);

export default Asset;