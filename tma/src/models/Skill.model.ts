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

    languages: Array<string | any>;
    frameworks: Array<string | any>;
    clouds: Array<string | any>;
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
            type: String,
            required: [true, 'primary language is required']
        },

        secondaryLanguage: {
            type: String,
            required: [true, 'secondary language is required']
        },

        languages: [
            {
                type: String,
            }
        ],

        primaryFramework: {
            type: String,
            required: [true, 'primary framework is required']
        },

        secondaryFramework: {
            type: String,
            required: [true, 'secondary framework is required']
        },

        frameworks: [
            {
                type: String,
            }
        ],

        primaryCloud: {
            type:String,
            required: [true, 'primary cloud platform is required']
        },

        secondaryCloud: {
            type:String,
            required: [true, 'secondary cloud platform is required']
        },
        
        clouds: [
            {
                type: String,
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