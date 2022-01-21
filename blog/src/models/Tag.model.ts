import mongoose, { ObjectId } from 'mongoose'
import slugify from 'slugify'

// interface that describes the properties the model has
interface ITagModel extends mongoose.Model<ITagDoc> {

    // functions
}

// interface that describes the properties that the Doc has
interface ITagDoc extends mongoose.Document{

    title: string;
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

const TagSchema = new mongoose.Schema (

    {

        title: {
            type: String,
            required: [true, 'title is required']
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

TagSchema.set('toJSON', { getters: true, virtuals: true });

TagSchema.pre<ITagDoc>('save', async function(next){
    this.slug = slugify(this.title, { lower: true });
    next();
});

TagSchema.statics.getAllTags = () => {
    return Tag.find({});
}

// define the model constant
const Tag = mongoose.model<ITagDoc, ITagModel>('Tag', TagSchema);

export default Tag;