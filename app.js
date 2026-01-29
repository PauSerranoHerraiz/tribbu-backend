require("dotenv").config();

const { connectDB } = require("./db");

const express = require("express");

const app = express();
require("./config")(app);

app.use(async (req, res, next) => {
    try {
        await connectDB();
        next();
    } catch (e) {
        next(e);
    }
});

const indexRoutes = require("./routes/index.routes");
app.use("/api", indexRoutes);

const authRoutes = require("./routes/auth.routes");
app.use("/auth", authRoutes);

const tribbuRoutes = require("./routes/tribbu.routes");
app.use("/api", tribbuRoutes);

const userRoutes = require("./routes/user.routes");
app.use("/api", userRoutes);

const eventRoutes = require("./routes/events.routes");
app.use("/api", eventRoutes);

const childrenRoutes = require("./routes/children.routes");
app.use("/api", childrenRoutes);

const notificationRoutes = require("./routes/notifications.routes");
app.use("/api", notificationRoutes);

require("./error-handling")(app);

connectDB();

module.exports = app;
