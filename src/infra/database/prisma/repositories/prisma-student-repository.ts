import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { Student } from "@/domain/forum/enterprise/entities/student";
import { StudentsRepository } from "@/domain/forum/application/repositories/students-repository";
import { PrismaStudentMapper } from "../mappers/prisma-student-mapper";

@Injectable()
export class PrismaStudentRepository implements StudentsRepository {
    constructor(private readonly prisma: PrismaService) { }

    async create(student: Student): Promise<Student> {
        const data = PrismaStudentMapper.toPrisma(student);

        await this.prisma.user.create({
            data,
        });

        return student;
    }

    async findByEmail(email: string): Promise<Student | null> {
        const student = await this.prisma.user.findUnique({
            where: {
                email,
            },
        });

        if (!student) {
            return null;
        }

        return PrismaStudentMapper.toDomain(student);
    }
}