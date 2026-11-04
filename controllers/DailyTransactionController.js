// const { where } = require('sequelize');
const {
  transaction,
  journal,
  business_unit,
  Sequelize,
  sequelize,
} = require('../models');

class TransactionController {
  static async getTransaction(req, res) {
    try {
      const { keyword } = req.query;
      let { page, limit } = req.query;

      // Konversi nilai page dan limit ke tipe data numerik
      page = parseInt(page) || 1;
      limit = parseInt(limit) || 10;

      // Hitung offset berdasarkan halaman dan limit
      const offset = (page - 1) * limit;

      let dailyTransactions;
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
        // Lakukan pencarian data transaction berdasarkan kata kunci di mana pun dalam nilai kolom
        [dailyTransactions, totalCount] = await Promise.all([
          transaction.findAll({
            include: [
              {
                model: business_unit,
                as: 'business_unit', // Menambahkan alias untuk model business_unit
                required: true,
              },
            ],
            where: {
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
          transaction.count({
            include: [
              {
                model: business_unit,
                as: 'business_unit', // Menambahkan alias untuk model business_unit
                required: true,
              },
            ],
            where: {
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
        // Ambil semua data transaction dengan pagination
        [dailyTransactions, totalCount] = await Promise.all([
          transaction.findAll({
            include: [business_unit],
            limit,
            offset,
          }),
          transaction.count(),
        ]);
      }

      // Menghitung total halaman berdasarkan jumlah data dan limit per halaman
      const totalPages = Math.ceil(totalCount / limit);

      // Kirim respons JSON dengan hasil pencarian, jumlah data, dan informasi pagination
      res.status(200).json({
        totalCount,
        totalPages,
        currentPage: page,
        data: dailyTransactions,
      });
    } catch (error) {
      res.status(500).json(error);
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
        rjumlah, // Data untuk transaction
        journals, // Array data untuk temp_journal
      } = req.body;

      const bunit = req.userData.business_code;

      const existingTransaction = await transaction.findOne({
        where: { rreferensi },
      });

      if (existingTransaction) {
        return res.status(409).json({ message: 'Reference already exists.' });
      }

      // Membuat data di transaction
      const newTransaction = await transaction.create(
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
        rjumlah: rjumlah,
        flag: 'M',
      }));

      // Membuat data di journal dengan bulkCreate
      const newJournals = await journal.bulkCreate(journalEntries, {
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

  static async updateTransactionJournal(req, res) {
    const t = await sequelize.transaction();
    try {
      const { id } = req.params; // ID dari transaction yang ingin diupdate
      const { rterang, rjumlah, journals } = req.body;

      // Temukan transaksi berdasarkan ID
      const dailyTransaction = await transaction.findByPk(id, {
        transaction: t,
      });
      if (!dailyTransaction) {
        await t.rollback();
        return res
          .status(404)
          .json({ message: `Transaction with id ${id} not found` });
      }

      // Update transaksi jika ada perubahan
      await dailyTransaction.update(
        {
          rterang:
            rterang !== null && rterang !== undefined
              ? rterang
              : dailyTransaction.rterang,
          rjumlah:
            rjumlah !== null && rjumlah !== undefined
              ? rjumlah
              : dailyTransaction.rjumlah,
        },
        { transaction: t }
      );

      // Ambil semua jurnal terkait transaksi ini
      const existingJournals = await journal.findAll({
        where: { rreferensi: dailyTransaction.rreferensi },
        transaction: t,
      });

      // Buat Map untuk menyimpan jurnal yang sudah ada berdasarkan ID
      const existingJournalMap = new Map(
        existingJournals.map((j) => [j.id, j])
      );

      // Proses jurnal yang baru dikirim dari request
      for (const dailyJournal of journals) {
        if (dailyJournal.id) {
          // Jika jurnal sudah ada, update entri yang sesuai
          if (existingJournalMap.has(dailyJournal.id)) {
            await journal.update(dailyJournal, {
              where: { id: dailyJournal.id },
              transaction: t,
            });
            existingJournalMap.delete(dailyJournal.id); // Hapus dari Map setelah diperbarui
          }
        } else {
          // Jika jurnal baru (tidak memiliki ID), buat jurnal baru
          await journal.create(
            {
              ...dailyJournal, // Menggunakan data dari request
              rtanggal: dailyTransaction.rtanggal,
              rreferensi: dailyTransaction.rreferensi,
              rjumlah:
                rjumlah !== null && rjumlah !== undefined
                  ? rjumlah
                  : dailyTransaction.rjumlah,
            },
            { transaction: t }
          );
        }
      }

      // Hapus jurnal lama yang tidak ada dalam data terbaru
      const journalIdsToDelete = [...existingJournalMap.keys()];
      if (journalIdsToDelete.length > 0) {
        await journal.destroy({
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

  static async deleteDailyTransaction(req, res) {
    const t = await sequelize.transaction();
    try {
      const { id } = req.params; // ID dari transaction yang ingin dihapus

      // Temukan data berdasarkan ID
      const dailyTransaction = await transaction.findByPk(id, {
        transaction: t,
      });

      if (!dailyTransaction) {
        await t.rollback(); // Rollback transaksi jika data tidak ditemukan
        return res
          .status(404)
          .json({ message: `Transaction with id ${id} not found` });
      }

      // Hapus data di journal yang terkait
      await journal.destroy({
        where: { rreferensi: dailyTransaction.rreferensi },
        transaction: t,
      });

      // Hapus data di transaction
      await transaction.destroy({
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

  static async getDailyTransactionById(req, res) {
    try {
      const { id } = req.params; // ID dari transaction yang ingin diambil

      // Temukan data transaction berdasarkan ID
      const dailyTransaction = await transaction.findByPk(id);

      if (!dailyTransaction) {
        return res
          .status(404)
          .json({ message: `Transaction with id ${id} not found` });
      }

      // Temukan data temp_journal yang terkait
      const relatedJournals = await journal.findAll({
        where: { rreferensi: dailyTransaction.rreferensi },
      });

      res.status(200).json({
        transaction: dailyTransaction,
        journals: relatedJournals,
      });
    } catch (error) {
      res.status(500).json({ message: 'Internal Server Error', error });
    }
  }
}

module.exports = TransactionController;
