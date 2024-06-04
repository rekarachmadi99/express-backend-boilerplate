export interface UserAccountProps {
    id: number;
    userId: string;
    email?: string;
    username?: string;
    password?: string;
    accountType?: string;
    refreshToken?: string;
    createdBy?: string;
    createdAt?: Date;
    updatedBy?: string;
    updatedAt?: Date;
}