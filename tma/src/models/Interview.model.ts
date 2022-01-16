import mongoose, {mongo, ObjectId} from 'mongoose'
import slugify from 'slugify'

// interface that describes the properties the model has
interface IInterviewModel extends mongoose.Model<IInterviewDoc>{

    // functions
}

// interface that describes the properties the Doc has
interface IInterviewDoc extends mongoose.Document{

    scheduledAt: Date | string; 
    startTime: Date | string;
    duration: string;
    type: string;
    location: string;
    address: string;
    interviewUrl: string;
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
            required: [true, 'interview type is required']
        },

        address: {
            type: String
        },

        interviewUrl: {
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
    next();
})

// define model constant
const Interview = mongoose.model<IInterviewDoc, IInterviewModel>('Interview', InterviewSchema)

export default Interview;
