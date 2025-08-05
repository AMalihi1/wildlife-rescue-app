import express from "express";
import rescueRequestRouter from "./controllers/rescue-request/router"; 

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use("/rescue-requests", rescueRequestRouter);

// Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});