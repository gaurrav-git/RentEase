const express = require("express");

const router = express.Router();

const authenticate = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const noticeController = require("../controllers/noticeController");

// Owner publishes notice
router.post(
    "/",
    authenticate,
    authorize("OWNER"),
    noticeController.createNotice
);

// Everyone can read notices
router.get(
    "/",
    authenticate,
    noticeController.getNotices
);

// Owner deletes notice
router.delete(
    "/:id",
    authenticate,
    authorize("OWNER"),
    noticeController.deleteNotice
);

module.exports = router;