import crypto from 'crypto';
import mongoose, { ObjectId } from 'mongoose';
import slugify from 'slugify';


interface ILocationModel extends mongoose.Model<ILocationDoc> {
    
    findByLabel(label: string): ILocationDoc;

}

interface ILocationDoc extends mongoose.Document {

    label: string;
    placeId: string;
    vicinity: string;
    components: Array<object | any> | any;
    location: any;
    isEnabled: boolean;
    isAvailable: boolean;
    country: mongoose.Schema.Types.ObjectId | any;
    branchId: mongoose.Schema.Types.ObjectId | any;
    deliveryId: mongoose.Schema.Types.ObjectId | any;
    slug: string;

    // time stamps
    createdAt: string;
    updatedAt: string;
    _version: number;
    _id: mongoose.Schema.Types.ObjectId;
    id: mongoose.Schema.Types.ObjectId;

    // props
    findByLabel(label: string): ILocationDoc;
}

const LocationSchema = new mongoose.Schema(

    {

        label:{
			type: String,
		},

        placeId: {
            type: String,
        },

        vicinity: {
            type: String
        },

        components:[

            {
                type: Object
            }

        ],
			
        location: {
            type: Object
        },
		
		isEnabled: {
			type: Boolean,
            default: true
		},

        isAvailable: {
			type: Boolean,
            default: true
		},

        country:{
			type: mongoose.Schema.Types.ObjectId,
            ref: 'Country'
		},

        branchId: {
			type: mongoose.Schema.Types.ObjectId,
		},

        deliveryId: {
			type: mongoose.Schema.Types.ObjectId,
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

LocationSchema.set('toJSON', {getters: true, virtuals: true});

// Encrypt password using bcrypt
LocationSchema.pre<ILocationDoc>('save', async function (next) {
	next()
});

LocationSchema.statics.findByLabel = (name: string) => {
    return Location.findOne({name: name});
}

// define the model
const Location = mongoose.model<ILocationDoc, ILocationModel>('Location', LocationSchema);

export default Location;