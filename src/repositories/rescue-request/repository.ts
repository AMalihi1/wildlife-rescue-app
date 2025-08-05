import prisma from "../../db/db";
import { RescueRequestWithRelations } from "../../types/prisma/rescue-request.types";
import { IRescueRequestRepository } from "./repository.interface";

export class RescueRequestRepository implements IRescueRequestRepository
{

    async getRescueRequestById(rescueRequestId: string): Promise<RescueRequestWithRelations | null> {
        return await prisma.rescueRequest.findUnique({
            where: {
                rescueRequestId: rescueRequestId,
            },
            include: {
                photos: {
                    select: {
                        photoUrl: true,
                    },
                },
                reporter: {
                    select: {
                        fullName: true,
                        phoneNumber: true,
                        email: true,
                    },
                },
                rescuer: {
                    select: {
                        fullName: true,
                        phoneNumber: true,
                        email: true,
                    },
                },
            }
        })
    }
}