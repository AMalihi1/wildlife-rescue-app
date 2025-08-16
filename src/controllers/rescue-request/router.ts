import express from "express";
import { RescueRequestController } from "./controller";
import { RescueRequestService } from "../../services/rescue-request/service";
import { RescueRequestRepository } from "../../repositories/rescue-request/repository";
import { UserRepository } from "../../repositories/user/repository";

const router = express.Router();

//Setup Dependencies
const rescueRequestRepository = new RescueRequestRepository();
const userRepository = new UserRepository();
const rescueRequestService = new RescueRequestService(rescueRequestRepository, userRepository);
const controller = new RescueRequestController(rescueRequestService);

// Define routes
router.get("/:id", controller.getRescueRequestById.bind(controller));
router.post("/", controller.createRescueRequest.bind(controller));

export default router;