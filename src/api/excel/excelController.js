const { success, failed } = require('../../config/response')
const excelToJson = require('convert-excel-to-json');
const xlsx = require('xlsx')
const fs = require('fs');

class excelController {
    async importExcel(req, res) {
        try {
            const file = req.file
            if (!!file) {
                const imported = excelToJson({
                    sourceFile: file.path,
                    header: {
                        rows: 1
                    },
                    columnToKey: {
                        '*': '{{columnHeader}}'
                    }
                })
                // console.log('result', result)
                const header = Object.keys(imported.Sheet1[0])
                const data = imported.Sheet1.map((el, i) => ({ ID: i + 1, ...el }))
                await fs.unlinkSync(file.path)
                success(res, 'success', { data, header: ['ID', ...header] })
            } else {
                failed(res, 'Network Error 404')
            }
        } catch (error) {
            console.log('error', error)
            failed(res, 'Network Error 404')
        }

    }

    async exportExcel(req, res) {
        try {
            const { data } = req.body
            // console.log('data', data)
            const newWB = xlsx.utils.book_new()
            const newWS = xlsx.utils.json_to_sheet(data)
            const file_name = 'newExcel.xlsx'
            xlsx.utils.book_append_sheet(newWB, newWS, 'Sheet1')
            const buffer = xlsx.write(newWB, { bookType: 'xlsx', bookSST: false, type: 'base64' })
            res.writeHead(200, {
                'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                "Content-Disposition": "attachment; filename=" + `${file_name}.xlsx`,
            });
            res.end(Buffer.from(buffer, 'base64'));
            //success(res, 'success')
        } catch (error) {
            console.log('error', error)
            failed(res, 'Network Error 404')
        }
    }
}

module.exports = new excelController()