import { RescueRequestWithRelations } from "../../types/prisma/rescue-request.types";

export interface IRescueRequestRepository 
{
    getRescueRequestById(rescueRequestId: string): Promise<RescueRequestWithRelations | null>;
}