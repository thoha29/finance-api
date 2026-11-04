const {
  account_category,
  transaction,
  journal,
  sequelize,
  Sequelize,
} = require('../models');

class ReportController {
  static async getReportCOA(req, res) {
    let { bulan, tahun, kodeCOA, kodeInt, kodeExt, kodePro, kodeBuNit } =
      req.query;

    bulan = parseInt(bulan);
    tahun = parseInt(tahun);

    try {
      const whereClause = [];

      if (!isNaN(tahun)) {
        whereClause.push(
          sequelize.where(
            sequelize.fn('YEAR', sequelize.col('journal.rtanggal')),
            tahun
          )
        );
      }

      if (!isNaN(bulan)) {
        whereClause.push(
          sequelize.where(
            sequelize.fn('MONTH', sequelize.col('journal.rtanggal')),
            bulan
          )
        );
      }

      // Filter kode COA
      if (kodeCOA) {
        whereClause.push({ rkoderek: kodeCOA });
      }
      // Filter kode Internal
      if (kodeInt) {
        whereClause.push({ rkodeint: kodeInt });
      }
      // Filter kode External
      if (kodeExt) {
        whereClause.push({ rkodeext: kodeExt });
      }
      // Filter kode Projek
      if (kodePro) {
        whereClause.push({ rkodepro: kodePro });
      }
      // Filter kode Busness Unit
      if (kodeBuNit) {
        whereClause.push({ bunit: kodeBuNit });
      }

      const journals = await journal.findAll({
        attributes: [
          'id',
          'rkoderek',
          'rtanggal',
          'rreferensi',
          'rdebet',
          'rkredit',
          'rkodepo',
        ],
        include: [
          {
            model: account_category,
            as: 'account',
            attributes: ['id', 'account_code', 'name5'],
          },
          {
            model: transaction,
            attributes: ['id', 'rtanggal', 'rreferensi', 'rterang'],
          },
        ],
        where: {
          [Sequelize.Op.and]: whereClause,
        },
        raw: true,
        nest: true,
      });

      // Grouping & reformatting
      const grouped = {};

      journals.forEach((entry) => {
        const kode = entry.rkoderek;
        if (!grouped[kode]) {
          grouped[kode] = [];
        }
        grouped[kode].push(entry);
      });

      const result = Object.entries(grouped).map(([rkoderek, data]) => {
        const jmldebet = data.reduce(
          (sum, item) => sum + Number(item.rdebet || 0),
          0
        );
        const jmlkredit = data.reduce(
          (sum, item) => sum + Number(item.rkredit || 0),
          0
        );
        const balance = jmldebet - jmlkredit;

        return {
          rkoderek,
          jmldebet,
          jmlkredit,
          balance,
          data,
        };
      });

      return res.status(200).json(result);
    } catch (err) {
      console.error('Error in getReportCOA:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
}

module.exports = ReportController;
