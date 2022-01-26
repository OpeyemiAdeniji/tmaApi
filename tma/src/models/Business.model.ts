import mongoose, { ObjectId } from 'mongoose'
import slugify from 'slugify'

// interface that describes the properties the model has
interface IBusinessModel extends mongoose.Model<IBusinessDoc> {

    // functions
    getAllBusinesss(): any

}

// interface that describes the properties that the Doc has
interface IBusinessDoc extends mongoose.Document{

    name: string;
    industry: string;
    email: string,
    phoneNumber: string;
    location: string;
    placeId: string;
    address: string;
    businessType: string;
    slug: string;
    websiteUrl: string;
    passwordType: string;

    talents: Array<mongoose.Schema.Types.ObjectId | any>;
    user: mongoose.Schema.Types.ObjectId | any;
    interviews: Array<mongoose.Schema.Types.ObjectId | any>;
    preselects: Array<mongoose.Schema.Types.ObjectId | any>;

    // time stamps
    createdAt: string;
    updatedAt: string;
    _version: number;
    _id: mongoose.Schema.Types.ObjectId;
    id: mongoose.Schema.Types.ObjectId;

    // functions
    getAllBusinesss(): any


}

const BusinessSchema = new mongoose.Schema (

    {

        name: {
            type: String,
            required: [true, 'name is required']
        },

        industry: {
            type: String
        },

        email: {
			type: String
		},

        phoneNumber: {
            type: String
        },

        location: {
            type: String
        },

        placeId: {
            type: String
        },

        address: {
            type: String,
            required: [true, 'address is required']
        },

        businessType: {
            type: String,
            enum: ['business', 'third-party']
        },

        passwordType:{
            type: String,
            enum: ['generated', 'self', 'self-changed']
        },

        websiteUrl: {
            type: String,
        },

        slug: String,

        talents: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Talent'
            }
        ],

        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },

        interviews: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Interview'
            }
        ],

        preselects: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Preselect'
            }
        ],

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

BusinessSchema.set('toJSON', { getters: true, virtuals: true });

BusinessSchema.pre<IBusinessDoc>('save', async function(next){
    this.slug = slugify(this.name, { lower: true });
    next();
});

BusinessSchema.statics.getAllBusinesss = () => {
    return Business.find({});
}

// define the model constant
const Business = mongoose.model<IBusinessDoc, IBusinessModel>('Business', BusinessSchema);

export default Business;
