// const { where } = require('sequelize');
const {
  temp_transaction,
  temp_journal,
  business_unit,
  Sequelize,
  sequelize,
} = require('../models');

class TempTransactionController {
  static async getTempTransaction(req, res) {
    try {
      const { keyword = '' } = req.query;
      let { page, limit } = req.query;

      // Konversi nilai page dan limit ke tipe data numerik
      page = parseInt(page) || 1;
      limit = parseInt(limit) || 10;

      // Hitung offset berdasarkan halaman dan limit
      const offset = (page - 1) * limit;

      let tempTransactions;
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
        // Lakukan pencarian data temp_transaction berdasarkan kata kunci di mana pun dalam nilai kolom
        [tempTransactions, totalCount] = await Promise.all([
          temp_transaction.findAll({
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
          temp_transaction.count({
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
        // Ambil semua data temp_transaction dengan pagination
        [tempTransactions, totalCount] = await Promise.all([
          temp_transaction.findAll({
            include: [business_unit],
            where: { flagpost: 'P' },
            limit,
            offset,
          }),
          temp_transaction.count({ where: { flagpost: 'P' } }),
        ]);
      }

      // Menghitung total halaman berdasarkan jumlah data dan limit per halaman
      const totalPages = Math.ceil(totalCount / limit);

      // Kirim respons JSON dengan hasil pencarian, jumlah data, dan informasi pagination
      res.status(200).json({
        totalCount,
        totalPages,
        currentPage: page,
        data: tempTransactions,
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  }

  static async createTempTransaction(req, res) {
    try {
      const { rtanggal, rreferensi, rterang, rjumlah } = req.body;
      const newTempTransaction = await temp_transaction.create({
        rtanggal,
        rreferensi,
        rterang,
        rjumlah,
      });
      res.status(201).json(newTempTransaction);
    } catch (error) {
      if (error.name === 'SequelizeValidationError') {
        const formattedErrors = error.errors.map((err) => ({
          field: err.path,
          message: err.message,
          value: err.value,
        }));
        // Tangani error validasi
        return res.status(400).json({
          message: 'Validation error',
          errors: formattedErrors,
        });
      }
      res.status(500).json({
        message: error.message,
      });
    }
  }

  static async updateTempTransaction(req, res) {
    try {
      const { id } = req.params; // ID dari temp_transaction yang ingin diupdate
      const { rtanggal, rreferensi, rterang, rjumlah } = req.body;

      // Temukan data berdasarkan ID
      const tempTransaction = await temp_transaction.findByPk(id);

      if (!tempTransaction) {
        return res
          .status(404)
          .json({ message: `Transaction with id ${id} not found` });
      }

      // Update data dengan nilai baru, jika disediakan
      const updatedTransaction = await tempTransaction.update({
        rtanggal: rtanggal !== undefined ? rtanggal : tempTransaction.rtanggal,
        rreferensi:
          rreferensi !== undefined ? rreferensi : tempTransaction.rreferensi,
        rterang: rterang !== undefined ? rterang : tempTransaction.rterang,
        rjumlah: rjumlah !== undefined ? rjumlah : tempTransaction.rjumlah,
      });

      res.status(200).json(updatedTransaction);
    } catch (error) {
      if (error.name === 'SequelizeValidationError') {
        const formattedErrors = error.errors.map((err) => ({
          field: err.path,
          message: err.message,
          value: err.value,
        }));
        // Tangani error validasi
        return res.status(400).json({
          message: 'Validation error',
          errors: formattedErrors,
        });
      }
      res.status(500).json({
        message: error.message,
      });
    }
  }

  static async deleteTempTransaction(req, res) {
    const t = await sequelize.transaction();
    try {
      const { id } = req.params; // ID dari temp_transaction yang ingin dihapus

      // Temukan data berdasarkan ID
      const tempTransaction = await temp_transaction.findByPk(id, {
        transaction: t,
      });

      if (!tempTransaction) {
        await t.rollback(); // Rollback transaksi jika data tidak ditemukan
        return res
          .status(404)
          .json({ message: `Transaction with id ${id} not found` });
      }

      // Hapus data di temp_journal yang terkait
      await temp_journal.destroy({
        where: { rreferensi: tempTransaction.rreferensi },
        transaction: t,
      });

      // Hapus data di temp_transaction
      await temp_transaction.destroy({
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

  static async getTempTransactionById(req, res) {
    try {
      const { id } = req.params; // ID dari temp_transaction yang ingin diambil

      // Temukan data berdasarkan ID
      const tempTransaction = await temp_transaction.findByPk(id);

      if (!tempTransaction) {
        return res
          .status(404)
          .json({ message: `Transaction with id ${id} not found` });
      }

      res.status(200).json(tempTransaction);
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  }
}

module.exports = TempTransactionController;
