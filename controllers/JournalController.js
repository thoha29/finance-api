const { journal, account_category, transaction } = require('../models');

class JournalController {
  static async getJournal(req, res) {
    const { accountKey } = req.query;

    // Siapkan kondisi where secara dinamis
    const whereClause = {};
    if (accountKey) {
      whereClause.rkoderek = accountKey;
    }

    try {
      const result = await journal.findAll({
        where: whereClause, // hanya akan terisi jika accountKey ada
        include: [
          {
            model: account_category,
            as: 'account',
            attributes: ['id', 'account_code', 'name5'],
          },
          {
            model: transaction,
            attributes: ['id', 'rreferensi', 'rterang'],
          },
        ],
        attributes: [
          'id',
          'rkoderek',
          'rtanggal',
          'rreferensi',
          'rkodepo',
          'rdebet',
          'rkredit',
        ],
      });
      res.status(200).json({ result });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}

module.exports = JournalController;
