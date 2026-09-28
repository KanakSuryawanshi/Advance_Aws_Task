const pool = require("../config/dbConfig");

const { uploadToS3, deleteFromS3, getDownloadUrl } = require("../services/s3Service");
const { sendNotification } = require('../services/snsService');
const { sendLog, sendMetric } = require('../services/cloudwatchService');


const postDocument = async (req, res) => {

    try {
        // const userId = req.user.id;
        // const file = req.file;
        const id = req.body.id;
        const userId = req.user.id;
        const file = req.file;


        if (!file) {
            return res.status(400).json({ message: "Please upload a document" });
        }

        const key = `documents/user-${userId}/${Date.now()}-${file.originalname}`;
        // await sendLog(`INFO: Upload started - userId=${userId}, fileName=${file.originalname}`);
        await sendLog("INFO", "Upload started", req.requestId, userId, req.originalUrl, null, null);


        const s3Url = await uploadToS3(file.buffer, key, file.mimetype, req.requestId, userId, req.originalUrl);           // Upload file to S3

        // await sendLog("INFO: s3 upload successful");
        if (!s3Url) {
            await sendMetric("UploadFailureCount", 1, "Count");

            return res.status(500).json({
                message: "S3 upload failed"
            });
        }

        const query = `INSERT INTO documents (id, user_id, original_name, s3_key, s3_url, file_size, mime_type) values (?, ?, ?, ?, ?, ?, ?)`;

        await pool.execute(query, [
            id,
            userId,
            file.originalname,
            key,
            s3Url,
            file.size,
            file.mimetype
        ]);
        await sendNotification(
            userId,
            key,
            file.originalname,
            req.requestId,
            req.originalUrl
        );

        // await sendNotification(`Document uploaded successfully : ${file.originalname}`);

        // await sendLog(userId, file.originalname);
        // await sendLog("INFO: SNS notification published");

        res.status(201).json({
            message: "Document uploaded successfully",
            data: {
                original_name: file.originalname,
                s3_key: key,
                s3_url: s3Url,
                file_size: file.size,
                mime_type: file.mimetype
            }
        });

    } catch (err) {
        console.log("Error uploading document:", err);
        res.status(500).json({ message: "Document upload failed" });
    }
};


const getUserDocuments = async (req, res) => {
    let query = "SELECT * FROM documents WHERE user_id = ?";

    try {
        const [result] = await pool.execute(query, [req.user.id]);
        console.log("Documents fetched successfully", result);
        res.status(200).json({ message: "Documents fetched successfully", data: result });
    } catch (err) {
        console.log("Error fetching documents", err.message);
        res.status(500).json({ message: "Error fetching documents" });
    }
};



const getDocument = async (req, res) => {
    let query = "SELECT * FROM documents WHERE id = ?";

    try {
        const [result] = await pool.execute(query, [req.params.id]);
        console.log("Document fetched successfully", result);

        res.status(200).json({ message: "Document fetched successfully", data: result });

    } catch (err) {
        console.log("Error fetching document");
    }
};


const deleteDocument = async (req, res) => {
    let query = "SELECT s3_key FROM documents WHERE id = ?";

    try {
        const [result] = await pool.execute(query, [req.params.id]);
        await deleteFromS3(result[0].s3_key);
        query = "DELETE FROM documents WHERE id = ?";
        await pool.execute(query, [req.params.id]);
        res.status(200).json({ message: "Document deleted successfully" });

    } catch (err) {
        console.log("Error deleting document", err.message);
        res.status(500).json({ message: "Error deleting document" });
    }
};


const downloadDocument = async (req, res) => {
    let query = "SELECT s3_key FROM documents WHERE id = ? AND user_id = ?";

    try {

        const [result] = await pool.execute(query, [req.params.id, req.user.id]);

        if (result.length === 0) {
            return res.status(404).json({ message: "Document not found" });
        }

        const url = await getDownloadUrl(result[0].s3_key);
        res.status(200).json({ message: "Download URL generated successfully", url: url });

    } catch (err) {

        console.log("Error generating download URL", err.message);
        res.status(500).json({ message: "Error generating download URL" });
    }
};


module.exports = { postDocument, getUserDocuments, getDocument, deleteDocument, downloadDocument };