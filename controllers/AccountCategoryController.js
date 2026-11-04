const { account_category, Sequelize } = require('../models');

class AccountCategoryController {
  static async getAccountCategoryList(req, res) {
    try {
      const { keyword } = req.query;
      let { page, limit } = req.query;

      // Konversi nilai page dan limit ke tipe data numerik
      page = parseInt(page) || 1;
      limit = parseInt(limit) || 10;

      // Hitung offset berdasarkan halaman dan limit
      const offset = (page - 1) * limit;

      let accountCategories;
      let totalCount;

      if (keyword) {
        // Lakukan pencarian data external berdasarkan kata kunci di mana pun dalam nilai kolom
        [accountCategories, totalCount] = await Promise.all([
          account_category.findAll({
            where: {
              [Sequelize.Op.or]: [
                { account_code: { [Sequelize.Op.like]: `%${keyword}%` } },
                { name1: { [Sequelize.Op.like]: `%${keyword}%` } },
                { name2: { [Sequelize.Op.like]: `%${keyword}%` } },
                { name3: { [Sequelize.Op.like]: `%${keyword}%` } },
                { name4: { [Sequelize.Op.like]: `%${keyword}%` } },
                { name5: { [Sequelize.Op.like]: `%${keyword}%` } },
                { level: { [Sequelize.Op.like]: `%${keyword}%` } },
                { group: { [Sequelize.Op.like]: `%${keyword}%` } },
                { condition: { [Sequelize.Op.like]: `%${keyword}%` } },
                { report: { [Sequelize.Op.like]: `%${keyword}%` } },
                // Tambahkan kolom lain yang ingin Anda cari berdasarkan keyword
              ],
            },
            limit,
            offset,
          }),
          account_category.count({
            where: {
              [Sequelize.Op.or]: [
                { account_code: { [Sequelize.Op.like]: `%${keyword}%` } },
                { name1: { [Sequelize.Op.like]: `%${keyword}%` } },
                { name2: { [Sequelize.Op.like]: `%${keyword}%` } },
                { name3: { [Sequelize.Op.like]: `%${keyword}%` } },
                { name4: { [Sequelize.Op.like]: `%${keyword}%` } },
                { name5: { [Sequelize.Op.like]: `%${keyword}%` } },
                { level: { [Sequelize.Op.like]: `%${keyword}%` } },
                { group: { [Sequelize.Op.like]: `%${keyword}%` } },
                { condition: { [Sequelize.Op.like]: `%${keyword}%` } },
                { report: { [Sequelize.Op.like]: `%${keyword}%` } },
              ],
            },
          }),
        ]);
      } else {
        // Ambil semua data external dengan pagination
        [accountCategories, totalCount] = await Promise.all([
          account_category.findAll({ limit, offset }),
          account_category.count(),
        ]);
      }

      // Menghitung total halaman berdasarkan jumlah data dan limit per halaman
      const totalPages = Math.ceil(totalCount / limit);

      // Kirim respons JSON dengan hasil pencarian, jumlah data, dan informasi pagination
      res.status(200).json({
        totalCount,
        totalPages,
        currentPage: page,
        data: accountCategories,
      });
    } catch (error) {
      res.status(500).json(error);
    }
  }

  static async createAccountCategory(req, res) {
    try {
      const {
        account_code,
        name1,
        name2,
        name3,
        name4,
        name5,
        level,
        group,
        condition,
        report,
      } = req.body;

      // Cek apakah account_code sudah ada di database
      const existingAccount = await account_category.findOne({
        where: { account_code },
      });

      if (existingAccount) {
        return res.status(409).json({
          message: 'Account code already exists.',
        });
      }

      const newAccountCategory = await account_category.create({
        account_code,
        name1,
        name2,
        name3,
        name4,
        name5,
        level,
        group,
        condition,
        report,
      });

      res.status(201).json(newAccountCategory);
    } catch (error) {
      res.status(500).json(error);
    }
  }

  static async updateAccountCategory(req, res) {
    try {
      const { id } = req.params;
      const {
        account_code,
        name1,
        name2,
        name3,
        name4,
        name5,
        level,
        group,
        condition,
        report,
      } = req.body;

      const existingAccountCategory = await account_category.findByPk(id);

      if (!existingAccountCategory) {
        return res
          .status(404)
          .json({ message: `Account category with id ${id} not found` });
      }

      // Cek apakah account_code sudah ada di database
      const existingAccountCode = await account_category.findOne({
        where: {
          account_code,
          id: { [Sequelize.Op.ne]: id },
        },
      });

      if (existingAccountCode) {
        return res
          .status(409)
          .json({ message: 'Account code already exists.' });
      }

      await existingAccountCategory.update({
        account_code,
        name1,
        name2,
        name3,
        name4,
        name5,
        level,
        group,
        condition,
        report,
      });

      res.status(200).json(existingAccountCategory);
    } catch (error) {
      res.status(500).json(error);
    }
  }

  static async deleteAccountCategory(req, res) {
    try {
      const { id } = req.params;

      const existingAccountCategory = await account_category.findByPk(id);

      if (!existingAccountCategory) {
        return res
          .status(404)
          .json({ message: `Account category with id ${id} not found` });
      }

      await existingAccountCategory.destroy();

      res
        .status(200)
        .json({ message: `Account category with id ${id} has been deleted` });
    } catch (error) {
      res.status(500).json(error);
    }
  }

  static async getAccountCategoryById(req, res) {
    try {
      const { id } = req.params;
      const existingAccountCategory = await account_category.findByPk(id);

      if (!existingAccountCategory) {
        return res
          .status(404)
          .json({ message: `Account category with id ${id} not found` });
      }
      res.status(200).json(existingAccountCategory);
    } catch (error) {
      res.status(500).json(error);
    }
  }
}

module.exports = AccountCategoryController;
