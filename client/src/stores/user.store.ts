import { makeAutoObservable, runInAction } from 'mobx';

import * as API from 'api';
import { AuthStore, FullUser } from 'stores';
import { IUser } from 'model';
import { getFirstLetter } from 'utils';
import { ILoadable, Maybe, Nullable, Optional } from 'types';

export class UserStore implements ILoadable {
  authStore: AuthStore;
  users: User[];

  isLoading: boolean;
  isError: boolean;
  errors: unknown[];

  constructor(authStore: AuthStore) {
    makeAutoObservable(this);

    this.authStore = authStore;
    this.users = [];

    this.isLoading = false;
    this.isError = false;
    this.errors = [];
  }

  async init(loggedUser: Nullable<FullUser>): Promise<void> {
    if (!loggedUser) {
      this.users = [];
      return;
    }

    if (!loggedUser.isAdmin()) {
      this.users = [new User(loggedUser)];
      return;
    }

    await this.loadUsers();
  }

  async loadUsers(): Promise<void> {
    try {
      this.isLoading = true;

      const usersData: IUser[] = await API.getUsers();
      runInAction(() => {
        this.users = usersData.map(
          (userData: IUser): User => new User(userData),
        );
      });

      this.isLoading = false;
      this.isError = false;
      this.errors.length = 0;
    } catch (error) {
      this.isLoading = false;
      this.isError = true;
      this.errors.push(error);
    }
  }

  findUser(idOrUser: Maybe<string> | Maybe<{ id: string }>): Optional<User> {
    if (!idOrUser) {
      return undefined;
    }

    return this.users.find((user: User) => {
      const id =
        idOrUser &&
        typeof idOrUser === 'object' &&
        Object.hasOwn(idOrUser, 'id')
          ? (idOrUser as { id: string }).id
          : (idOrUser as string);

      return user.id === id;
    });
  }

  findUsers(idsOrUsers: string[] | Array<{ id: string }>): User[] {
    if (!idsOrUsers || idsOrUsers.length === 0) {
      return [];
    }

    const ids =
      idsOrUsers[0] &&
      typeof idsOrUsers[0] === 'object' &&
      Object.hasOwn(idsOrUsers[0], 'id')
        ? (idsOrUsers as Array<{ id: string }>).map(({ id }): string => id)
        : (idsOrUsers as string[]);

    return this.users.filter((user: User): boolean => {
      return ids.includes(user.id);
    });
  }

  toJSON() {
    return {
      users: this.users,
    };
  }
}

export class User implements IUser {
  id: string;
  name: string;
  surname: string;

  constructor(userData: IUser) {
    ({ id: this.id, name: this.name, surname: this.surname } = userData);
  }

  static factory(userData: IUser): User {
    return new User(userData);
  }

  get fullName(): string {
    return `${this.name} ${this.surname}`;
  }

  get initials(): string {
    return `${getFirstLetter(this.name)}${getFirstLetter(
      this.surname,
    )}`.toLocaleUpperCase();
  }

  toJSON(): IUser {
    return {
      id: this.id,
      name: this.name,
      surname: this.surname,
    };
  }

  static serialize({ id, name, surname }: User): IUser {
    return {
      id,
      name,
      surname,
    };
  }
}
