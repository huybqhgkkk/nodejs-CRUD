const ExcelJS = require('exceljs'); // Import thư viện exceljs
const Player = require('../models/player');

exports.exportPlayersToExcel = async (req, res) => {
    try {
        const players = await Player.find(); // Lấy dữ liệu từ cơ sở dữ liệu (hoặc bất kỳ nguồn dữ liệu nào khác)

        // Tạo một tệp Excel mới
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Players');

        // Tạo tiêu đề cột
        worksheet.addRow(['Name', 'Age', 'Bio']);

        // Thêm dữ liệu từ danh sách người chơi vào tệp Excel
        players.forEach((player) => {
            worksheet.addRow([player.name, player.age, player.bio]);
        });

        // Ghi tệp Excel vào bộ đệm
        const buffer = await workbook.xlsx.writeBuffer();

        // Đặt các header cho phản hồi
        res.setHeader('Content-Type', 'application/vnd.openxmlformats');
        res.setHeader('Content-Disposition', 'attachment; filename=players.xlsx');

        // Gửi tệp Excel như phản hồi
        res.end(Buffer.from(buffer, 'binary'));
    } catch (error) {
        console.error('error', error);
        res.status(500).json({ message: 'Export to Excel failed' });
    }
};
