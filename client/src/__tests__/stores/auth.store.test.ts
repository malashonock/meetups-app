import * as MobX from 'mobx';

import { AuthStore, RootStore, UserStore } from 'stores';
import { Credentials } from 'model';
import * as LoginApi from 'api/services/login.service';
import { mockFullUser } from 'model/__fakes__';

const spiedOnMobXMakeObservable = jest.spyOn(MobX, 'makeObservable');
const spiedOnApiLogin = jest.spyOn(LoginApi, 'login');
const spiedOnApiLogout = jest.spyOn(LoginApi, 'logout');
const spiedOnStorageGetItem = jest.spyOn(Storage.prototype, 'getItem');
const spiedOnUserStoreInit = jest.spyOn(UserStore.prototype, 'init');

const testCredentials: Credentials = {
  username: mockFullUser.name,
  password: 'alabama',
};

describe('AuthStore', () => {
  describe('constructor', () => {
    it('should make the returned instance observable', () => {
      const authStore = new AuthStore(new RootStore());
      expect(spiedOnMobXMakeObservable).toHaveBeenCalled();
    });

    it('should initialize loggedUser field to null', () => {
      const authStore = new AuthStore(new RootStore());
      expect(authStore.loggedUser).toBeNull();
    });
  });

  describe('login() instance method', () => {
    beforeEach(() => {
      spiedOnApiLogin.mockReturnValue(Promise.resolve(mockFullUser));
    });

    it('should call API login() method', async () => {
      const authStore = new AuthStore(new RootStore());
      await authStore.logIn(testCredentials);
      expect(spiedOnApiLogin).toHaveBeenCalledWith(testCredentials);
    });

    it('should assign the logged in user to loggedUser field', async () => {
      spiedOnStorageGetItem.mockReturnValue(JSON.stringify(mockFullUser));
      const authStore = new AuthStore(new RootStore());
      await authStore.logIn(testCredentials);
      expect(authStore.loggedUser).toStrictEqual(mockFullUser);
    });

    it('should re-initialize user store on user login', async () => {
      const authStore = new AuthStore(new RootStore());
      await authStore.logIn(testCredentials);
      expect(spiedOnUserStoreInit).toHaveBeenCalledWith(mockFullUser);
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

    it('should re-initialize user store on user logout', async () => {
      const authStore = new AuthStore(new RootStore());
      await authStore.logOut();
      expect(spiedOnUserStoreInit).toHaveBeenCalledWith(null);
    });
  });
});
