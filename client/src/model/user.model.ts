export enum UserRole {
  CHIEF = 'chief',
  EMPLOYEE = 'employee',
}

export interface User {
  id: string;
  name: string;
  surname: string;
  post: string;
  roles: UserRole;
}

export type ShortUser = Pick<User, 'id' | 'name' | 'surname'>;

export type FullUser = User & {
  password: string;
};
