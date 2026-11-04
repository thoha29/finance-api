const { project_cost, project_cost_journal, Sequelize } = require('../models');

class Inquiry {
  static async getInquiry(req, res) {
    try {
      const data = await project_cost_journal.findAll({
        attributes: [
          'pct_id',
          ['groupId', 'kode_singkat'],
          [Sequelize.col('project_cost.name3'), 'name3'],
          [
            Sequelize.fn('SUM', Sequelize.col('project_cost_journal.total')),
            'total_amount',
          ],
        ],
        include: [
          {
            model: project_cost,
            attributes: [],
          },
        ],
        group: [
          'project_cost_journal.pct_id',
          'project_cost_journal.groupId',
          'project_cost.name3',
        ],
        raw: true,
      });

      return res.json({
        success: true,
        count: data.length,
        data,
      });
    } catch (error) {
      console.error('[GET INQUIRY ERROR]', error);
      return res.status(500).json({
        success: false,
        message: 'Terjadi kesalahan server',
      });
    }
  }
}

module.exports = Inquiry;
