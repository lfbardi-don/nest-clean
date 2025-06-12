import { StudentsRepository } from "../repositories/students-repository";
import { Student } from "../../enterprise/entities/student";
import { Either, left, right } from "@/core/either";
import { Injectable } from "@nestjs/common";
import { StudentAlreadyExistsError } from "./errors/student-already-exists-error";
import { HashGenerator } from "@/domain/forum/application/cryptography/hash-generator";

interface RegisterStudentUseCaseProps {
    name: string;
    email: string;
    password: string;
}

type RegisterStudentUseCaseResponse = Either<StudentAlreadyExistsError, Student>;

@Injectable()
export class RegisterStudentUseCase {
    constructor(private studentsRepository: StudentsRepository, private hashGenerator: HashGenerator) { }

    async execute({
        name,
        email,
        password,
    }: RegisterStudentUseCaseProps): Promise<RegisterStudentUseCaseResponse> {
        const studentWithSameEmail = await this.studentsRepository.findByEmail(email);

        if (studentWithSameEmail) {
            return left(new StudentAlreadyExistsError(email));
        }

        const passwordHash = await this.hashGenerator.hash(password);

        const student = Student.create({
            name,
            email,
            password: passwordHash,
        });

        await this.studentsRepository.create(student);

        return right(student);
    }
}
