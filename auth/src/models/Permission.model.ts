import crypto from 'crypto';
import mongoose, { ObjectId } from 'mongoose';
import slugify from 'slugify';

// interface that describes the props the model has
interface IPermissionModel extends mongoose.Model<IPermissionDoc> {
    build(attrs: any): IPermissionDoc,
}

// interface that describes the props the doc (single record) has
interface IPermissionDoc extends mongoose.Document {

    name: string,
    description: string
    slug: string
    users: Array<mongoose.Schema.Types.ObjectId>

    // time stamps
    createdAt: string,
    updatedAt: string,
    _version: number;
	_id: mongoose.Schema.Types.ObjectId;
	id: mongoose.Schema.Types.ObjectId;

    //props
    build(attrs: any): IPermissionDoc,
    
}

const PermissionSchema = new mongoose.Schema(

    {
        name: {
            type: String
        },

        description: {
            type: String,
            required: [true, 'Please add a description'],
            maxlength: [100, 'Description cannot be more than 100 characters'],
        },

        slug: String

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

PermissionSchema.set('toJSON', {getters: true, virtuals: true});

// Encrypt password using bcrypt
PermissionSchema.pre('save', async function (next) {
	next()

});

// define the model
const Permission = mongoose.model<IPermissionDoc, IPermissionModel>('Permission', PermissionSchema);

export default Permission;