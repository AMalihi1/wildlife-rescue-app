import { RescueRequestResponseDto } from "../../types/dto/rescue-request/response.dto";
import { CreateRescueRequestDto } from "../../types/dto/rescue-request/create.request.dto";
import { CreateRescueRequestResponseDto } from "../../types/dto/rescue-request/create.response.dto";

export interface IRescueRequestService 
{
    getRescueRequestById(rescueRequestId: string): Promise<RescueRequestResponseDto | null>;
    createRescueRequest(createRescueRequest: CreateRescueRequestDto): Promise<CreateRescueRequestResponseDto>;
}