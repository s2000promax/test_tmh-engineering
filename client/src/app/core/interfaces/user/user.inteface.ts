import { RolesEnum } from '../../enums/roles.enum';

export interface IUser {
  id: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  isUserBlocked: boolean;
  isUserConfirmed: boolean;
  roles: RolesEnum[];
}

export interface IProfile {
  userId: string;
  fullName: string;
  avatar: string;
}
