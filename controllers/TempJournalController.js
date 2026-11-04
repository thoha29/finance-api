const { temp_journal, Sequelize } = require('../models');

class TempJournalController {
  // Mendapatkan daftar temp_journal
  static async getTempJournalList(req, res) {
    try {
      const tempJournals = await temp_journal.findAll();
      res.status(200).json(tempJournals);
    } catch (error) {
      res.status(500).json({ message: 'Internal Server Error', error });
    }
  }

  // Membuat banyak temp_journal
  static async createTempJournal(req, res) {
    try {
      const journals = req.body.journals; // Mengambil data jurnal dari body permintaan

      if (!Array.isArray(journals)) {
        return res.status(400).json({ message: 'Journals should be an array' });
      }

      const newTempJournals = await temp_journal.bulkCreate(journals);

      res.status(201).json(newTempJournals);
    } catch (error) {
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

  // Memperbarui temp_journal berdasarkan ID
  static async updateTempJournal(req, res) {
    try {
      const { id } = req.params;
      const {
        rtanggal,
        rreferensi,
        rrefterang,
        rjumlah,
        rkoderek,
        rdebet,
        rkredit,
        fdate,
        bunit,
        rkodepro,
        rkodeext,
        rkodeint,
        rkodeinv,
        rkodepo,
      } = req.body;

      const tempJournal = await temp_journal.findByPk(id);
      if (!tempJournal) {
        return res.status(404).json({ message: 'TempJournal not found' });
      }

      // Update fields if provided
      tempJournal.rtanggal = rtanggal || tempJournal.rtanggal;
      tempJournal.rreferensi = rreferensi || tempJournal.rreferensi;
      tempJournal.rrefterang = rrefterang || tempJournal.rrefterang;
      tempJournal.rjumlah = rjumlah || tempJournal.rjumlah;
      tempJournal.rkoderek = rkoderek || tempJournal.rkoderek;
      tempJournal.rdebet = rdebet || tempJournal.rdebet;
      tempJournal.rkredit = rkredit || tempJournal.rkredit;
      tempJournal.fdate = fdate || tempJournal.fdate;
      tempJournal.bunit = bunit || tempJournal.bunit;
      tempJournal.rkodepro = rkodepro || tempJournal.rkodepro;
      tempJournal.rkodeext = rkodeext || tempJournal.rkodeext;
      tempJournal.rkodeint = rkodeint || tempJournal.rkodeint;
      tempJournal.rkodeinv = rkodeinv || tempJournal.rkodeinv;
      tempJournal.rkodepo = rkodepo || tempJournal.rkodepo;

      await tempJournal.save();
      res.status(200).json(tempJournal);
    } catch (error) {
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

  // Menghapus temp_journal berdasarkan ID
  static async deleteTempJournal(req, res) {
    try {
      const { id } = req.params;

      const tempJournal = await temp_journal.findByPk(id);
      if (!tempJournal) {
        return res.status(404).json({ message: 'TempJournal not found' });
      }

      await tempJournal.destroy();
      res.status(204).send(); // 204 No Content
    } catch (error) {
      res.status(500).json({ message: 'Internal Server Error', error });
    }
  }
}

module.exports = TempJournalController;
