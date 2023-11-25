import { IUser } from '../user/user.inteface';

export interface IRegisterForm extends Pick<IUser, 'email' | 'password'> {}
