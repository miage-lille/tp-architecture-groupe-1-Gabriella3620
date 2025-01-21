import { IUserRepository } from '../ports/user-repository.interface';
import { User } from '../entities/user.entity';

export class InMemoryUserRepository implements IUserRepository {
  constructor(public database: User[] = []) {}
  async findById(id: string): Promise<User | null> {
    return this.database.find((user) => user.isSameUser(id)) || null;
  }

  async create(user: User): Promise<void> {
    this.database.push(user);
  }
}
