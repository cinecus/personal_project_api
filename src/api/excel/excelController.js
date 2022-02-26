const { success, failed } = require('../../config/response')
const excelToJson = require('convert-excel-to-json');
const fs = require('fs');

class excelController {
    async importExcel(req, res) {
        const file = req.file
        if (!!file) {
            const result = excelToJson({
                sourceFile: file.path,
                header: {
                    rows: 1
                },
                sheets: [
                    {
                        name: 'Sheet1',
                        columnToKey: {
                            A: 'id',
                            B: 'name',
                            C: 'age',
                            D: 'position'
                        }
                    }
                ]
            })
            // console.log('result', result)
            // console.log('file', file)
            await fs.unlinkSync(file.path)
            success(res, 'success', { data: result.Sheet1 })
        } else {
            failed(res, 'Network Error 404')
        }
    }
}

module.exports = new excelController()