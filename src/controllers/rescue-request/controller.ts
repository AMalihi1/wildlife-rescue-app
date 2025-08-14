import { IRescueRequestService } from "../../services/rescue-request/service.interface";
import { Request, Response } from "express";
import logger from "../../lib/logger";

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
        const rescueRequest = req.body;
        try {
            logger.info({ method: req.method, url: req.url, rescueRequest }, "new rescue request call received");
            const rescueRequestResponse = await this.rescueRequestService.createRescueRequest(rescueRequest);
            return res.status(201).json(rescueRequestResponse);
        } catch (error) {
            logger.error({ rescueRequest, err: error }, "failed to handle createRescueRequest");
            return res.status(500).json({ message: "Internal Server Error" });
        }
    }
}