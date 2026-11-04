const { new_transaction } = require('../models');

class NewTransactionController {
  // GET all transactions
  static async getNewTransaction(req, res) {
    try {
      const { keyword } = req.query;
      let { page, limit } = req.query;

      // Konversi nilai page dan limit ke tipe data numerik
      page = parseInt(page) || 1;
      limit = parseInt(limit) || 10;

      // Hitung offset berdasarkan halaman dan limit
      const offset = (page - 1) * limit;

      let newTransactions;
      let totalCount;

      if (keyword) {
        // Lakukan pencarian data new_transaction berdasarkan kata kunci di mana pun dalam nilai kolom
        [newTransactions, totalCount] = await Promise.all([
          new_transaction.findAll({
            where: {
              [Sequelize.Op.or]: [
                { project_id: { [Sequelize.Op.like]: `%${keyword}%` } },
                { name: { [Sequelize.Op.like]: `%${keyword}%` } },
                { location: { [Sequelize.Op.like]: `%${keyword}%` } },
                { range: { [Sequelize.Op.like]: `%${keyword}%` } },
                { qty: { [Sequelize.Op.like]: `%${keyword}%` } },
                { approval: { [Sequelize.Op.like]: `%${keyword}%` } },
              ],
            },
            limit,
            offset,
          }),
          new_transaction.count({
            where: {
              [Sequelize.Op.or]: [
                { project_id: { [Sequelize.Op.like]: `%${keyword}%` } },
                { name: { [Sequelize.Op.like]: `%${keyword}%` } },
                { location: { [Sequelize.Op.like]: `%${keyword}%` } },
                { range: { [Sequelize.Op.like]: `%${keyword}%` } },
                { qty: { [Sequelize.Op.like]: `%${keyword}%` } },
                { approval: { [Sequelize.Op.like]: `%${keyword}%` } },
              ],
            },
          }),
        ]);
      } else {
        // Ambil semua data new_transaction dengan pagination
        [newTransactions, totalCount] = await Promise.all([
          new_transaction.findAll({ limit, offset }),
          new_transaction.count(),
        ]);
      }

      // Menghitung total halaman berdasarkan jumlah data dan limit per halaman
      const totalPages = Math.ceil(totalCount / limit);

      // Kirim respons JSON dengan hasil pencarian, jumlah data, dan informasi pagination
      res.status(200).json({
        totalCount,
        totalPages,
        currentPage: page,
        data: newTransactions,
      });
    } catch (error) {
      res.status(500).json(error);
    }
  }

  // GET by ID
  static async getNewTransactionById(req, res) {
    try {
      const { id } = req.params;
      const transaction = await new_transaction.findByPk(id);

      if (!transaction) {
        return res.status(404).json({ message: 'Transaction not found' });
      }

      res.status(200).json(transaction);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error fetching transaction' });
    }
  }

  // CREATE
  static async createNewTransaction(req, res) {
    try {
      const { project_id, name, location, range, qty, approval } = req.body;

      const newTrans = await new_transaction.create({
        project_id,
        name,
        location,
        range,
        qty,
        approval,
      });

      res.status(201).json(newTrans);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error creating transaction' });
    }
  }

  // UPDATE
  static async updateNewTransaction(req, res) {
    try {
      const { id } = req.params;
      const { project_id, name, location, range, qty, approval } = req.body;

      const transaction = await new_transaction.findByPk(id);
      if (!transaction) {
        return res.status(404).json({ message: 'Transaction not found' });
      }

      await transaction.update({
        project_id,
        name,
        location,
        range,
        qty,
        approval,
      });

      res.status(200).json(transaction);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error updating transaction' });
    }
  }

  // DELETE
  static async deleteNewTransaction(req, res) {
    try {
      const { id } = req.params;
      const transaction = await new_transaction.findByPk(id);

      if (!transaction) {
        return res.status(404).json({ message: 'Transaction not found' });
      }

      await transaction.destroy();
      res.status(200).json({ message: 'Transaction deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error deleting transaction' });
    }
  }
}

module.exports = NewTransactionController;
