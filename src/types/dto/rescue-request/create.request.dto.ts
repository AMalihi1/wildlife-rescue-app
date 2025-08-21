import { AnimalType, RescueRequestStatus } from "../../enums";

export interface CreateRescueRequestDto 
{
    reporterId: string;
    pickupAddress: string;
    description: string | null;
    photos: { photoUrl: string }[];
    animalType: AnimalType;
}