import { AuthPayload } from '../../src/types/auth-payload.types';

declare global {
    namespace Express {
        interface Request {
            user?: AuthPayload;
        }
    }
}

export { };
