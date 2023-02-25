import * as MobX from 'mobx';

import { AuthStore, RootStore, UserStore } from 'stores';
import { Credentials } from 'model';
import * as LoginApi from 'api/services/login.service';
import { mockFullUser, mockUser } from 'model/__fakes__';

const spiedOnMobXMakeAutoObservable = jest.spyOn(MobX, 'makeAutoObservable');
const spiedOnApiLogin = jest.spyOn(LoginApi, 'login');
const spiedOnApiLogout = jest.spyOn(LoginApi, 'logout');
const spiedOnUserStoreFindUser = jest.spyOn(UserStore.prototype, 'findUser');
const spiedOnStorageGetItem = jest.spyOn(Storage.prototype, 'getItem');

const testCredentials: Credentials = {
  username: mockFullUser.name,
  password: 'alabama',
};

describe('AuthStore', () => {
  describe('constructor', () => {
    it('should make the returned instance observable', () => {
      const authStore = new AuthStore(new RootStore());
      expect(spiedOnMobXMakeAutoObservable).toHaveBeenCalledWith(authStore);
    });

    it('should initialize loggedUser field to null', () => {
      const authStore = new AuthStore(new RootStore());
      expect(authStore.loggedUser).toBeNull();
    });
  });

  describe('login() instance method', () => {
    beforeEach(() => {
      spiedOnApiLogin.mockReturnValue(Promise.resolve(mockFullUser));
      spiedOnUserStoreFindUser.mockReturnValue(mockUser);
    });

    it('should call API login() method', async () => {
      const authStore = new AuthStore(new RootStore());
      await authStore.logIn(testCredentials);
      expect(spiedOnApiLogin).toHaveBeenCalledWith(testCredentials);
    });

    it('should find the logged in user in the user store and assign it to loggedUser field', async () => {
      spiedOnUserStoreFindUser.mockReturnValue(mockUser);
      spiedOnStorageGetItem.mockReturnValue(JSON.stringify(mockUser));
      const authStore = new AuthStore(new RootStore());
      await authStore.logIn(testCredentials);
      expect(spiedOnUserStoreFindUser).toHaveBeenCalledWith(mockFullUser.id);
      expect(authStore.loggedUser).toBe(mockUser);
    });

    it('should clear the loggedUser field if logged in user is not found in the user store', async () => {
      spiedOnUserStoreFindUser.mockReturnValue(undefined);
      const authStore = new AuthStore(new RootStore());
      await authStore.logIn(testCredentials);
      expect(authStore.loggedUser).toBeNull();
    });
  });

  describe('logout() instance method', () => {
    it('should call API logout() method', async () => {
      const authStore = new AuthStore(new RootStore());
      await authStore.logOut();
      expect(spiedOnApiLogout).toHaveBeenCalled();
    });

    it('should clear the loggedUser field', async () => {
      const authStore = new AuthStore(new RootStore());
      await authStore.logOut();
      expect(authStore.loggedUser).toBeNull();
    });
  });
});
