import { User } from "@prisma/client";
import { IUserRepository } from "./repository.interface";
import logger from "../../lib/logger";
import prisma from "../../db/db";

export class UserRepository implements IUserRepository  {
    
    async getUserbyId(userId: string): Promise<User | null> {
        try {
            logger.debug({userId}, "repo: get user details");
            const user = await prisma.user.findUnique({ where : { userId} });
            return user;
        
        } catch(error) {
            logger.error({userId, err: error}, "repo: failed querying user by id");
            throw error;
        }
    }
}