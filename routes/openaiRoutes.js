const express = require('express');
const { summaryController, paragraphController, chatbotController, jsConvertorController, scifiImageController } = require('../controllers/openaiController');

const router = express.Router();

router.post('/summary', summaryController)
router.post('/paragraph', paragraphController)
router.post('/chatbot', chatbotController)
router.post('/js-convertor', jsConvertorController)
router.post('/scifi-image', scifiImageController)

module.exports = router;