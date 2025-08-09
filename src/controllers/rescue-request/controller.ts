import { IRescueRequestService } from "../../services/rescue-request/service.interface";
import { Request, Response } from "express";
import logger from "../../lib/logger";

export class RescueRequestController {
    constructor(private readonly rescueRequestService: IRescueRequestService) {}

    async getRescueRequestById(req: Request, res: Response) {
        try
        {
            logger.info({ method: req.method, url: req.url }, 'get rescue request received with id: ' + req.params.id);
            const rescueRequestId = req.params.id;
            const rescueRequestResponse = await this.rescueRequestService.getRescueRequestById(rescueRequestId);

            if (!rescueRequestResponse) {
                return res.status(404).json({ message: "Rescue Request with Id " + rescueRequestId + " not found" });
            }

            return res.status(200).json(rescueRequestResponse);
        }
        catch(error)
        {
            console.error(error); //todo : add logging
            return res.status(500).json({ message: "Internal Server Error" });
        }
    }
}