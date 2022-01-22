import mongoose, { ObjectId } from 'mongoose';
import slugify from 'slugify';

// interface that describes the properties the model has
interface ICategoryModel extends mongoose.Model<ICategoryDoc>{

    // functions
    findByPriority(pos: number): any
}

// interface that describes the properties the doc has
interface ICategoryDoc extends mongoose.Document{

    name: string;
    title: string;
    code: string;
    description: string;
    priority: number;
    slug: string;

    skills: Array<mongoose.Schema.Types.ObjectId | any>;
    tools: Array<mongoose.Schema.Types.ObjectId | any>;
    user: mongoose.Schema.Types.ObjectId | any;

    // timestamps
    createdAt: string;
    updatedAt: string;
    _version: number;
    _id: mongoose.Schema.Types.ObjectId;
    id: mongoose.Schema.Types.ObjectId;

    // functions
    findByPriority(pos: number): any

}

const CategorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Category name is required']
        },

        description: {
            type: String,
            maxlength: [300, 'description cannot be more than 300 characters']
        },

        code: {
            type: String,
            maxlength: [4, 'code cannot be more than 4 characters'],
            minlength: [2, 'code cannot be less than 2 characters']
        },

        priority: {
            type: Number,
            default: 0
        },

        skills:[
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Skill'
            }
        ],

        tools: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Tool'
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

CategorySchema.set('toJSON', { getters: true, virtuals: true });

CategorySchema.pre<ICategoryDoc>('save', async function (next) {
    this.slug = slugify(this.name, { lower: true });
    next();
});

CategorySchema.statics.findByPriority = async (pos: number) => {
    return Category.findOne({priority: pos})
} 

// define the model variable constant
const Category = mongoose.model<ICategoryDoc, ICategoryModel>('Category', CategorySchema);

export default Category;