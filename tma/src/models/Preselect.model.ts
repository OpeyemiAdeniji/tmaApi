import crypto from 'crypto'
import mongoose, { ObjectId } from 'mongoose'
import slugify from 'slugify'

// interface that describes the properties the model
interface IPreselectModel extends mongoose.Model<IPreselectDoc> {

    // functions
    getAllPreselected(): any
    getPreselectToken(): any
}

// interface that describes the properties the Doc has
interface IPreselectDoc extends mongoose.Document{

    description: string,
    slug: string;

    preselectToken: string | undefined;
    preselectTokenExpire: Date | string | undefined;

    talents: Array<mongoose.Schema.Types.ObjectId | any>;
    business: mongoose.Schema.Types.ObjectId | any;
    createdBy: mongoose.Schema.Types.ObjectId | any;

    // timestamps
    createdAt: string;
    updatedAt: string;
    _version: string;
    _id: mongoose.Schema.Types.ObjectId;
    id: mongoose.Schema.Types.ObjectId;

    // functions
    getAllPreselected(): any
    getPreselectToken(): any
}

const PreselectSchema = new mongoose.Schema(

    {
        description: {
            type: String,
            required: [true, 'description is required']
        },

        talents: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Talent'
            }
        ],
     
        business: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Business'
        },

        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },

        slug: String,
        
        preselectToken: String,
        preselectTokenExpire: Date
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

PreselectSchema.set('toJSON', { getters: true, virtuals: true });

PreselectSchema.pre<IPreselectDoc>('save', async function(next){
    this.slug = slugify('talent' , { lower: true });
    next()
})

PreselectSchema.statics.getAllPreselected = () => {
    return Preselect.find({});
}

//Generate and hash activation token
PreselectSchema.methods.getPreselectToken = function () {
	// Generate token
	const token = crypto.randomBytes(20).toString('hex');

	// Hash the token and set to preselectToken field
	this.preselectToken = crypto
		.createHash('sha256')
		.update(token)
		.digest('hex');

	// Set expire
	this.preselectTokenExpire = Date.now() + 4320 * 60 * 1000; // 72 hours 

	return token;
};

// define the model constant
const Preselect = mongoose.model<IPreselectDoc, IPreselectModel>('Preselect', PreselectSchema);

export default Preselect;
