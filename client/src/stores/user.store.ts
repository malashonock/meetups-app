import { makeAutoObservable, runInAction } from 'mobx';

import * as API from 'api';
import { RootStore } from 'stores';
import { IUser, ShortUser, UserRole } from 'model';
import { getFirstLetter } from 'utils';
import { Maybe, Nullable, Optional } from 'types';

export class UserStore {
  users: User[];

  constructor(public rootStore: RootStore) {
    makeAutoObservable(this);

    this.users = [];
  }

  async loadUsers(): Promise<void> {
    const usersData: IUser[] = await API.getUsers();
    runInAction(() => {
      this.users = usersData.map(
        (userData: IUser): User => new User(userData, this),
      );
    });
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
}

export class User {
  userStore: Nullable<UserStore> = null;

  id: string;
  name: string;
  surname: string;
  post: string;
  roles: UserRole;

  constructor(userData: IUser, userStore?: UserStore) {
    if (userStore) {
      makeAutoObservable(this);
      this.userStore = userStore;
    }

    ({
      id: this.id,
      name: this.name,
      surname: this.surname,
      post: this.post,
      roles: this.roles,
    } = userData);
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
      post: this.post,
      roles: this.roles,
    };
  }

  asShortUser(): ShortUser {
    return {
      id: this.id,
      name: this.name,
      surname: this.surname,
    };
  }
}
