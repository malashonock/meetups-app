import { faker } from '@faker-js/faker';

import { FullUser, IUser, ShortUser, UserRole } from 'model';
import { RootStore, User, UserStore } from 'stores';
import { generateArray } from 'utils';

export const mockUserData: IUser = {
  id: 'aaa',
  name: 'John',
  surname: 'Doe',
  post: 'Software Engineer',
  roles: UserRole.EMPLOYEE,
};

export const mockUser2Data: IUser = {
  id: 'bbb',
  name: 'Alice',
  surname: 'Green',
  post: 'Business Analyst',
  roles: UserRole.EMPLOYEE,
};

export const mockUsersData: IUser[] = [mockUserData, mockUser2Data];

export const mockUser: User = new User(
  mockUserData,
  new UserStore(new RootStore()),
);
export const mockUser2: User = new User(
  mockUser2Data,
  new UserStore(new RootStore()),
);
export const mockUsers: User[] = [mockUser, mockUser2];

export const mockFullUser: FullUser = {
  ...mockUserData,
  password: 'alabama',
};

export const mockFullUser2: FullUser = {
  ...mockUser2Data,
  password: '12345',
};

export const mockFullUsers: FullUser[] = [mockFullUser, mockFullUser2];

export const generateUser = (): User =>
  new User({
    id: faker.datatype.uuid(),
    name: faker.name.firstName(),
    surname: faker.name.lastName(),
    post: faker.name.jobTitle(),
    roles: Math.round(Math.random()) ? UserRole.EMPLOYEE : UserRole.CHIEF,
  });

export const generateShortUser = (): ShortUser => ({
  id: faker.datatype.uuid(),
  name: faker.name.firstName(),
  surname: faker.name.lastName(),
});

export const generateUsers = (count: number): User[] => {
  return generateArray<User>(count, generateUser);
};

export const generateShortUsers = (count: number): ShortUser[] => {
  return generateArray<ShortUser>(count, generateShortUser);
};
