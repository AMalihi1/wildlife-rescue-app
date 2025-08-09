import { RescueRequestRepository } from "../../repositories/rescue-request/repository";
import { IRescueRequestService } from "./service.interface";
import { RescueRequestResponseDto } from "../../types/dto/rescue-request/response.dto";
import { mapRescueRequestToDto } from "./mapper";
import logger from "../../lib/logger";

export class RescueRequestService implements IRescueRequestService {
    constructor(private readonly rescueRequestRepository: RescueRequestRepository) {}

    async getRescueRequestById(rescueRequestId: string): Promise<RescueRequestResponseDto | null> {
        try {
            logger.debug({ rescueRequestId }, "service: fetching rescue request");

            const rescueRequestWithRelations = await this.rescueRequestRepository.getRescueRequestById(rescueRequestId);
            if (!rescueRequestWithRelations) {
                logger.warn({ rescueRequestId }, "service: rescue request not found");
                return null;
            }

            const response = mapRescueRequestToDto(rescueRequestWithRelations);
            return response;
        } catch (error) {
            logger.error({ rescueRequestId, err: error }, "service: failed to get rescue request by id");
            throw error;
        }
    }
}