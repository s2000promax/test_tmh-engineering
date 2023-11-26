import { IUser } from '../user/user.inteface';

export interface ILoginForm extends Pick<IUser, 'email' | 'password'> {}
