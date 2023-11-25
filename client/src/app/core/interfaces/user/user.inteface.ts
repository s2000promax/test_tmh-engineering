import { RolesEnum } from '../../enums/roles.enum';

export interface IUser {
  id: string;
  email: string;
  password: string;
  fullName: string;
  avatar: string;
  roles: RolesEnum[];
}
