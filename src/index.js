const express = require("express");

const path = require('path')
const dotenv = require('dotenv');
dotenv.config({
    path: path.resolve(__dirname, "../.env")
});

const app = express();
app.use(express.json());


// app.get("/api", (req, res) => { console.log("sdfghjf") })
app.get("/test", (req, res) => {
    res.status(200).json({ message: "serverer working" });
});

const { sendLog } = require('./services/cloudwatchService');
const authRouter = require("./routes/authRoute");
const userRouter = require("./routes/userRoute");
const documentRouter = require("./routes/documentRoute");
const healthRoute = require("./routes/healthRoute");

app.use("/api", authRouter);
app.use("/api", userRouter);
app.use("/api", documentRouter);
app.use("/api", healthRoute);

app.listen(process.env.SERVER_PORT, async () => {
    await sendLog(`INFO: Server started on port ${process.env.SERVER_PORT}`),
        console.log(`server is running on port ${process.env.SERVER_PORT}`);

});