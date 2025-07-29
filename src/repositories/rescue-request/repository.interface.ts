import { RescueRequest } from "@prisma/client";

export interface IRescueRequestRepository 
{
    getRescueRequestById(rescueRequestId: string): Promise<RescueRequest | null>;
}