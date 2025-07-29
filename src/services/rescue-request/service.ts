import { RescueRequestRepository } from "../../repositories/rescue-request/repository";
import { IRescueRequestService } from "./service.interface";

export class RescueRequestService implements IRescueRequestService
{
    constructor(private readonly rescueRequestRepository: RescueRequestRepository) {}

    async getRescueRequestById(rescueRequestId: string) {
        return await this.rescueRequestRepository.getRescueRequestById(rescueRequestId);
    }
}