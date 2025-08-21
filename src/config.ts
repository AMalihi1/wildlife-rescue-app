import { EventType } from "./types/enums";
import dotenv from "dotenv";
dotenv.config();

export const AWS_REGION = process.env.AWS_REGION!;

export const eventQueues: Record<string, string> = {
    [EventType.RescueRequestCreated]: process.env.QUEUE_URL_RESCUE_CREATED!,
    [EventType.RescueRequestAssigned]: process.env.QUEUE_URL_RESCUE_ASSIGNED!
}

export const eventTopics: Record<string, string> = {
    [EventType.RescueRequestCreated]: process.env.RESCUE_REQUEST_CREATED_TOPIC_ARN!,
    [EventType.RescueRequestAssigned]: process.env.RESCUE_REQUEST_ASSIGNED_TOPIC_ARN!,
}
  