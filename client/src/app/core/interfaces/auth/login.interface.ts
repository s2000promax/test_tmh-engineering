import { IUser } from '../user/user.inteface';

export interface ILoginRequest extends Pick<IUser, 'email' | 'password'> {}

export interface ILoginResponse {
  accessToken: string;
}
