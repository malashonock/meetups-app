import { faker } from '@faker-js/faker';

import { ShortUser, UserRole } from 'model';
import { User } from 'stores';
import { generateArray } from 'utils';

export const mockUser: User = new User({
  id: 'aaa',
  name: 'John',
  surname: 'Doe',
  post: 'Software Engineer',
  roles: UserRole.EMPLOYEE,
});

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
