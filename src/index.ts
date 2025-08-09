import express from "express";
import rescueRequestRouter from "./controllers/rescue-request/router"; 
import logger from "./lib/logger";

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use("/rescue-requests", rescueRequestRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  logger.info({ port: PORT }, 'Server running');
});