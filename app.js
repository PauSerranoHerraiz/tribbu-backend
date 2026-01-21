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

app.use("/api", require("./routes/tribbu.routes"));
app.use("/api", require("./routes/events.routes"));
app.use("/api", require("./routes/children.routes"));
app.use("/api", require("./routes/user.routes"))

require("./error-handling")(app);

module.exports = app;
