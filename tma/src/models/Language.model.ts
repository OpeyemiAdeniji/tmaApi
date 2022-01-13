import mongoose, { ObjectId } from 'mongoose';
import slugify from 'slugify';

// interface that describes the properties the model has
interface ILanguageModel extends mongoose.Model<ILanguageDoc> {
    // functions
    build(attrs: any): ILanguageDoc,
}

// interface that describes the properties the doc has
interface ILanguageDoc extends mongoose.Document{

    name: string,
    code: string,
    description: string,
    slug: string

    // timestamps
    createdAt: string,
    updatedAt: string,
    _version: number,
    _id: mongoose.Schema.Types.ObjectId;
    id: mongoose.Schema.Types.ObjectId;

    // functions
    build(attrs: any): ILanguageDoc;
}

const LanguageSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: false
        },
        code: {
            type: String,
            required: false
        },
        description: {
            type: String,
            required: false
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

LanguageSchema.set('toJSON', { getters: true, virtuals: true });

LanguageSchema.pre('save', async function (next) {
    this.slug = slugify(this.name, { lower: true });
    next();
});

// define the model variable constant
const Language = mongoose.model<ILanguageDoc, ILanguageModel>('Language', LanguageSchema);

export default Language;