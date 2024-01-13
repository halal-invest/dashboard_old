export interface IProfiles {
    id: number;
    userId: number | null;
    otpUserId: number | null;
    name: string | null;
    email: string | null;
    phone: string | null;
    address: string | null;
    city: string | null;
    country: string | null;
    postal_code: string | null;
    createdAt: Date;
    updatedAt: Date;
    user: IUsers | null;
    optUser: IOtpUser | null;
    roles: IRoles[];
}

export interface IUsers {
    id: number;
    email: string | null;
    password: string | null;
    verified: boolean;
    isActive: boolean;
    isDeleted: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface IOtpUser {
    id: number;
    phone: string;
    isActive: boolean;
    isDeleted: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface IRoles {
    id: number;
    title: string;
    description: string;
    isActive: boolean;
    isDeleted: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface IPermissions {
    roles: IRoles[];
    id: number;
    title: string;
    description: string | null;
    createdAt: Date;
    updatedAt: Date;
}
