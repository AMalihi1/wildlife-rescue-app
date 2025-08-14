import { User } from "@prisma/client"

export interface IUserRepository 
{
    getUserbyId(userId : string) : Promise<User | null>;
}