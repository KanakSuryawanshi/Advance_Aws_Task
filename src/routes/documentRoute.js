const express = require("express");

const router = express.Router();

const upload = require("../middleware/uploadMiddleware");
const authenticateToken = require("../middleware/authMiddleware");
const { postDocument, getUserDocuments, getDocument, deleteDocument, downloadDocument } = require("../controller/documentController");


router.post("/documents/upload", authenticateToken, upload.single("document"), postDocument);
router.get("/documents", authenticateToken, getUserDocuments);
router.get("/documents/:id", authenticateToken, getDocument);
router.delete("/documents/:id", authenticateToken, deleteDocument);
router.get("/documents/:id/download", authenticateToken, downloadDocument);


module.exports = router;