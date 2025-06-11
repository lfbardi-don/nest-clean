import { Slug } from '@/domain/forum/enterprise/entities/value-objects/slug';

test('should create a slug from a string', () => {
  const slug = Slug.fromString('Hello World');
  expect(slug.value).toBe('hello-world');
});
