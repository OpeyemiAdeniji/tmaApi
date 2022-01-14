import mongoose, { ObjectId } from 'mongoose'
import slugify from 'slugify'

// interface that describes the properties the model has
interface IFrameworkModel extends mongoose.Model<IFrameworkDoc> {

    // functions
    getPayment(id: ObjectId): IFrameworkDoc;

}

// interface that describes the properties that the Doc
interface IFrameworkDoc extends mongoose.Document{
    name: string;
    description: string;
    inDemand: Boolean

    // timestamps
    createdAt: string;
    updatedAt: string
    _version: number;
    _id: mongoose.Schema.Types.ObjectId;
    id: mongoose.Schema.Types.ObjectId;

      // functions
      getPayment(id: ObjectId): IFrameworkDoc;

}

const FrameworkSchema = new mongoose.Schema (

    {
        name: {
            type: String,
            required: [true, 'please enter your framework']
        },
        description: {
            type: String
        },
        inDemand: {
            type: Boolean,
            default: false
        }
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

FrameworkSchema.statics.getPayment = function (id) {
    return this.findById(id);
};

const framework = mongoose.model<IFrameworkDoc, IFrameworkModel>('Framework', FrameworkSchema);

export default framework;