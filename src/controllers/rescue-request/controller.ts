import { IRescueRequestService } from "../../services/rescue-request/service.interface";
import { Request, Response } from "express";


export class RescueRequestController {
    constructor(private readonly rescueRequestService: IRescueRequestService) {}

    async getRescueRequestById(req: Request, res: Response) {
        try
        {
            const rescueRequestId = req.params.rescueRequestId;
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