import mongoose, { ObjectId } from 'mongoose'
import slugify from 'slugify'

// interface that describes the properties the model has
interface IIndustryModel extends mongoose.Model<IIndustryDoc> {

    // functions
    getPayment(id: ObjectId): IIndustryDoc;

}

// interface that describes the properties that the Doc
interface IIndustryDoc extends mongoose.Document{
    name: string;
    description: string;

    // timestamps
    createdAt: string;
    updatedAt: string
    _version: number;
    _id: mongoose.Schema.Types.ObjectId;
    id: mongoose.Schema.Types.ObjectId;

      // functions
      getPayment(id: ObjectId): IIndustryDoc;

      
}

const IndustrySchema = new mongoose.Schema (

    {
        name: {
            type: String,
            required: [true, 'please enter your cloud']
        },
        description: {
            type: String
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

IndustrySchema.set('toJSON', { getters: true, virtuals: true });

IndustrySchema.pre<IIndustryDoc>('save', async function (next) {
    this.slug = slugify(this.name, { lower: true });
    next();
});

IndustrySchema.statics.getPayment = function (id) {
    return this.findById(id);
};

const industry = mongoose.model<IIndustryDoc, IIndustryModel>('Industry', IndustrySchema);

export default industry;