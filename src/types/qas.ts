export interface IQAS {
    id?: string;
    nameQ: string;
    emailQ: string;
    phoneQ: string;
    contentQ: string;
    timeQ: Date;
    nameA?: string;
    timeA: Date;
    contentA: string;
    active: boolean;
    createdBy?: string;
    isDeleted?: boolean;
    deletedAt?: boolean | null;
    createdAt?: string;
    updatedAt?: string;
}