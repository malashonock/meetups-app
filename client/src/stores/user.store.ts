import {
  action,
  computed,
  makeObservable,
  observable,
  runInAction,
} from 'mobx';

import * as API from 'api';
import { AuthStore, FullUser } from 'stores';
import { IUser } from 'model';
import { getFirstLetter } from 'utils';
import { Loadable, Maybe, Nullable, Optional } from 'types';

export class UserStore extends Loadable {
  authStore: AuthStore;
  users: User[];

  constructor(authStore: AuthStore) {
    super();
    this.setupObservable();

    this.authStore = authStore;
    this.users = [];
  }

  setupObservable(): void {
    makeObservable(this, {
      authStore: observable,
      users: observable,
      init: action,
      loadUsers: action,
    });
  }

  async init(loggedUser: Nullable<FullUser>): Promise<void> {
    if (!loggedUser) {
      this.users = [];
      return;
    }

    if (!loggedUser.isAdmin) {
      this.users = [new User(loggedUser)];
      return;
    }

    await this.loadUsers();
  }

  async loadUsers(): Promise<void> {
    await this.tryLoad(async () => {
      const usersData: IUser[] = await API.getUsers();
      runInAction(() => {
        this.users = usersData.map(
          (userData: IUser): User => new User(userData),
        );
      });
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
    makeObservable(this, {
      id: observable,
      name: observable,
      surname: observable,
      fullName: computed,
      initials: computed,
    });

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
