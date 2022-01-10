import crypto from 'crypto';
import mongoose, { ObjectId } from 'mongoose';
import slugify from 'slugify';


interface IBankModel extends mongoose.Model<IBankDoc> {
    build(attrs: any): IBankDoc,
}

interface IBankDoc extends mongoose.Document {
    name: string;
    code: string;
    isEnabled: boolean;
    country: string;
    currency: string;
    type: string;
    slug: string;

    // time stamps
    createdAt: string;
    updatedAt: string;
    _version: number;
    _id: mongoose.Schema.Types.ObjectId;
    id: mongoose.Schema.Types.ObjectId;

    // props
    build(attrs: any): IBankDoc;
}

const BankSchema = new mongoose.Schema(

    {

        name:{
			type: String,
            required: [true, 'bank name is required']
		},

        code:{
			type: String,
            required: [true, 'bank code is required']
		},
		
		isEnabled: {
			type: Boolean,
            default: true
		},

        country:{
			type: String,
            default: 'Nigeria'
		},

        currency:{
			type: String,
            default: 'NGN'
		},

        type:{
			type: String,
            default: 'nuban'
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

BankSchema.set('toJSON', {getters: true, virtuals: true});

// Encrypt password using bcrypt
BankSchema.pre<IBankDoc>('save', async function (next) {
    this.slug = slugify(this.name, { lower: true });
	next()
});

// define the model
const Bank = mongoose.model<IBankDoc, IBankModel>('Bank', BankSchema);

export default Bank;