import { RescueRequestWithRelations } from "../../types/prisma/rescue-request.types";
import { Prisma, RescueRequest } from "@prisma/client";

export interface IRescueRequestRepository 
{
    getRescueRequestById(rescueRequestId: string): Promise<RescueRequestWithRelations | null>;
    createRescueRequestWithPhotos(data: Prisma.RescueRequestUncheckedCreateInput,  photoUrls: string[]) : Promise<RescueRequest>;
}