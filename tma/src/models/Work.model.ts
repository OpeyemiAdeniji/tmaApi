import mongoose, { ObjectId } from 'mongoose'
import slugify from 'slugify'

// interface that describes the properties the model has
interface IWorkModel extends mongoose.Model<IWorkDoc> {

    // functions
}

// interface that describes the properties that the Doc
interface IWorkDoc extends mongoose.Document{

    companyName: string;
    companyUrl: string;
    description: string;
    role: string;
    startDate: Date | string;
    endDate: Date | string;
    isCurrent: Boolean;
    slug: string;

    user: mongoose.Schema.Types.ObjectId | any;
    talent: mongoose.Schema.Types.ObjectId | any;

    // timestamps
    createdAt: string;
    updatedAt: string;
    _version: number;
    _id: mongoose.Schema.Types.ObjectId;
    id: mongoose.Schema.Types.ObjectId;

    // functions
}

const WorkSchema = new mongoose.Schema(
    
    {
        companyName: {
            type: String,
            required: [true, 'company name is required']
        },

        companyUrl: {
            type: String,
            required: [true, 'company url is required']
        },

        role: {
            type: String,
            required: [true, 'role is required']
        },

        description: {
            type: String
        },

        startDate: {
            type: Date
        },

        endDate: {
            type: Date
        },

        isCurrent: {
            type: Boolean,
            default: false
        },

        slug: String,

        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },

        talent: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Talent'
        },

    },

    {
        timestamps: true,
        versionKey: '_version',
        toJSON: {
            transform(doc, ret) {
                ret.id = ret._id
            }
        }
    }
)

WorkSchema.set('toJSON', {getters: true, virtuals: true});

WorkSchema.pre<IWorkDoc>('save', async function (next) {
    this.slug = slugify(this.companyName, { lower: true });
    next();
});

const Work = mongoose.model<IWorkDoc, IWorkModel>('Work', WorkSchema);

export default Work;