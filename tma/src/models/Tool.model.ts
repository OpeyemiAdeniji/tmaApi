import mongoose, { ObjectId } from 'mongoose';
import slugify from 'slugify';

// interface that describes the properties the model has
interface IToolModel extends mongoose.Model<IToolDoc>{

    // functions
    getAllTools(): any
}

// interface that describes the properties the doc has
interface IToolDoc extends mongoose.Document{

    name: string;
    brand: string;
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
    getAllTools(): any

}

const ToolSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'name is required']
        },

        brand: {
            type: String
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

ToolSchema.set('toJSON', { getters: true, virtuals: true });

ToolSchema.pre<IToolDoc>('save', async function (next) {
    this.slug = slugify(this.name, { lower: true });
    next();
});

ToolSchema.statics.findById = async (id: any) => {
    return Tool.findOne({id: id})
} 

ToolSchema.statics.getAllTools = () => {
    return Tool.find({});
}

// define the model variable constant
const Tool = mongoose.model<IToolDoc, IToolModel>('Tool', ToolSchema);

export default Tool;