import mongoose, { ObjectId } from 'mongoose';
import slugify from 'slugify';
import User from './User.model';

// interface that describes the properties the model has
interface IEducationModel extends mongoose.Model<IEducationDoc> {
    
    // functions
    getAllEducation(): any;

}

// interface that describes the properties the doc has
interface IEducationDoc extends mongoose.Document{
    institutionName: string;
    degree: string;
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
    id: mongoose.Schema.Types.ObjectId

    // functions
    getAllEducation(): any;

}

const EducationSchema = new mongoose.Schema(
    {
        institutionName: {
            type: String,
            required: [true, 'institution name is required']
        },
        
        degree: {
            type: String,
            required: [true, 'degree is required']
        },

        startDate: {
            type: String,
        },

        endDate: {
            type: String,
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

EducationSchema.pre<IEducationDoc>('save', async function (next) {
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
