import { UserRole } from '../../src/types/user.types';

declare global {
    namespace Express {
        interface Request {
            user?: {
                _id: string;
                role: UserRole;
            };
        }
    }
}
export { };