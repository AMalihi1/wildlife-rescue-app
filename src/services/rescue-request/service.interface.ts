import { RescueRequest } from "@prisma/client";

export interface IRescueRequestService 
{
    getRescueRequestById(rescueRequestId: string): Promise<RescueRequest | null>;
}