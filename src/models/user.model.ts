export interface UserProps {
    userId: string;
    firstName: string;
    middleName?: string;
    lastName?: string;
    fullName: string;
    initialName: string;
    nationality?: string;
    salutation?: string;
    educationTitle1?: string;
    educationTitle2?: string;
    idNumber: string;
    birthPlace?: string;
    birthDate: Date;
    gender?: string;
    religion: string;
    race?: string;
    dialect?: string;
    maritalStatus: string;
    taxRegisteredName?: string;
    taxFileNumber?: string;
    userPhoto?: string;
    createdBy?: string;
    createdAt?: Date;
    updatedBy?: string;
    updatedAt?: Date;
}