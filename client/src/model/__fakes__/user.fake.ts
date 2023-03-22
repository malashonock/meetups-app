import { faker } from '@faker-js/faker';

import { IFullUser, IUser, UserRole } from 'model';
import { FullUser, User } from 'stores';
import { generateArray } from 'utils';

export const mockUserData: IUser = {
  id: 'aaa',
  name: 'John',
  surname: 'Doe',
};

export const mockUser2Data: IUser = {
  id: 'bbb',
  name: 'Alice',
  surname: 'Green',
};

export const mockUsersData: IUser[] = [mockUserData, mockUser2Data];

export const mockUser: User = new User(mockUserData);
export const mockUser2: User = new User(mockUser2Data);
export const mockUsers: User[] = [mockUser, mockUser2];

export const mockFullUserData: IFullUser = {
  ...mockUserData,
  post: 'Software Engineer',
  roles: UserRole.CHIEF,
};

export const mockFullUser2Data: IFullUser = {
  ...mockUser2Data,
  post: 'Business Analyst',
  roles: UserRole.EMPLOYEE,
};

export const mockFullUsersData: IFullUser[] = [
  mockFullUserData,
  mockFullUser2Data,
];

export const mockFullUser: FullUser = new FullUser(mockFullUserData);
export const mockFullUser2: FullUser = new FullUser(mockFullUser2Data);
export const mockFullUsers: FullUser[] = [mockFullUser, mockFullUser2];

export const generateUserData = (): IUser => ({
  id: faker.datatype.uuid(),
  name: faker.name.firstName(),
  surname: faker.name.lastName(),
});

export const generateUser = (): User => new User(generateUserData());

export const generateFullUserData = (): IFullUser => ({
  id: faker.datatype.uuid(),
  name: faker.name.firstName(),
  surname: faker.name.lastName(),
  post: faker.name.jobTitle(),
  roles: Math.round(Math.random()) ? UserRole.EMPLOYEE : UserRole.CHIEF,
});

export const generateFullUser = (): FullUser =>
  new FullUser(generateFullUserData());

export const generateUsersData = (count: number): IUser[] => {
  return generateArray<IUser>(count, generateUserData);
};

export const generateUsers = (count: number): User[] => {
  return generateArray<User>(count, generateUser);
};

export const generateFullUsersData = (count: number): IFullUser[] => {
  return generateArray<IFullUser>(count, generateFullUserData);
};

export const generateFullUsers = (count: number): FullUser[] => {
  return generateArray<FullUser>(count, generateFullUser);
};
