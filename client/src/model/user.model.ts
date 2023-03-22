export enum UserRole {
  CHIEF = 'CHIEF',
  EMPLOYEE = 'EMPLOYEE',
}

export interface IUser {
  id: string;
  name: string;
  surname: string;
}

export interface IFullUser extends IUser {
  post: string;
  roles: UserRole;
}
