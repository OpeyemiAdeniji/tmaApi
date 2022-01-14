import mongoose, { ObjectId } from 'mongoose';
import slugify from 'slugify';
import User from './User.model';

// interface that describes the properties the model has
interface IEducationModel extends mongoose.Model<IEducationDoc> {
    
    // functions
    getAllEducation(): any;
    findById(id: ObjectId): IEducationDoc;

}

// interface that describes the properties the doc has
interface IEducationDoc extends mongoose.Document{
    institutionName: string;
    degree: string;
    startDate: string;
    endDate: string;
    isCurrent: Boolean;
    slug: string;

    user: mongoose.Schema.Types.ObjectId | any;

    // timestamps
    createdAt: string;
    updatedAt: string;
    _version: number;
    _id: mongoose.Schema.Types.ObjectId;
    id: mongoose.Schema.Types.ObjectId

    // functions
    getAllEducation(): any;
    findById(id: ObjectId): IEducationDoc;

}

const EducationSchema = new mongoose.Schema(
    {
        institutionName: {
            type: String,
            required: [true, 'Institution name is required']
        },
        
        degree: {
            type: String,
            required: [true, 'degree is required']
        },

        startDate: {
            type: String,
            required: [true, 'start date is required']
        },

        endDate: {
            type: String,
            required: [true, 'end date is required']
        },

        isCurrent: {
            type: Boolean,
            default: false
        },

        slug: String,

        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: User
        }
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

EducationSchema.set('toJSON', { getters: true, virtuals: true });

EducationSchema.pre('save', async function (next) {
    this.slug = slugify(this.institutionName, { lower: true });
    next();
});

EducationSchema.statics.findById = async (id: any) => {
    return Education.findOne({id: id})
} 

EducationSchema.statics.getAllEducation = () => {
    return Education.find({});
}

// define the model variable constant
const Education = mongoose.model<IEducationDoc, IEducationModel>('Education', EducationSchema);

export default Education;       
