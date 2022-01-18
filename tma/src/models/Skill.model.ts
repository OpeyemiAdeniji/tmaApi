import mongoose, { ObjectId } from 'mongoose';
import slugify from 'slugify';

// interface that describes the properties the model has
interface ISkillModel extends mongoose.Model<ISkillDoc>{

    // functions
    getAllSkills(): any
}

// interface that describes the properties the doc has
interface ISkillDoc extends mongoose.Document{

    primaryLanguage: string;
    secondaryLanguage: string;
    primaryFramework: string;
    secondaryFramework: string;
    primaryCloud: string;
    secondaryCloud: string;
    slug: string;

    languages: Array<mongoose.Schema.Types.ObjectId | any>;
    frameworks: Array<mongoose.Schema.Types.ObjectId | any>;
    clouds: Array<mongoose.Schema.Types.ObjectId | any>;
    user: mongoose.Schema.Types.ObjectId | any;

    // timestamps
    createdAt: string;
    updatedAt: string;
    _version: number;
    _id: mongoose.Schema.Types.ObjectId;
    id: mongoose.Schema.Types.ObjectId;

    // functions
    getAllSkills(): any

}

const SkillSchema = new mongoose.Schema(
    {
        primaryLanguage: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Language',
            required: [true, 'primary language is required']
        },

        secondaryLanguage: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Language',
            required: [true, 'secondary language is required']
        },

        languages: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Language',
            }
        ],

        primaryFramework: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Framework',
            required: [true, 'primary framework is required']
        },

        secondaryFramework: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Framework',
            required: [true, 'secondary framework is required']
        },

        frameworks: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Framework'
            }
        ],

        primaryCloud: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Cloud',
            required: [true, 'primary cloud platform is required']
        },

        secondaryCloud: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Cloud',
            required: [true, 'secondary cloud platform is required']
        },
        
        clouds: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Cloud'
            }
        ],

        slug: String,

        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
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

SkillSchema.set('toJSON', { getters: true, virtuals: true });

SkillSchema.pre('save', async function (next) {
    this.slug = slugify(this.primaryLanguage, { lower: true });
    next();
});

SkillSchema.statics.findById = async (id: any) => {
    return Skill.findOne({id: id})
} 

SkillSchema.statics.getAllSkills = () => {
    return Skill.find({});
}

// define the model variable constant
const Skill = mongoose.model<ISkillDoc, ISkillModel>('Skill', SkillSchema);

export default Skill;