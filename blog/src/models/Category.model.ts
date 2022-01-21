import mongoose, { ObjectId } from 'mongoose'
import slugify from 'slugify'

// interface that describes the properties the model has
interface ICategoryModel extends mongoose.Model<ICategoryDoc> {

    // functions

}

// interface that describes the properties that the Doc has
interface ICategoryDoc extends mongoose.Document{

    name: string;
    description: string;
    slug: string;

    talents: Array<mongoose.Schema.Types.ObjectId | any>;
    user: mongoose.Schema.Types.ObjectId | any;
    interviews: Array<mongoose.Schema.Types.ObjectId | any>;
    preselects: Array<mongoose.Schema.Types.ObjectId | any>;

    // time stamps
    createdAt: string;
    updatedAt: string;
    _version: number;
    _id: mongoose.Schema.Types.ObjectId;
    id: mongoose.Schema.Types.ObjectId;

    // functions

}

const CategorySchema = new mongoose.Schema (

    {

        name: {
            type: String,
            required: [true, 'name is required']
        },

        description: {
            type: String
        },

        slug: String,

        talents: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Talent'
            }
        ],

        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },

        interviews: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Interview'
            }
        ],

        preselects: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Preselect'
            }
        ],

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

CategorySchema.set('toJSON', { getters: true, virtuals: true });

CategorySchema.pre<ICategoryDoc>('save', async function(next){
    this.slug = slugify(this.name, { lower: true });
    next();
});

CategorySchema.statics.getAllCategories = () => {
    return Category.find({});
}

// define the model constant
const Category = mongoose.model<ICategoryDoc, ICategoryModel>('Category', CategorySchema);

export default Category;