const express = require("express");
const router = express.Router();

const {createScan , getScan} = require("../controllers/scanController");

router.post('/', createScan);
router.get('/:id', getScan);

module.exports = router;