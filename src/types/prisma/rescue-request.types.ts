import { Prisma } from "@prisma/client";

export type RescueRequestWithRelations = Prisma.RescueRequestGetPayload<{
  include: {
    reporter: { select: { fullName: true; phoneNumber: true; email: true } };
    rescuer: { select: { fullName: true; phoneNumber: true; email: true } };
    photos: { select: { photoUrl: true } };
  };
}>;