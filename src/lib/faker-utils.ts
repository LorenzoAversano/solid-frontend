import { faker } from '@faker-js/faker';
import { Database } from '../types/database.types';

type User = Database['public']['Tables']['users']['Insert'];

export function generateFakeUser(): User {
  return {
    name: faker.person.fullName(),
    email: faker.internet.email(),
    avatar: faker.image.avatar(),
  };
}

export function generateFakeUsers(count: number): User[] {
  return Array.from({ length: count }, generateFakeUser);
}