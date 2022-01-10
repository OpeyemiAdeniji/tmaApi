import crypto from 'crypto';
import mongoose from 'mongoose';
import slugify from 'slugify';


interface INotifModel extends mongoose.Model<INotifDoc>{
	build(attrs: any): INotifDoc,
}


interface INotifDoc extends mongoose.Document{
    refId: string;
    body: string;
    status: string;
    sender: object;
    recipients: Array<mongoose.Schema.Types.ObjectId>

	// props
	build(attrs: any): INotifDoc,
}


const NotificationSchema = new mongoose.Schema(

    {
        refId: {
			type: String
		},

		body: {
			type: String
		},

		status: {
			type: String,
			enum: ['new', 'read'],
			default: 'new'
		},

		sender: {
			name: String,
			id: {
				type: mongoose.Schema.Types.ObjectId,
				ref: 'User',
			},
		},

		// many-to-many
		recipients: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'User',
			},
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

NotificationSchema.set('toJSON', {getters: true, virtuals: true});

// Encrypt password using bcrypt
NotificationSchema.pre<INotifDoc>('save', async function (next) {
	next()
});

// define the model
const Notification = mongoose.model<INotifDoc, INotifModel>('Notification', NotificationSchema);


export default Notification;