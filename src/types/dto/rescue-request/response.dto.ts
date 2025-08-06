import { AnimalType, RescueRequestStatus } from "../../enums";

export interface RescueRequestResponseDto 
{
    rescueRequestId: string;
    reporter: {
        reporterId: string;
        fullName: string;
        phoneNumber: string;
        email: string | null;
    };
    rescuer: {
        rescuerId: string;
        fullName: string;
        phoneNumber: string;
        email: string | null;
    } | null;
    pickupAddress: string;
    status: RescueRequestStatus;
    description: string | null;
    photos: { photoUrl: string }[];
    animalType: AnimalType;
    createdAt: Date;
    updatedAt: Date;
}