import { User } from './model';

class UserStorage {
  private users: Map<string, User>;

  constructor() {
    this.users = new Map<string, User>();
  }

  get(): User[] {
    return [...this.users.values()];
  }

  getById(id: string): User | null {
    return this.users.get(id) ?? null;
  }

  create(user: User): User {
    const id = crypto.randomUUID();
    user.id = id;

    if (user.id) this.users.set(user.id, user);
    return user;
  }

  update(id: string, user: User): User {
    this.users.set(id, user);
    return user;
  }

  delete(id: string) {
    this.users.delete(id);
  }
}

export default UserStorage;
