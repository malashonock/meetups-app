import { UserRole } from 'model';
import { User } from 'stores';
import { faker } from '@faker-js/faker';

export const mockEmployee: User = new User({
  id: 'aaa',
  name: 'John',
  surname: 'Doe',
  post: 'Software Engineer',
  roles: UserRole.EMPLOYEE,
});

export const generateEmployee = (): User =>
  new User({
    id: faker.datatype.uuid(),
    name: faker.name.firstName(),
    surname: faker.name.lastName(),
    post: faker.name.jobTitle(),
    roles: Math.round(Math.random()) ? UserRole.EMPLOYEE : UserRole.CHIEF,
  });
