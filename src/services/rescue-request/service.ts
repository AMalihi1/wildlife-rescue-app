import { RescueRequestRepository } from "../../repositories/rescue-request/repository";
import { IRescueRequestService } from "./service.interface";
import { RescueRequestResponseDto } from "../../types/dto/rescue-request/response.dto";
import { mapRescueRequestToDto } from "./mapper";

export class RescueRequestService implements IRescueRequestService
{
    constructor(private readonly rescueRequestRepository: RescueRequestRepository) {}

    async getRescueRequestById(rescueRequestId: string): Promise<RescueRequestResponseDto | null> {
        const rescueRequestWithRelations = await this.rescueRequestRepository.getRescueRequestById(rescueRequestId);
        if (!rescueRequestWithRelations) {
            //todo : add logging
            return null;
        }
        
        const response = mapRescueRequestToDto(rescueRequestWithRelations);
        return response;
    }
}