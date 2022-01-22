import { Model, Schema } from 'mongoose';
export declare const connectDB: (authType: string, authDB: string) => Promise<void>;
export declare const getRoleModel: (authType: string, authDB: string) => Model<Schema>;
