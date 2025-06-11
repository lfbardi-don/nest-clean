import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { execSync } from 'node:child_process';
import { randomUUID } from 'node:crypto';

const prisma = new PrismaClient();

function generateUniqueDBUrl(schemaId: string) {
    if (!process.env.DATABASE_URL) {
        throw new Error('Please provide a DATABASE_URL in the .env file');
    }
    const url = new URL(process.env.DATABASE_URL);
    url.searchParams.set('schema', schemaId);
    return url.toString();
}

const schemaId = randomUUID();

beforeAll(async () => {
    process.env.DATABASE_URL = generateUniqueDBUrl(schemaId);

    execSync('npx prisma migrate deploy');
});

afterAll(async () => {
    await prisma.$executeRawUnsafe(`DROP SCHEMA IF EXISTS "${schemaId}" CASCADE`);
    await prisma.$disconnect();
});