import * as MobX from 'mobx';

import { AuthStore, RootStore, UserStore } from 'stores';
import { Credentials, NotAuthenticatedError, ServerError } from 'model';
import * as LoginApi from 'api/services/login.service';
import { mockFullUser, mockFullUserData } from 'model/__fakes__';
import { AlertSeverity } from 'types';

const spiedOnMobXMakeObservable = jest.spyOn(MobX, 'makeObservable');
const spiedOnApiCheckLogin = jest.spyOn(LoginApi, 'checkLogin');
const spiedOnApiLogin = jest.spyOn(LoginApi, 'login');
const spiedOnApiLogout = jest.spyOn(LoginApi, 'logout');
const spiedOnUserStoreInit = jest.spyOn(UserStore.prototype, 'init');

const testCredentials: Credentials = {
  username: mockFullUser.name,
  password: 'alabama',
};

afterEach(() => {
  jest.resetAllMocks();
});

describe('AuthStore', () => {
  describe('constructor', () => {
    it('should make the returned instance observable', () => {
      const authStore = new AuthStore(new RootStore());
      expect(spiedOnMobXMakeObservable).toHaveBeenCalled();
    });

    it('should initialize instance fields properly', () => {
      const authStore = new AuthStore(new RootStore());

      expect(authStore.loggedUser).toBeNull();
      expect(authStore.isInitialized).toBe(false);
      expect(authStore.userStore instanceof UserStore).toBe(true);
      expect(authStore.onError).toBeTruthy();
    });
  });

  describe('init() instance method', () => {
    it('should call checkLogin() method', async () => {
      const authStore = new AuthStore(new RootStore());
      const spiedOnCheckLogin = jest.spyOn(authStore, 'checkLogin');

      await authStore.init();

      expect(spiedOnCheckLogin).toHaveBeenCalled();
      expect(authStore.isInitialized).toBe(true);
    });
  });

  describe('checkLogin() instance method', () => {
    beforeEach(() => {
      spiedOnApiCheckLogin.mockResolvedValue(mockFullUserData);
    });

    it('should call API checkLogin() method', async () => {
      const authStore = new AuthStore(new RootStore());
      await authStore.checkLogin();
      expect(spiedOnApiCheckLogin).toHaveBeenCalled();
    });

    it('should call onLoginChanged() method', async () => {
      const authStore = new AuthStore(new RootStore());
      const spiedOnOnLoginChanged = jest.spyOn(authStore, 'onLoginChanged');

      await authStore.checkLogin();

      expect(spiedOnOnLoginChanged).toHaveBeenCalled();
    });

    it('should assign the logged in user to loggedUser field', async () => {
      const authStore = new AuthStore(new RootStore());
      await authStore.checkLogin();
      expect(authStore.loggedUser).toStrictEqual(mockFullUser);
    });

    it('on 401 response, should set loggedUser field to null', async () => {
      const authenticationError = new NotAuthenticatedError();
      spiedOnApiCheckLogin.mockRejectedValue(authenticationError);
      const authStore = new AuthStore(new RootStore());
      const spiedOnOnError = jest.fn();
      authStore.onError = spiedOnOnError;

      await authStore.checkLogin();

      expect(authStore.loggedUser).toBeNull();
      expect(spiedOnOnError).not.toHaveBeenCalled();
    });

    it('on other error responses, should not touch loggedUser field', async () => {
      const serverError = new ServerError();
      spiedOnApiCheckLogin.mockRejectedValue(serverError);
      const authStore = new AuthStore(new RootStore());
      authStore.loggedUser = mockFullUser;

      await authStore.checkLogin();

      expect(authStore.loggedUser).toStrictEqual(mockFullUser);
    });

    it('on other error responses, should bubble the error up', async () => {
      const serverError = new ServerError();
      spiedOnApiCheckLogin.mockRejectedValue(serverError);
      const authStore = new AuthStore(new RootStore());
      const spiedOnOnError = jest.fn();
      authStore.onError = spiedOnOnError;

      await authStore.checkLogin();

      expect(spiedOnOnError).toHaveBeenCalledWith(serverError);
    });
  });

  describe('login() instance method', () => {
    beforeEach(() => {
      spiedOnApiLogin.mockResolvedValue(mockFullUserData);
    });

    it('should call API login() method', async () => {
      const authStore = new AuthStore(new RootStore());
      await authStore.logIn(testCredentials);
      expect(spiedOnApiLogin).toHaveBeenCalledWith(testCredentials);
    });

    it('should assign the logged in user to loggedUser field', async () => {
      const authStore = new AuthStore(new RootStore());
      await authStore.logIn(testCredentials);
      expect(authStore.loggedUser).toStrictEqual(mockFullUser);
    });

    it('should push a success alert up to the root store', async () => {
      const rootStore = new RootStore();
      const spiedOnRootStoreOnAlert = jest.fn();
      rootStore.onAlert = spiedOnRootStoreOnAlert;
      const authStore = new AuthStore(rootStore);

      await authStore.logIn(testCredentials);

      expect(spiedOnRootStoreOnAlert).toHaveBeenCalledTimes(1);
      expect(spiedOnRootStoreOnAlert.mock.calls[0][0].severity).toBe(
        AlertSeverity.Success,
      );
    });

    it('should call onLoginChanged() method', async () => {
      const authStore = new AuthStore(new RootStore());
      const spiedOnOnLoginChanged = jest.spyOn(authStore, 'onLoginChanged');

      await authStore.logIn(testCredentials);

      expect(spiedOnOnLoginChanged).toHaveBeenCalled();
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

    it('should push a success alert up to the root store', async () => {
      const rootStore = new RootStore();
      const spiedOnRootStoreOnAlert = jest.fn();
      rootStore.onAlert = spiedOnRootStoreOnAlert;
      const authStore = new AuthStore(rootStore);

      await authStore.logOut();

      expect(spiedOnRootStoreOnAlert).toHaveBeenCalledTimes(1);
      expect(spiedOnRootStoreOnAlert.mock.calls[0][0].severity).toBe(
        AlertSeverity.Success,
      );
    });

    it('should call onLoginChanged() method', async () => {
      const authStore = new AuthStore(new RootStore());
      const spiedOnOnLoginChanged = jest.spyOn(authStore, 'onLoginChanged');

      await authStore.logOut();

      expect(spiedOnOnLoginChanged).toHaveBeenCalled();
    });
  });

  describe('onLoginChanged() instance method', () => {
    it('should re-initialize user store', async () => {
      const authStore = new AuthStore(new RootStore());
      authStore.loggedUser = mockFullUser;

      await authStore.onLoginChanged();

      expect(spiedOnUserStoreInit).toHaveBeenCalled();
    });
  });

  describe('toJSON() instance method', () => {
    it('should serialize correctly', () => {
      const authStore = new AuthStore(new RootStore());
      authStore.loggedUser = mockFullUser;

      expect(authStore.toJSON()).toStrictEqual({
        loggedUser: authStore.loggedUser,
      });
    });
  });
});
