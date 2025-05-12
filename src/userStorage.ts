import { User, UserNotFoundError } from './model';
import { v4 } from 'uuid';

export class UserStorage {
  private users: Map<string, User>;

  constructor() {
    this.users = new Map<string, User>();
  }

  get(): User[] {
    return [...this.users.values()];
  }

  getById(id: string): User {
    const user = this.users.get(id);
    if (!user) {
      throw new UserNotFoundError();
    }
    return user;
  }

  create(user: User): User {
    user.id = v4();
    this.users.set(user.id, user);
    return user;
  }

  update(id: string, user: User): User {
    this.getById(id);
    user.id = id;
    this.users.set(id, user);
    return user;
  }

  delete(id: string) {
    this.getById(id);
    this.users.delete(id);
  }
}

export const userStorage = new UserStorage();
