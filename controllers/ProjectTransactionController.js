const {
  project_transaction,
  journal,
  business_unit,
  project_journal,
  Sequelize,
  sequelize,
} = require('../models');
class ProjectTransactionController {
  static async getProjectTransaction(req, res) {
    try {
      const { keyword = '' } = req.query;
      let { page, limit } = req.query;

      // Konversi nilai page dan limit ke tipe data numerik
      page = parseInt(page) || 1;
      limit = parseInt(limit) || 10;

      // Hitung offset berdasarkan halaman dan limit
      const offset = (page - 1) * limit;

      let proTransactions;
      let totalCount;

      const dateRegex = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/;
      const match = keyword.match(dateRegex);
      let formattedDate = '';

      if (match) {
        // Format ulang menjadi YYYY-MM-DD untuk pencarian di database
        formattedDate = `${match[3]}-${match[2].padStart(
          2,
          '0'
        )}-${match[1].padStart(2, '0')}`;
      }

      if (keyword) {
        // Lakukan pencarian data project_transaction berdasarkan kata kunci di mana pun dalam nilai kolom
        [proTransactions, totalCount] = await Promise.all([
          project_transaction.findAll({
            include: [
              {
                model: business_unit,
                as: 'business_unit', // Menambahkan alias untuk model business_unit
                required: true,
              },
            ],
            where: {
              flagpost: 'P',
              [Sequelize.Op.or]: [
                {
                  rtanggal: {
                    [Sequelize.Op.between]: [
                      formattedDate + ' 00:00:00',
                      formattedDate + ' 23:59:59',
                    ],
                  },
                },
                { rreferensi: { [Sequelize.Op.like]: `%${keyword}%` } },
                { rterang: { [Sequelize.Op.like]: `%${keyword}%` } },
                { rjumlah: { [Sequelize.Op.like]: `%${keyword}%` } },
                { flag: { [Sequelize.Op.like]: `%${keyword}%` } },
                { bunit: { [Sequelize.Op.like]: `%${keyword}%` } },
                // { flagpost: { [Sequelize.Op.like]: `%${keyword}%` } },
                // Pencarian pada business_unit
                {
                  '$business_unit.business_code$': {
                    [Sequelize.Op.like]: `%${keyword}%`,
                  },
                },
                {
                  '$business_unit.name$': {
                    [Sequelize.Op.like]: `%${keyword}%`,
                  },
                },
              ],
            },
            limit,
            offset,
          }),
          project_transaction.count({
            include: [
              {
                model: business_unit,
                as: 'business_unit', // Menambahkan alias untuk model business_unit
                required: true,
              },
            ],
            where: {
              flagpost: 'P',
              [Sequelize.Op.or]: [
                {
                  rtanggal: {
                    [Sequelize.Op.between]: [
                      formattedDate + ' 00:00:00',
                      formattedDate + ' 23:59:59',
                    ],
                  },
                },
                { rreferensi: { [Sequelize.Op.like]: `%${keyword}%` } },
                { rterang: { [Sequelize.Op.like]: `%${keyword}%` } },
                { rjumlah: { [Sequelize.Op.like]: `%${keyword}%` } },
                { flag: { [Sequelize.Op.like]: `%${keyword}%` } },
                { bunit: { [Sequelize.Op.like]: `%${keyword}%` } },
                // { flagpost: { [Sequelize.Op.like]: `%${keyword}%` } },
                // Pencarian pada business_unit
                {
                  '$business_unit.business_code$': {
                    [Sequelize.Op.like]: `%${keyword}%`,
                  },
                },
                {
                  '$business_unit.name$': {
                    [Sequelize.Op.like]: `%${keyword}%`,
                  },
                },
              ],
            },
          }),
        ]);
      } else {
        // Ambil semua data project_transaction dengan pagination
        [proTransactions, totalCount] = await Promise.all([
          project_transaction.findAll({
            include: [business_unit],
            where: { flagpost: 'P' },
            limit,
            offset,
          }),
          project_transaction.count(),
        ]);
      }

      // Menghitung total halaman berdasarkan jumlah data dan limit per halaman
      const totalPages = Math.ceil(totalCount / limit);

      // Kirim respons JSON dengan hasil pencarian, jumlah data, dan informasi pagination
      res.status(200).json({
        totalCount,
        totalPages,
        currentPage: page,
        data: proTransactions,
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  }

  static async createTransactionAndJournals(req, res) {
    const t = await sequelize.transaction();
    try {
      // Ambil data dari body request
      const {
        rtanggal,
        rreferensi,
        rterang,
        rjumlah, // Data untuk project_transaction
        journals, // Array data untuk journal
      } = req.body;

      const bunit = req.userData.business_code;

      const existingTransaction = await project_transaction.findOne({
        where: { rreferensi },
      });

      if (existingTransaction) {
        return res.status(409).json({ message: 'Reference already exists.' });
      }

      // Membuat data di project_transaction
      const newTransaction = await project_transaction.create(
        {
          rtanggal,
          rreferensi,
          rterang,
          rjumlah,
          bunit,
        },
        { transaction: t }
      );

      // Validasi bahwa journals adalah array
      if (!Array.isArray(journals)) {
        return res.status(400).json({ message: 'Journals should be an array' });
      }

      // Menambahkan ID transaksi ke setiap journal
      const journalEntries = journals.map((journal) => ({
        ...journal,
        rtanggal: rtanggal,
        rreferensi: rreferensi,
        // rjumlah: rjumlah,
      }));

      // Membuat data di journal dengan bulkCreate
      const newJournals = await project_journal.bulkCreate(journalEntries, {
        transaction: t,
      });

      // Commit transaksi jika semua berjalan lancar
      await t.commit();

      res.status(201).json({
        message: 'Transaction and Journals created successfully',
        transaction: newTransaction,
        journals: newJournals,
      });
    } catch (error) {
      // Rollback transaksi jika terjadi kesalahan
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
      res.status(500).json({ message: 'Internal Server Error', error });
    }
  }

  static async getProjectTransactionById(req, res) {
    try {
      const { id } = req.params; // ID dari project_transaction yang ingin diambil

      // Temukan data project_transaction berdasarkan ID
      const projectTransaction = await project_transaction.findByPk(id);

      if (!projectTransaction) {
        return res
          .status(404)
          .json({ message: `Transaction with id ${id} not found` });
      }

      // Temukan data temp_journal yang terkait
      const relatedJournals = await project_journal.findAll({
        where: { rreferensi: projectTransaction.rreferensi },
      });

      res.status(200).json({
        transaction: projectTransaction,
        journals: relatedJournals,
      });
    } catch (error) {
      res.status(500).json({ message: 'Internal Server Error', error });
    }
  }

  static async deleteProjectTransaction(req, res) {
    const t = await sequelize.transaction();
    try {
      const { id } = req.params; // ID dari transaction yang ingin dihapus

      // Temukan data berdasarkan ID
      const projectTransaction = await project_transaction.findByPk(id, {
        transaction: t,
      });

      if (!projectTransaction) {
        await t.rollback(); // Rollback transaksi jika data tidak ditemukan
        return res
          .status(404)
          .json({ message: `Transaction with id ${id} not found` });
      }

      // Hapus data di journal yang terkait
      await project_journal.destroy({
        where: { rreferensi: projectTransaction.rreferensi },
        transaction: t,
      });

      // Hapus data di project_transaction
      await project_transaction.destroy({
        where: { id },
        transaction: t,
      });

      // Commit transaksi jika semua berjalan lancar
      await t.commit();

      res.status(200).json({
        message: 'Transaction and related journals deleted successfully',
      });
    } catch (error) {
      // Rollback transaksi jika terjadi kesalahan
      await t.rollback();
      res.status(500).json({ message: 'Internal Server Error', error });
    }
  }

  static async updateTransactionJournal(req, res) {
    const t = await sequelize.transaction();
    try {
      const { id } = req.params; // ID dari transaction yang ingin diupdate
      const { rterang, rjumlah, journals } = req.body;

      // Temukan transaksi berdasarkan ID
      const projectTransaction = await project_transaction.findByPk(id, {
        transaction: t,
      });
      if (!projectTransaction) {
        await t.rollback();
        return res
          .status(404)
          .json({ message: `Transaction with id ${id} not found` });
      }

      // Update transaksi jika ada perubahan
      await projectTransaction.update(
        {
          rterang:
            rterang !== null && rterang !== undefined
              ? rterang
              : projectTransaction.rterang,
          rjumlah:
            rjumlah !== null && rjumlah !== undefined
              ? rjumlah
              : projectTransaction.rjumlah,
        },
        { transaction: t }
      );

      // Ambil semua jurnal terkait transaksi ini
      const existingJournals = await project_journal.findAll({
        where: { rreferensi: projectTransaction.rreferensi },
        transaction: t,
      });

      // Buat Map untuk menyimpan jurnal yang sudah ada berdasarkan ID
      const existingJournalMap = new Map(
        existingJournals.map((j) => [j.id, j])
      );

      // Proses jurnal yang baru dikirim dari request
      for (const projectJournal of journals) {
        if (projectJournal.id) {
          // Jika jurnal sudah ada, update entri yang sesuai
          if (existingJournalMap.has(projectJournal.id)) {
            await project_journal.update(projectJournal, {
              where: { id: projectJournal.id },
              transaction: t,
            });
            existingJournalMap.delete(projectJournal.id); // Hapus dari Map setelah diperbarui
          }
        } else {
          // Jika jurnal baru (tidak memiliki ID), buat jurnal baru
          await project_journal.create(
            {
              ...projectJournal, // Menggunakan data dari request
              rtanggal: projectTransaction.rtanggal,
              rreferensi: projectTransaction.rreferensi,
            },
            { transaction: t }
          );
        }
      }

      // Hapus jurnal lama yang tidak ada dalam data terbaru
      const journalIdsToDelete = [...existingJournalMap.keys()];
      if (journalIdsToDelete.length > 0) {
        await project_journal.destroy({
          where: { id: journalIdsToDelete },
          transaction: t,
        });
      }

      // Commit transaksi setelah semua proses selesai
      await t.commit();
      return res
        .status(200)
        .json({ message: 'Transaction and journals updated successfully' });
    } catch (error) {
      // Rollback transaksi jika terjadi kesalahan
      await t.rollback();
      console.error('Error updating transaction:', error);
      return res
        .status(500)
        .json({ message: 'Internal Server Error', error: error.message });
    }
  }
}
module.exports = ProjectTransactionController;
