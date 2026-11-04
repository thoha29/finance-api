const { temp_transaction, temp_journal, sequelize } = require('../models');

class TempController {
  static async createTransactionAndJournals(req, res) {
    const t = await sequelize.transaction();
    try {
      // Ambil data dari body request
      const {
        rtanggal,
        rreferensi,
        rterang,
        rjumlah, // Data untuk temp_transaction
        journals, // Array data untuk temp_journal
      } = req.body;

      const bunit = req.userData.business_code;

      const existingTransaction = await temp_transaction.findOne({
        where: { rreferensi },
      });

      if (existingTransaction) {
        return res.status(409).json({ message: 'Reference already exists.' });
      }

      // Membuat data di temp_transaction
      const newTransaction = await temp_transaction.create(
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
      }));

      // Membuat data di temp_journal dengan bulkCreate
      const newJournals = await temp_journal.bulkCreate(journalEntries, {
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
      const { id } = req.params; // ID dari temp_transaction yang ingin diupdate
      const { rterang, rjumlah, journals } = req.body;

      // Temukan data transaksi berdasarkan ID
      const tempTransaction = await temp_transaction.findByPk(id);
      if (!tempTransaction) {
        return res
          .status(404)
          .json({ message: `Transaction with id ${id} not found` });
      }

      // Update data transaksi jika ada perubahan
      await tempTransaction.update(
        {
          rterang: rterang !== undefined ? rterang : tempTransaction.rterang,
          rjumlah: rjumlah !== undefined ? rjumlah : tempTransaction.rjumlah,
        },
        { transaction: t }
      );

      // Ambil semua jurnal yang ada terkait transaksi ini
      const existingJournals = await temp_journal.findAll({
        where: { rreferensi: tempTransaction.rreferensi },
        transaction: t,
      });

      // Buat map untuk jurnal yang ada berdasarkan ID
      const existingJournalMap = new Map(
        existingJournals.map((j) => [j.id, j])
      );

      // Proses data jurnal yang baru
      for (const journal of journals) {
        if (journal.id) {
          // Jika ID ada, update entri yang sudah ada
          if (existingJournalMap.has(journal.id)) {
            await temp_journal.update(journal, {
              where: { id: journal.id },
              transaction: t,
            });
            existingJournalMap.delete(journal.id);
          }
        } else {
          // Jika tidak ada ID, maka buat jurnal baru
          await temp_journal.create(
            {
              ...journal,
              rtanggal: tempTransaction.rtanggal,
              rreferensi: tempTransaction.rreferensi,
            },
            { transaction: t }
          );
        }
      }

      // Hapus jurnal yang tidak ada dalam data baru
      const journalIdsToDelete = [...existingJournalMap.keys()];
      if (journalIdsToDelete.length > 0) {
        await temp_journal.destroy({
          where: { id: journalIdsToDelete },
          transaction: t,
        });
      }

      // Commit transaksi jika semua berhasil
      await t.commit();

      res
        .status(200)
        .json({ message: 'Transaction and journals updated successfully' });
    } catch (error) {
      // Rollback transaksi jika terjadi kesalahan
      await t.rollback();
      res.status(500).json({ message: 'Internal Server Error', error });
    }
  }

  static async getTempTransactionById(req, res) {
    try {
      const { id } = req.params; // ID dari temp_transaction yang ingin diambil

      // Temukan data temp_transaction berdasarkan ID
      const tempTransaction = await temp_transaction.findByPk(id);

      if (!tempTransaction) {
        return res
          .status(404)
          .json({ message: `Transaction with id ${id} not found` });
      }

      // Temukan data temp_journal yang terkait
      const relatedJournals = await temp_journal.findAll({
        where: { rreferensi: tempTransaction.rreferensi },
      });

      res.status(200).json({
        transaction: tempTransaction,
        journals: relatedJournals,
      });
    } catch (error) {
      res.status(500).json({ message: 'Internal Server Error', error });
    }
  }

  static async moveTempToTransaction(req, res) {
    const { rreferensi } = req.body;

    if (!rreferensi || rreferensi.length === 0) {
      return res.status(400).json({ message: 'Please select data to copy.' });
    }

    const t = await sequelize.transaction();
    try {
      const existingReferences = await sequelize.query(
        `SELECT rreferensi FROM transactions WHERE rreferensi IN (SELECT rreferensi FROM temp_transactions WHERE rreferensi IN (:rreferensi))`,
        { replacements: { rreferensi }, transaction: t }
      );

      if (existingReferences[0].length > 0) {
        return res.status(400).json({
          message:
            'Some of the references already exist in transactions. Skipping duplicate records.',
        });
      }
      await sequelize.query(
        `INSERT INTO transactions (rtanggal, rreferensi, rterang, rjumlah, flag, bunit, flagpost, createdAt, updatedAt)
         SELECT rtanggal, rreferensi, rterang, rjumlah, flag, bunit, 'T', createdAt, NOW()
         FROM temp_transactions WHERE rreferensi IN (:rreferensi)`,
        { replacements: { rreferensi }, transaction: t }
      );

      // Copy data dari temp_journal ke journal jika rreferensi sama dengan temp_transaction
      await sequelize.query(
        `INSERT INTO journals (rtanggal, rreferensi, rreftgl, rrefpada, rrefterang, rqty, runit, rprice, 
                              rkodepro, rkodeext, rkodeint, rkoderek, rkodeinv, rkodepo, rbdebet, rbkredit, 
                              rsaldo, rdebet, rkredit, redebet, rekredit, rjumlah, rkredeb, flag, fdate, ftime, 
                              userid, bunit, createdAt, updatedAt)
         SELECT tj.rtanggal, tj.rreferensi, tj.rreftgl, tj.rrefpada, tj.rrefterang, tj.rqty, tj.runit, tj.rprice, 
                tj.rkodepro, tj.rkodeext, tj.rkodeint, tj.rkoderek, tj.rkodeinv, tj.rkodepo, tj.rbdebet, tj.rbkredit, 
                tj.rsaldo, tj.rdebet, tj.rkredit, tj.redebet, tj.rekredit, tj.rjumlah, tj.rkredeb, tj.flag, 
                tj.fdate, tj.ftime, tj.userid, tj.bunit, tj.createdAt, NOW()
         FROM temp_journals tj
         INNER JOIN temp_transactions tt ON tj.rreferensi = tt.rreferensi
         WHERE tt.rreferensi IN (:rreferensi)`,
        { replacements: { rreferensi }, transaction: t }
      );

      // Update flagpost ke 'T' di temp_transaction
      await sequelize.query(
        `UPDATE temp_transactions SET flagpost = 'T' WHERE rreferensi IN (:rreferensi)`,
        { replacements: { rreferensi }, transaction: t }
      );

      // Commit transaction
      await t.commit();

      res
        .status(200)
        .json({ message: 'Data successfully copied and updated!' });
    } catch (error) {
      await t.rollback(); // Rollback if an error occurs
      res
        .status(500)
        .json({ error: 'Failed to copy data', details: error.message });
    }
  }
}

module.exports = TempController;
