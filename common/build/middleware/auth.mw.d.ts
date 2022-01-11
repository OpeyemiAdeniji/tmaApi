import { JwtPayload } from 'jsonwebtoken';
import { Request } from 'express';
export declare const protect: (req: Request, secret: string) => string | JwtPayload;
export declare const authorize: (roles: Array<string>, userRoles: Array<string>, authType: string) => Promise<boolean>;
