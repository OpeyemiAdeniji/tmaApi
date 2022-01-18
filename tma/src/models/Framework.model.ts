import mongoose, { ObjectId } from 'mongoose'
import slugify from 'slugify'

// interface that describes the properties the model has
interface IFrameworkModel extends mongoose.Model<IFrameworkDoc> {

    // functions

}

// interface that describes the properties that the Doc
interface IFrameworkDoc extends mongoose.Document{
    name: string;
    description: string;
    inDemand: Boolean;
    slug: string

    // timestamps
    createdAt: string;
    updatedAt: string
    _version: number;
    _id: mongoose.Schema.Types.ObjectId;
    id: mongoose.Schema.Types.ObjectId;

      // functions

}

const FrameworkSchema = new mongoose.Schema (

    {
        name: {
            type: String,
        },

        description: {
            type: String
        },

        inDemand: {
            type: Boolean,
            default: false
        },

        slug: String
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

FrameworkSchema.set('toJSON', { getters: true, virtuals: true });

FrameworkSchema.pre<IFrameworkDoc>('save', async function (next) {
    this.slug = slugify(this.name, { lower: true });
    next();
});

const Framework = mongoose.model<IFrameworkDoc, IFrameworkModel>('Framework', FrameworkSchema);

export default Framework;