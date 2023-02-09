export enum UserRole {
  CHIEF = 'chief',
  EMPLOYEE = 'employee',
}

export interface IUser {
  id: string;
  name: string;
  surname: string;
  post: string;
  roles: UserRole;
}

export type ShortUser = Pick<IUser, 'id' | 'name' | 'surname'>;

export type FullUser = IUser & {
  password: string;
};
