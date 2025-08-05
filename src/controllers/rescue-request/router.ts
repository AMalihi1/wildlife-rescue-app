import express from "express";
import { RescueRequestController } from "./controller";
import { RescueRequestService } from "../../services/rescue-request/service";
import { RescueRequestRepository } from "../../repositories/rescue-request/repository";

const router = express.Router();

//Setup Dependencies
const rescueRequestRepository = new RescueRequestRepository();
const rescueRequestService = new RescueRequestService(rescueRequestRepository);
const controller = new RescueRequestController(rescueRequestService);

// Define a GET route for /rescue-requests/:id
router.get("/:id", controller.getRescueRequestById.bind(controller));

export default router;