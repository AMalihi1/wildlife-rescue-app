import { RescueRequestStatus, AnimalType } from "../types/enums";

export interface RescueRequest {
  id: string;
  userId: string;
  status: RescueRequestStatus;
  description?: string;
  animalType: AnimalType;
  pickupAddress: string;
  createdAt: Date;
  updatedAt: Date;
}
