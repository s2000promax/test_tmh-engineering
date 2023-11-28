import { IProfile } from '../user/user.inteface';

export interface IProfileForm extends Omit<IProfile, 'userId'> {}
