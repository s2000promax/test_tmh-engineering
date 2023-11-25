import { IUser } from '../user/user.inteface';

export interface IRegisterRequest extends Pick<IUser, 'email' | 'password'> {}

export interface IRegisterResponse {
  message: string;
}
