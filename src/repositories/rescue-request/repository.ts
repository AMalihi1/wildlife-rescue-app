import prisma from "../../db/db";
import { IRescueRequestRepository } from "./repository.interface";

export class RescueRequestRepository implements IRescueRequestRepository
{

    async getRescueRequestById(rescueRequestId: string) {
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
                    },
                },
                rescuer: {
                    select: {
                        fullName: true,
                        phoneNumber: true,
                    },
                },
            }
        })
    }

}