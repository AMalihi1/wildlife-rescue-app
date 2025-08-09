import prisma from "../../db/db";
import { RescueRequestWithRelations } from "../../types/prisma/rescue-request.types";
import { IRescueRequestRepository } from "./repository.interface";
import logger from "../../lib/logger";

export class RescueRequestRepository implements IRescueRequestRepository {
  async getRescueRequestById(rescueRequestId: string): Promise<RescueRequestWithRelations | null> {
    try {
      logger.debug({ rescueRequestId }, "repo: querying rescueRequest by id");
      const result = await prisma.rescueRequest.findUnique({
        where: {
          rescueRequestId: rescueRequestId,
        },
        include: {
          photos: {
            select: {
              photoUrl: true,
            },
          },
          reporter: {
            select: {
              fullName: true,
              phoneNumber: true,
              email: true,
            },
          },
          rescuer: {
            select: {
              fullName: true,
              phoneNumber: true,
              email: true,
            },
          },
        },
      });
      return result;
    } catch (error) {
      logger.error({ rescueRequestId, err: error }, "repo: failed querying rescueRequest by id");
      throw error;
    }
  }
}