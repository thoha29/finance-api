const {
  project_cost_transaction,
  project_cost_journal,
  Sequelize,
  sequelize,
} = require('../models');

class ProjectCostController {
  static async getTransaction(req, res) {
    try {
      const { keyword } = req.query;
      let { page, limit } = req.query;

      // Konversi nilai page dan limit ke tipe data numerik
      page = parseInt(page) || 1;
      limit = parseInt(limit) || 10;

      // Hitung offset berdasarkan halaman dan limit
      const offset = (page - 1) * limit;

      let pcTransactions;
      let totalCount;

      const dateRegex = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/;
      let match = null;
      if (keyword) {
        match = keyword.match(dateRegex);
      }
      let formattedDate = '';

      if (match) {
        // Format ulang menjadi YYYY-MM-DD untuk pencarian di database
        formattedDate = `${match[3]}-${match[2].padStart(
          2,
          '0'
        )}-${match[1].padStart(2, '0')}`;
      }

      if (keyword) {
        [pcTransactions, totalCount] = await Promise.all([
          project_cost_transaction.findAll({
            where: {
              [Sequelize.Op.or]: [
                { project: { [Sequelize.Op.like]: `%${keyword}%` } },
                { location: { [Sequelize.Op.like]: `%${keyword}%` } },
                { year: { [Sequelize.Op.like]: `%${keyword}%` } },
                { poNo1: { [Sequelize.Op.like]: `%${keyword}%` } },
                { poNo2: { [Sequelize.Op.like]: `%${keyword}%` } },
                { total_cost: { [Sequelize.Op.like]: `%${keyword}%` } },
                { total_rab: { [Sequelize.Op.like]: `%${keyword}%` } },
                {
                  createdAt: {
                    [Sequelize.Op.between]: [
                      formattedDate + ' 00:00:00',
                      formattedDate + ' 23:59:59',
                    ],
                  },
                },
                {
                  updatedAt: {
                    [Sequelize.Op.between]: [
                      formattedDate + ' 00:00:00',
                      formattedDate + ' 23:59:59',
                    ],
                  },
                },
              ],
            },
            limit,
            offset,
          }),
          project_cost_transaction.count({
            where: {
              [Sequelize.Op.or]: [
                { project: { [Sequelize.Op.like]: `%${keyword}%` } },
                { location: { [Sequelize.Op.like]: `%${keyword}%` } },
                { year: { [Sequelize.Op.like]: `%${keyword}%` } },
                { poNo1: { [Sequelize.Op.like]: `%${keyword}%` } },
                { poNo2: { [Sequelize.Op.like]: `%${keyword}%` } },
                { total_cost: { [Sequelize.Op.like]: `%${keyword}%` } },
                { total_rab: { [Sequelize.Op.like]: `%${keyword}%` } },
                {
                  createdAt: {
                    [Sequelize.Op.between]: [
                      formattedDate + ' 00:00:00',
                      formattedDate + ' 23:59:59',
                    ],
                  },
                },
                {
                  updatedAt: {
                    [Sequelize.Op.between]: [
                      formattedDate + ' 00:00:00',
                      formattedDate + ' 23:59:59',
                    ],
                  },
                },
              ],
            },
          }),
        ]);
      } else {
        // Ambil semua data external dengan pagination
        [pcTransactions, totalCount] = await Promise.all([
          project_cost_transaction.findAll({ limit, offset }),
          project_cost_transaction.count(),
        ]);
      }
      // Menghitung total halaman berdasarkan jumlah data dan limit per halaman
      const totalPages = Math.ceil(totalCount / limit);

      // Kirim respons JSON dengan hasil pencarian, jumlah data, dan informasi pagination
      res.status(200).json({
        totalCount,
        totalPages,
        currentPage: page,
        data: pcTransactions,
      });
    } catch (error) {
      res.status(500).json(error.message);
    }
  }

  static async createProjectCostTransaction(req, res) {
    try {
      const { project, location, year, poNo1, poNo2, total_cost } = req.body;
      let result = await project_cost_transaction.create({
        project,
        location,
        year,
        poNo1,
        poNo2,
        total_cost,
      });

      res.status(201).json(result);
    } catch (error) {
      res.status(500).json(error);
    }
  }

  static async updateProjectCostTransaction(req, res) {
    try {
      const { id } = req.params;

      const { project, location, year, poNo1, poNo2, total_cost } = req.body;

      const existingData = await project_cost_transaction.findByPk(id);

      if (!existingData) {
        return res
          .status(404)
          .json({ message: 'Project Cost Transaction not found.' });
      }

      // Update data
      await existingData.update({
        project,
        location,
        year,
        poNo1,
        poNo2,
        total_cost,
      });

      res.status(200).json(existingData);
    } catch (error) {
      res.status(500).json(error);
    }
  }

  static async createTransactionAndJournals(req, res) {
    const t = await sequelize.transaction();
    try {
      const { project, location, year, poNo1, poNo2, journals, total_rab } =
        req.body;

      // Validasi journals sebelum membuat transaksi
      if (!Array.isArray(journals)) {
        await t.rollback();
        return res.status(400).json({ message: 'Journals should be an array' });
      }

      // 1. Create transaction
      const newTransaction = await project_cost_transaction.create(
        {
          project,
          location,
          year,
          poNo1,
          poNo2,
          total_rab,
        },
        { transaction: t }
      );

      // Reload (opsional, tapi memastikan data lengkap)
      await newTransaction.reload({ transaction: t });

      // 2. Prepare journals
      const journalEntries = journals.map((journal) => ({
        ...journal,
        pct_id: newTransaction.id,
      }));

      // 3. Bulk create journals
      const newJournals = await project_cost_journal.bulkCreate(
        journalEntries,
        { transaction: t }
      );

      // 4. Commit
      await t.commit();

      return res.status(201).json({
        message: 'Transaction and Journals created successfully',
        transaction: newTransaction.get({ plain: true }),
        journals: newJournals,
      });
    } catch (error) {
      await t.rollback();

      if (error.name === 'SequelizeValidationError') {
        const formattedErrors = error.errors.map((err) => ({
          field: err.path,
          message: err.message,
          value: err.value,
        }));
        return res.status(400).json({
          message: 'Validation error',
          errors: formattedErrors,
        });
      }

      return res.status(500).json({
        message: 'Internal Server Error',
        error: error.message,
      });
    }
  }

  static async updateTransactionAndJournals(req, res) {
    const t = await sequelize.transaction();
    try {
      const { id } = req.params; // ID transaksi utama
      const { project, location, year, poNo1, poNo2, journals, total_rab } =
        req.body;

      // Pastikan journals adalah array
      if (!Array.isArray(journals)) {
        await t.rollback();
        return res.status(400).json({ message: 'Journals should be an array' });
      }

      // 1. Cek apakah transaction ada
      const transactionData = await project_cost_transaction.findByPk(id);
      if (!transactionData) {
        await t.rollback();
        return res.status(404).json({ message: 'Transaction not found' });
      }

      // 2. Update transaction
      await transactionData.update(
        { project, location, year, poNo1, poNo2, total_rab },
        { transaction: t }
      );

      // 3. Ambil journals lama untuk dibandingkan
      const existingJournals = await project_cost_journal.findAll({
        where: { pct_id: id },
        transaction: t,
      });

      const existingIds = existingJournals.map((j) => j.id);
      const incomingIds = journals.filter((j) => j.id).map((j) => j.id);

      // 4. Delete journals yang tidak dikirim lagi
      const journalsToDelete = existingIds.filter(
        (oldId) => !incomingIds.includes(oldId)
      );

      if (journalsToDelete.length > 0) {
        await project_cost_journal.destroy({
          where: { id: journalsToDelete },
          transaction: t,
        });
      }

      // 5. Update / Create journals
      const processedJournals = [];

      for (let j of journals) {
        if (j.id) {
          // UPDATE journal
          const journalToUpdate = await project_cost_journal.findByPk(j.id, {
            transaction: t,
          });

          if (journalToUpdate) {
            const updated = await journalToUpdate.update(j, { transaction: t });
            processedJournals.push(updated);
          }
        } else {
          // CREATE journal baru
          const created = await project_cost_journal.create(
            { ...j, pct_id: id },
            { transaction: t }
          );
          processedJournals.push(created);
        }
      }

      // 6. Commit
      await t.commit();

      return res.status(200).json({
        message: 'Transaction and journals updated successfully',
        transaction: transactionData,
        journals: processedJournals,
      });
    } catch (error) {
      await t.rollback();
      return res.status(500).json({
        message: 'Internal Server Error',
        error: error.message,
      });
    }
  }

  static async getTransactionById(req, res) {
    try {
      const { id } = req.params;

      const transaction = await project_cost_transaction.findByPk(id, {
        include: [
          {
            model: project_cost_journal,
            as: 'journals', // opsional, jika kamu set alias
          },
        ],
      });

      if (!transaction) {
        return res.status(404).json({ message: 'Transaction not found' });
      }

      return res.status(200).json({
        message: 'Success',
        data: transaction,
      });
    } catch (error) {
      return res.status(500).json({
        message: 'Internal server error',
        error: error.message,
      });
    }
  }

  static async deleteTransaction(req, res) {
    const t = await sequelize.transaction();
    try {
      const { id } = req.params;

      // Cek apakah transaction tersedia
      const existingTransaction = await project_cost_transaction.findOne({
        where: { id },
      });

      if (!existingTransaction) {
        await t.rollback();
        return res.status(404).json({
          success: false,
          message: 'Transaction tidak ditemukan',
        });
      }

      // Hapus journals yang terkait
      await project_cost_journal.destroy({
        where: { pct_id: id },
        transaction: t,
      });

      // Hapus transaction utama
      await project_cost_transaction.destroy({
        where: { id },
        transaction: t,
      });

      await t.commit();

      return res.json({
        success: true,
        message: 'Transaction dan journals berhasil dihapus',
      });
    } catch (error) {
      console.error(error);
      await t.rollback();
      return res.status(500).json({
        success: false,
        message: 'Terjadi kesalahan server',
        error: error.message,
      });
    }
  }
}
module.exports = ProjectCostController;
