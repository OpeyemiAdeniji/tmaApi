import crypto from 'crypto';
import mongoose, { ObjectId } from 'mongoose';
import slugify from 'slugify';


interface ILangModel extends mongoose.Model<ILangDoc> {
    build(attrs: any): ILangDoc,
}

interface ILangDoc extends mongoose.Document {

    name: string;
    code: string;
    slug: string;

    // time stamps
    createdAt: string;
    updatedAt: string;
    _version: number;
    _id: mongoose.Schema.Types.ObjectId;
    id: mongoose.Schema.Types.ObjectId;

    // props
    build(attrs: any): ILangDoc;
}

const LanguageSchema = new mongoose.Schema(

    {

        name: {
            type: String,
            required: [true, 'language name is required ']
        },

        code: {
            type: String,
            required: [true, 'language code in two letters is required']
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



LanguageSchema.set('toJSON', {getters: true, virtuals: true});

// Encrypt password using bcrypt
LanguageSchema.pre<ILangDoc>('save', async function (next) {
    this.slug = slugify(this.name, { lower: true });
	next()
});

// define the model
const Language = mongoose.model<ILangDoc, ILangModel>('Language', LanguageSchema);

export default Language;