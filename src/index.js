const express = require("express");

const path = require('path')
const dotenv = require('dotenv');
dotenv.config({
    path: path.resolve(__dirname, "../.env")
});


const { sendLog, sendMetric } = require('./services/cloudwatchService');
const app = express();
app.use(express.json());


app.use(async (req, res, next) => {

    const requestId = Date.now();
    const startTime = Date.now();

    req.requestId = requestId;
    req.startTime = startTime;

    await sendMetric("RequestCount", 1, "Count");

    res.on("finish", async () => {

        const duration = Date.now() - startTime;

        await sendMetric("RequestLatency", duration, "Milliseconds");

        if (res.statusCode >= 500) {
            await sendMetric("5xxErrorCount", 1, "Count");
        }

        await sendLog(
            "INFO",
            "Request completed",
            requestId,
            req.user ? req.user.id : null,
            req.originalUrl,
            res.statusCode,
            duration
        );
    });

    next();
});



// app.get("/api", (req, res) => { console.log("sdfghjf") })
app.get("/test", (req, res) => {
    res.status(200).json({ message: "serverer working" });
    // res.status(500).json({ message: "Test 500 error"});
});





const authRouter = require("./routes/authRoute");
const userRouter = require("./routes/userRoute");
const documentRouter = require("./routes/documentRoute");
const healthRoute = require("./routes/healthRoute");

app.use("/api", authRouter);
app.use("/api", userRouter);
app.use("/api", documentRouter);
app.use("/api", healthRoute);

app.listen(process.env.SERVER_PORT, async () => {
    // await sendLog(`INFO: Server started on port ${process.env.SERVER_PORT}`),
    await sendLog(
        "INFO",
        `Server started on port ${process.env.SERVER_PORT}`,
        null,
        null,
        null,
        200,
        0
    );
    console.log(`server is running on port ${process.env.SERVER_PORT}`);

});