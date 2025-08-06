import { RescueRequestResponseDto } from "../../types/dto/rescue-request/response.dto";
import { RescueRequestStatus, AnimalType } from "../../types/enums";    
import { RescueRequestWithRelations } from "../../types/prisma/rescue-request.types";


export function mapRescueRequestToDto(rescueRequestWithRelations: RescueRequestWithRelations): RescueRequestResponseDto {
    return {
      rescueRequestId: rescueRequestWithRelations.rescueRequestId,
      pickupAddress: rescueRequestWithRelations.pickupAddress,
      status: rescueRequestWithRelations.status as RescueRequestStatus,
      description: rescueRequestWithRelations.description,
      animalType: rescueRequestWithRelations.animalType as AnimalType,
      createdAt: rescueRequestWithRelations.createdAt,
      updatedAt: rescueRequestWithRelations.updatedAt,
      photos: rescueRequestWithRelations.photos,
      reporter: {
        reporterId: rescueRequestWithRelations.reporterId,
        fullName: rescueRequestWithRelations.reporter.fullName,
        phoneNumber: rescueRequestWithRelations.reporter.phoneNumber,
        email: rescueRequestWithRelations.reporter.email,
      },
      rescuer: rescueRequestWithRelations.rescuer
      ? {
          rescuerId: rescueRequestWithRelations.rescuerId!,
          fullName: rescueRequestWithRelations.rescuer.fullName,
          phoneNumber: rescueRequestWithRelations.rescuer.phoneNumber,
          email: rescueRequestWithRelations.rescuer.email,
        }
      : null
    };
  }