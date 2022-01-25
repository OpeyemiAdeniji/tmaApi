import mongoose, { ObjectId } from 'mongoose'
import slugify from 'slugify'

// interface that describes the properties the model has
interface ICommentModel extends mongoose.Model<ICommentDoc> {

    // functions
}

// interface that describes the properties that the Doc has
interface ICommentDoc extends mongoose.Document{

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

const CommentSchema = new mongoose.Schema (

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

CommentSchema.set('toJSON', { getters: true, virtuals: true });

CommentSchema.pre<ICommentDoc>('save', async function(next){
    this.slug = slugify(this.description, { lower: true });
    next();
});

CommentSchema.statics.getAllComments = () => {
    return Comment.find({});
}

// define the model constant
const Comment = mongoose.model<ICommentDoc, ICommentModel>('Comment', CommentSchema);

export default Comment;