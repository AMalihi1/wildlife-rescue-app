import { RescueRequestRepository } from "../../repositories/rescue-request/repository";
import { IRescueRequestService } from "./service.interface";
import { RescueRequestResponseDto } from "../../types/dto/rescue-request/response.dto";
import { CreateRescueRequestResponseDto } from "../../types/dto/rescue-request/create.response.dto";
import { mapCreateDtoToRescueRequest, mapRescueRequestToDto } from "./mapper";
import logger from "../../lib/logger";
import { CreateRescueRequestDto } from "../../types/dto/rescue-request/create.request.dto";
import { UserRepository } from "../../repositories/user/repository";
import { NotFoundError } from "../../lib/errors";
import { EventPublisher } from "../../lib/event-publisher";
import { EventType } from "../../types/enums";
import { RescueRequest } from "@prisma/client";

export class RescueRequestService implements IRescueRequestService {
    constructor(private readonly rescueRequestRepository: RescueRequestRepository, private readonly userRepository : UserRepository) {}
   
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

    async createRescueRequest(createRescueRequest: CreateRescueRequestDto): Promise<CreateRescueRequestResponseDto> {
        try
        {
            logger.debug({ createRescueRequest }, "service: create rescue request");
            
            const reporter = await this.userRepository.getUserbyId(createRescueRequest.reporterId);
            if (!reporter)
            {
                logger.warn( { reporterId: createRescueRequest.reporterId }, "reporter does not exist.");
                throw new NotFoundError(`Reporter with Id ${createRescueRequest.reporterId} not found`);
            } 
            const mappedCreateRescueRequest = mapCreateDtoToRescueRequest(createRescueRequest);
            const photoUrls = createRescueRequest.photos.map(p => p.photoUrl);
            const createdRescueRequest = await this.rescueRequestRepository.createRescueRequestWithPhotos(mappedCreateRescueRequest, photoUrls); 
            
            //publish created rescue request event
            await this.publishRescueRequestCreatedEvent(createdRescueRequest);

            return { rescueRequestId: createdRescueRequest.rescueRequestId };
        }
        catch (error)
        {
            logger.error({ createRescueRequest, err: error }, "service: create rescue request failed");
            throw error;
        }
    }

    private async publishRescueRequestCreatedEvent(createdRescueRequest: RescueRequest) : Promise<void>
    {
        const payload = {
            rescueRequestId: createdRescueRequest.rescueRequestId,
            reporterId: createdRescueRequest.reporterId,
            status: createdRescueRequest.status,
            animalType: createdRescueRequest.animalType,
            description: createdRescueRequest.description,
            pickupAddress: createdRescueRequest.pickupAddress,
            createdAt: createdRescueRequest.createdAt,
        }
        const eventPublisher = new EventPublisher();
        await eventPublisher.publish(EventType.RescueRequestCreated, payload);
    }
}