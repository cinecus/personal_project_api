const { Router } = require('express')
const { validate_token } = require('../../middleware/validate_token')
const excelController = require('./excelController')
const multer = require('../../middleware/multer')

const excelRouter = Router()

excelRouter.post('/import',
    multer('excel').single('file_upload'),
    validate_token(),
    excelController.importExcel
)

excelRouter.post('/export',
    validate_token(),
    excelController.exportExcel
)

module.exports = excelRouter