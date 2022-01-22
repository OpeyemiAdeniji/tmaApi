import mongoose, { ObjectId } from 'mongoose';
import slugify from 'slugify';

// interface that describes the properties the model has
interface ISkillModel extends mongoose.Model<ISkillDoc>{

    // functions
    getAllSkills(): any
}

// interface that describes the properties the doc has
interface ISkillDoc extends mongoose.Document{

    name: string;
    shortCode: string;
    description: string;
    slug: string;

    talents: Array<mongoose.Schema.Types.ObjectId | any>;
    category: mongoose.Schema.Types.ObjectId | any;
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
        name: {
            type: String,
            required: [true, 'name is required']
        },

        shortCode: {
            type: String,
            maxlength: [3, 'short code cannot be more than 3 characters']
        },

        description: {
            type: String,
            maxlength: [300, 'description cannot be more than 300 characters']
        },

        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category'
        },

        slug: String,

        talents: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            }
        ],

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

SkillSchema.pre<ISkillDoc>('save', async function (next) {
    this.slug = slugify(this.name, { lower: true });
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