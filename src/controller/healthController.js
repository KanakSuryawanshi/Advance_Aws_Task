const healthCheck = (req, res) => {
    res.status(200).json({ status: "OK" });
};


const readyCheck = (req, res) => {
    res.status(200).json({ status: "READY" });
};

module.exports = { healthCheck, readyCheck };