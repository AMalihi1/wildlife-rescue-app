import prisma from "../../db/db";
import { RescueRequestWithRelations } from "../../types/prisma/rescue-request.types";
import { IRescueRequestRepository } from "./repository.interface";
import logger from "../../lib/logger";
import { Prisma, RescueRequest } from "@prisma/client";

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

  async createRescueRequestWithPhotos(data: Prisma.RescueRequestUncheckedCreateInput, photoUrls: string[]): Promise<RescueRequest> {
    
    logger.debug(
      { reporterId: data.reporterId, photoCount: photoUrls.length },
      "repo: creating rescue request with photos"
    );

    try {
      return await prisma.$transaction(async (tx) => {
        const rescueRequest = await tx.rescueRequest.create({ data });
  
        const photoRows = photoUrls.map(url => ({
          photoUrl: url,
          rescueRequestId: rescueRequest.rescueRequestId
        }));
        await tx.rescueRequestPhoto.createMany({ data: photoRows });
  
        return rescueRequest;
      });
    } catch (error) {
      logger.error(
        {
          rescueRequest: data,
          photoCount: photoUrls.length,
          err: error,
        },
        "repo: failed to create rescue request with photos"
      );
      throw error;
    }
  }
}