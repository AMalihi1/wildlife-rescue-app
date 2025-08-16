import { IRescueRequestService } from "../../services/rescue-request/service.interface";
import { Request, Response } from "express";
import logger from "../../lib/logger";
import { NotFoundError } from "../../lib/errors";
import { createRescueRequestSchema } from "../../types/zod/create-rescue-request.schema";

export class RescueRequestController {
    constructor(private readonly rescueRequestService: IRescueRequestService) {}

    async getRescueRequestById(req: Request, res: Response) {
        const rescueRequestId = req.params.id;
        try {
            logger.info({ method: req.method, url: req.url, rescueRequestId }, "get rescue request received");

            const rescueRequestResponse = await this.rescueRequestService.getRescueRequestById(rescueRequestId);

            if (!rescueRequestResponse) {
                logger.warn({ rescueRequestId }, "rescue request not found");
                return res.status(404).json({ message: "Rescue Request with Id " + rescueRequestId + " not found" });
            }

            return res.status(200).json(rescueRequestResponse);
        } catch (error) {
            logger.error({ rescueRequestId, err: error }, "failed to handle getRescueRequestById");
            return res.status(500).json({ message: "Internal Server Error" });
        }
    }

    async createRescueRequest(req: Request, res: Response) {
        try {
    
            logger.info({ method: req.method, url: req.url, body:req.body }, "new rescue request call received");
            
            const validationResult = createRescueRequestSchema.safeParse(req.body)

            if (!validationResult.success)
            {
                const errors = validationResult.error.issues.map( issue => issue.message);
                logger.warn({ body: req.body, errors }, "Validation failed");
                return res.status(400).json({ message: "Validation failed", errors });
            }

            const result = await this.rescueRequestService.createRescueRequest(req.body);
            return res.status(201).json(result);
        } catch (error) {
            
            logger.error({ method: req.method, url: req.url, err: error }, "controller: create rescue request failed");
            
            if (error instanceof NotFoundError) {
                return res.status(404).json({ message: error.message });
            }
            return res.status(500).json({ message: "Internal Server Error" });
        }
    }
}