import { Student } from '@/domain/forum/enterprise/entities/student';

export abstract class StudentsRepository {
    abstract create(student: Student): Promise<Student>
    abstract findByEmail(email: string): Promise<Student | null>
}
