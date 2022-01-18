import { Model, Schema } from 'mongoose';
export declare const connectDB: (authType: string, authDB: string) => void;
export declare const getRoleModel: (authType: string, authDB: string) => Model<Schema>;
