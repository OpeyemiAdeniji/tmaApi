import mongoose, {mongo, ObjectId} from 'mongoose'
import slugify from 'slugify'

// interface that describes the properties the model has
interface IInterviewModel extends mongoose.Model<IInterviewDoc>{

    // functions
}

// interface that describes the properties the Doc has
interface IInterviewDoc extends mongoose.Document{

    scheduledAt: Date;
    startTime: Date;
    duration: string;
    type: string;
    address: string;
    isActive: boolean,
    slug: string,

    talent: mongoose.Schema.Types.ObjectId | any;
    business: mongoose.Schema.Types.ObjectId | any;

    // timestamps
    createdAt: string;
    updatedAt: string;
    _version: string;
    _id: mongoose.Schema.Types.ObjectId;
    id: mongoose.Schema.Types.ObjectId;

    // functions
}

const InterviewSchema = new mongoose.Schema(
    {
        scheduledAt: {
            type: Date
        },

        startTime: {
            type: Date
        },

        duration: {
            type: String
        },

        type: {
            type: String,
            enum: ['virtual', 'on-site'],
            required: [true, 'please select an interiew type']
        },

        address: {
            type: String
        },

        location: {
            type: String
        },

        isActive: {
            type: Boolean,
            default: false
        },

        slug: String,

        talent: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Talent'
        },

        business: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Business'
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

InterviewSchema.set('toJSON', { getters: true, virtuals: true });

InterviewSchema.pre<IInterviewDoc>('save', async function(next){
    this.slug = slugify('interview', { lower: true });
    next();
})

// define model constant
const Interview = mongoose.model<IInterviewDoc, IInterviewModel>('Interview', InterviewSchema)

export default Interview;
