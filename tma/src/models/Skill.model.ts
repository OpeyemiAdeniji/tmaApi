import mongoose, { ObjectId } from 'mongoose';
import slugify from 'slugify';

// interface that describes the properties the model has
interface ISkillModel extends mongoose.Model<ISkillDoc>{

    // functions
    getPrimaryLanguage(): any;
    getPrimaryFramework(id: ObjectId): ISkillDoc;
    getAllSkills(id: ObjectId): ISkillDoc;
}

// interface that describes the properties the doc has
interface ISkillDoc extends mongoose.Document{

    primaryLanguage: string;
    secondaryLanguage: string;
    otherLanguages: Array<object>;
    primaryFramework: string;
    secondaryFramework: string;
    primaryCloud: string;
    secondaryCloud: string;
    slug: string;

    // timestamps
    createdAt: string;
    updatedAt: string;
    _version: number;
    _id: mongoose.Schema.Types.ObjectId;
    id: mongoose.Schema.Types.ObjectId;

    // functions
    getPrimaryLanguage(): any;
    getPrimaryFramework(id: ObjectId): ISkillDoc;
    getAllSkills(id: ObjectId): ISkillDoc;

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
        otherLanguage: [{
            type: String,
        }],
        primaryFramework: {
            type: String
        },
        secondaryFramework: {
            type: String
        },
        primaryCloud: {
            type: String,
        },
        secondaryCloud: {
            type: String
        },

        slug: String,
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