const express = require("express");
const { bookService } = require("../controllers/serviceController");

const router = express.Router();

router.post("/book", bookService);

module.exports = router;
