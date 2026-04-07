require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const http = require("http");
const { Server } = require("socket.io");
const { globalLimiter, apiLimiter } = require("./middlewares/rate_limiter");
const errorHandler = require("./middlewares/error_handler");

const app = express();
const server = http.createServer(app);

/*
|--------------------------------------------------------------------------
| SOCKET.IO
|--------------------------------------------------------------------------
*/
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    credentials: true,
  },
});

app.set("io", io);

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

/*
|--------------------------------------------------------------------------
| GLOBAL MIDDLEWARE
|--------------------------------------------------------------------------
*/

// security headers
app.use(helmet());

// enable CORS
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  }),
);

// request logger
app.use(morgan("dev"));

// global baseline
app.use(globalLimiter);

// apply to all API routes
app.use("/api", apiLimiter);

// body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// cookie parser
app.use(cookieParser());

// static uploads folder
app.use("/uploads", express.static("uploads"));

/*
|--------------------------------------------------------------------------
| ROUTES
|--------------------------------------------------------------------------
*/

const authRoutes = require("./routes/auth_routes");
const requestRoutes = require("./routes/request_routes");
const cashierRoutes = require("./routes/cashier_routes");
const rmoRoutes = require("./routes/rmo_routes");
const documentRoutes = require("./routes/document_routes");
const accountRoutes = require("./routes/account_routes");

app.use("/api/auth", authRoutes);
app.use("/api/request", requestRoutes);
app.use("/api/cashier", cashierRoutes);
app.use("/api/rmo", rmoRoutes);
app.use("/api/documents", documentRoutes);
app.use("/api/accounts", accountRoutes);

/*
|--------------------------------------------------------------------------
| GLOBAL ERROR HANDLER
|--------------------------------------------------------------------------
*/

app.use(errorHandler);

/*
|--------------------------------------------------------------------------
| SERVER
|--------------------------------------------------------------------------
*/

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
