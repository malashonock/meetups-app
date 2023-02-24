import * as MobX from 'mobx';

import { UserStore, RootStore, User } from 'stores';
import * as UserApi from 'api/services/user.service';
import {
  mockIFullUsers,
  mockUser,
  mockUserData,
  mockUsers,
} from 'model/__fakes__';

const spiedOnMobXMakeAutoObservable = jest.spyOn(MobX, 'makeAutoObservable');
const spiedOnApiGetUsers = jest.spyOn(UserApi, 'getUsers');

beforeEach(() => {
  spiedOnApiGetUsers.mockReturnValue(Promise.resolve(mockIFullUsers));
});

afterEach(() => {
  jest.resetAllMocks();
});

describe('UserStore', () => {
  describe('constructor', () => {
    it('should make the returned instance observable', () => {
      const userStore = new UserStore(new RootStore());
      expect(spiedOnMobXMakeAutoObservable).toHaveBeenCalledWith(userStore);
    });

    it('should initialize users field to an empty array', () => {
      const userStore = new UserStore(new RootStore());
      expect(userStore.users.length).toBe(0);
    });
  });

  describe('loadUsers() instance method', () => {
    it('should call API getUsers() method', async () => {
      const userStore = new UserStore(new RootStore());
      await userStore.loadUsers();
      expect(spiedOnApiGetUsers).toHaveBeenCalled();
    });

    it('should populate users field with fetched users', async () => {
      const userStore = new UserStore(new RootStore());
      await userStore.loadUsers();
      expect(userStore.users.length).toBe(mockUsers.length);
      expect(JSON.stringify(userStore.users)).toBe(JSON.stringify(mockUsers));
    });
  });

  describe('findUser() instance method', () => {
    it('should find user by string id', async () => {
      const userStore = new UserStore(new RootStore());
      await userStore.loadUsers();
      const foundUser = userStore.findUser(mockUser.id);
      expect(JSON.stringify(foundUser)).toBe(JSON.stringify(mockUser));
    });

    it('should find user by user-like object with id', async () => {
      const userStore = new UserStore(new RootStore());
      await userStore.loadUsers();
      const foundUser = userStore.findUser({ id: mockUser.id });
      expect(JSON.stringify(foundUser)).toBe(JSON.stringify(mockUser));
    });

    it('should return undefined if no id or user is passed', async () => {
      const userStore = new UserStore(new RootStore());
      await userStore.loadUsers();
      const foundUser = userStore.findUser(null);
      expect(foundUser).toBeUndefined();
    });
  });

  describe('findUsers() instance method', () => {
    it('should find users by an array of string ids', async () => {
      const ids = mockUsers.map((user: User): string => user.id);
      const userStore = new UserStore(new RootStore());
      await userStore.loadUsers();
      const foundUsers = userStore.findUsers(ids);
      expect(JSON.stringify(foundUsers)).toBe(JSON.stringify(mockUsers));
    });

    it('should find users by an array user-like objects with ids', async () => {
      const userLikes = mockUsers.map(({ id }: User): { id: string } => ({
        id,
      }));
      const userStore = new UserStore(new RootStore());
      await userStore.loadUsers();
      const foundUsers = userStore.findUsers(userLikes);
      expect(JSON.stringify(foundUsers)).toBe(JSON.stringify(mockUsers));
    });

    it('should return an empty array if an empty array of user-like objects is passed', async () => {
      const userStore = new UserStore(new RootStore());
      await userStore.loadUsers();
      const foundUsers = userStore.findUsers([]);
      expect(foundUsers.length).toBe(0);
    });
  });
});

describe('User', () => {
  describe('constructor', () => {
    describe('given user store is passed', () => {
      it('should make the returned instance observable', () => {
        const userStore = new UserStore(new RootStore());
        const user = new User(mockUserData, userStore);
        expect(spiedOnMobXMakeAutoObservable).toHaveBeenCalledWith(user);
      });
    });

    describe('given user store is not passed', () => {
      it('should not make the returned instance observable', () => {
        const user = new User(mockUserData);
        expect(spiedOnMobXMakeAutoObservable).not.toHaveBeenCalled();
      });
    });

    it('should initialize users fields with user data', () => {
      const user = new User(mockUserData);
      expect(user.userStore).toBeNull();
      expect(user.id).toBe(mockUserData.id);
      expect(user.name).toBe(mockUserData.name);
      expect(user.surname).toBe(mockUserData.surname);
      expect(user.post).toBe(mockUserData.post);
      expect(user.roles).toBe(mockUserData.roles);
    });
  });

  describe('fullName property', () => {
    it('should return concatenated full name', () => {
      const expectedInitials = mockUserData.name + ' ' + mockUserData.surname;
      const user = new User(mockUserData);
      expect(user.fullName).toBe(expectedInitials);
    });
  });

  describe('initials property', () => {
    it('should return initials', () => {
      const expectedInitials =
        mockUserData.name[0].toUpperCase() +
        mockUserData.surname[0].toUpperCase();
      const user = new User(mockUserData);
      expect(user.initials).toBe(expectedInitials);
    });
  });

  describe('toJSON instance() method', () => {
    it('should serialize to IUser', () => {
      const user = new User(mockUserData);
      expect(JSON.stringify(user)).toBe(JSON.stringify(mockUserData));
    });
  });
});
