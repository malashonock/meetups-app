import * as MobX from 'mobx';

import { UserStore, RootStore, User, AuthStore } from 'stores';
import * as UserApi from 'api/services/user.service';
import {
  mockFullUser,
  mockFullUser2,
  mockFullUsers,
  mockUser,
  mockUser2,
  mockUserData,
  mockUsers,
} from 'model/__fakes__';

const spiedOnMobXMakeObservable = jest.spyOn(MobX, 'makeObservable');
const spiedOnApiGetUsers = jest.spyOn(UserApi, 'getUsers');

const mockAuthStore = new AuthStore(new RootStore());

beforeEach(() => {
  spiedOnApiGetUsers.mockReturnValue(Promise.resolve(mockFullUsers));
});

afterEach(() => {
  jest.resetAllMocks();
});

describe('UserStore', () => {
  describe('constructor', () => {
    it('should make the returned instance observable', () => {
      const userStore = new UserStore(mockAuthStore);
      expect(spiedOnMobXMakeObservable).toHaveBeenCalled();
    });

    it('should initialize users field to an empty array', () => {
      const userStore = new UserStore(mockAuthStore);
      expect(userStore.users.length).toBe(0);
    });
  });

  describe('init() instance method', () => {
    describe('given no user is logged in', () => {
      it('should clear the users array', async () => {
        const authStore = new AuthStore(new RootStore());
        authStore.loggedUser = null;
        const userStore = new UserStore(authStore);
        userStore.users = [mockFullUser, mockFullUser2];
        await userStore.init();
        expect(userStore.users.length).toBe(0);
      });
    });

    describe('given a user without admin rights is logged in', () => {
      it('should fill the users array with the logged user', async () => {
        const authStore = new AuthStore(new RootStore());
        authStore.loggedUser = mockFullUser2;
        const userStore = new UserStore(authStore);
        await userStore.init();
        expect(userStore.users.length).toBe(1);
        expect(userStore.users[0]).toStrictEqual(mockUser2);
      });
    });

    describe('given a user with admin rights is logged in', () => {
      it('should call the loadUsers() instance method', async () => {
        const authStore = new AuthStore(new RootStore());
        authStore.loggedUser = mockFullUser;
        const userStore = new UserStore(authStore);
        const spiedOnLoadUsers = jest.spyOn(userStore, 'loadUsers');
        await userStore.init();
        expect(spiedOnLoadUsers).toHaveBeenCalled();
      });
    });
  });

  describe('loadUsers() instance method', () => {
    it('should call API getUsers() method', async () => {
      const userStore = new UserStore(mockAuthStore);
      await userStore.loadUsers();
      expect(spiedOnApiGetUsers).toHaveBeenCalled();
    });

    it('should populate users field with fetched users', async () => {
      const userStore = new UserStore(mockAuthStore);
      await userStore.loadUsers();
      expect(userStore.users.length).toBe(mockUsers.length);
      expect(JSON.stringify(userStore.users)).toBe(JSON.stringify(mockUsers));
    });
  });

  describe('findUser() instance method', () => {
    it('should find user by string id', async () => {
      const userStore = new UserStore(mockAuthStore);
      await userStore.loadUsers();
      const foundUser = userStore.findUser(mockUser.id);
      expect(JSON.stringify(foundUser)).toBe(JSON.stringify(mockUser));
    });

    it('should find user by user-like object with id', async () => {
      const userStore = new UserStore(mockAuthStore);
      await userStore.loadUsers();
      const foundUser = userStore.findUser({ id: mockUser.id });
      expect(JSON.stringify(foundUser)).toBe(JSON.stringify(mockUser));
    });

    it('should return undefined if no id or user is passed', async () => {
      const userStore = new UserStore(mockAuthStore);
      await userStore.loadUsers();
      const foundUser = userStore.findUser(null);
      expect(foundUser).toBeUndefined();
    });
  });

  describe('findUsers() instance method', () => {
    it('should find users by an array of string ids', async () => {
      const ids = mockUsers.map((user: User): string => user.id);
      const userStore = new UserStore(mockAuthStore);
      await userStore.loadUsers();
      const foundUsers = userStore.findUsers(ids);
      expect(JSON.stringify(foundUsers)).toBe(JSON.stringify(mockUsers));
    });

    it('should find users by an array user-like objects with ids', async () => {
      const userLikes = mockUsers.map(({ id }: User): { id: string } => ({
        id,
      }));
      const userStore = new UserStore(mockAuthStore);
      await userStore.loadUsers();
      const foundUsers = userStore.findUsers(userLikes);
      expect(JSON.stringify(foundUsers)).toBe(JSON.stringify(mockUsers));
    });

    it('should return an empty array if an empty array of user-like objects is passed', async () => {
      const userStore = new UserStore(mockAuthStore);
      await userStore.loadUsers();
      const foundUsers = userStore.findUsers([]);
      expect(foundUsers.length).toBe(0);
    });
  });

  describe('toJSON() instance method', () => {
    it('should serialize correctly', () => {
      const userStore = new UserStore(mockAuthStore);
      userStore.users = [...mockUsers];

      expect(userStore.toJSON()).toStrictEqual({
        users: userStore.users,
      });
    });
  });
});

describe('User', () => {
  describe('constructor', () => {
    it('should make the returned instance observable', () => {
      const user = new User(mockUserData);
      expect(spiedOnMobXMakeObservable).toHaveBeenCalled();
    });

    it('should initialize users fields with user data', () => {
      const user = new User(mockUserData);
      expect(user.id).toBe(mockUserData.id);
      expect(user.name).toBe(mockUserData.name);
      expect(user.surname).toBe(mockUserData.surname);
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
