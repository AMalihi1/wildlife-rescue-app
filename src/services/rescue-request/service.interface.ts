import { RescueRequest } from "@prisma/client";
import { RescueRequestResponseDto } from "../../types/dto/rescue-request/response.dto";

export interface IRescueRequestService 
{
    getRescueRequestById(rescueRequestId: string): Promise<RescueRequestResponseDto | null>;
}