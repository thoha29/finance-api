const { project_cost, Sequelize } = require('../models');

class ProjectCostController {
  static async getProjectCostList(req, res) {
    try {
      const { keyword } = req.query;
      let { page, limit } = req.query;

      // Konversi nilai page dan limit ke tipe data numerik
      page = parseInt(page) || 1;
      limit = parseInt(limit) || 10;

      // Hitung offset berdasarkan halaman dan limit
      const offset = (page - 1) * limit;

      let projectCost;
      let totalCount;

      if (keyword) {
        // Lakukan pencarian data external berdasarkan kata kunci di mana pun dalam nilai kolom
        [projectCost, totalCount] = await Promise.all([
          project_cost.findAll({
            where: {
              [Sequelize.Op.or]: [
                { prjCost_code: { [Sequelize.Op.like]: `%${keyword}%` } },
                { name1: { [Sequelize.Op.like]: `%${keyword}%` } },
                { name2: { [Sequelize.Op.like]: `%${keyword}%` } },
                { name3: { [Sequelize.Op.like]: `%${keyword}%` } },
                { name4: { [Sequelize.Op.like]: `%${keyword}%` } },
                { level: { [Sequelize.Op.like]: `%${keyword}%` } },

                // Tambahkan kolom lain yang ingin Anda cari berdasarkan keyword
              ],
            },
            limit,
            offset,
          }),
          project_cost.count({
            where: {
              [Sequelize.Op.or]: [
                { prjCost_code: { [Sequelize.Op.like]: `%${keyword}%` } },
                { name1: { [Sequelize.Op.like]: `%${keyword}%` } },
                { name2: { [Sequelize.Op.like]: `%${keyword}%` } },
                { name3: { [Sequelize.Op.like]: `%${keyword}%` } },
                { name4: { [Sequelize.Op.like]: `%${keyword}%` } },
                { level: { [Sequelize.Op.like]: `%${keyword}%` } },
              ],
            },
          }),
        ]);
      } else {
        // Ambil semua data external dengan pagination
        [projectCost, totalCount] = await Promise.all([
          project_cost.findAll({ limit, offset }),
          project_cost.count(),
        ]);
      }

      // Menghitung total halaman berdasarkan jumlah data dan limit per halaman
      const totalPages = Math.ceil(totalCount / limit);

      // Kirim respons JSON dengan hasil pencarian, jumlah data, dan informasi pagination
      res.status(200).json({
        totalCount,
        totalPages,
        currentPage: page,
        data: projectCost,
      });
    } catch (error) {
      res.status(500).json(error);
    }
  }

  static async createProjectCost(req, res) {
    try {
      const { prjCost_code, name1, name2, name3, name4, level } = req.body;

      // Cek apakah prjCost_code sudah ada di database
      const existingProjectCost = await project_cost.findOne({
        where: { prjCost_code },
      });

      if (existingProjectCost) {
        return res.status(409).json({
          message: 'Project cost code already exists.',
        });
      }

      const newProjectCost = await project_cost.create({
        prjCost_code,
        name1,
        name2,
        name3,
        name4,

        level,
      });

      res.status(201).json(newProjectCost);
    } catch (error) {
      res.status(500).json(error);
    }
  }

  static async updateProjectCost(req, res) {
    try {
      const { id } = req.params;
      const { prjCost_code, name1, name2, name3, name4, level } = req.body;

      const existingProjectCost = await project_cost.findByPk(id);

      if (!existingProjectCost) {
        return res
          .status(404)
          .json({ message: `Project cost with id ${id} not found` });
      }

      // Cek apakah prjCost_code sudah ada di database
      const existingPrjCode = await project_cost.findOne({
        where: {
          prjCost_code,
          id: { [Sequelize.Op.ne]: id },
        },
      });

      if (existingPrjCode) {
        return res
          .status(409)
          .json({ message: 'Project cost code already exists.' });
      }

      await existingProjectCost.update({
        prjCost_code,
        name1,
        name2,
        name3,
        name4,

        level,
      });

      res.status(200).json(existingProjectCost);
    } catch (error) {
      res.status(500).json(error);
    }
  }

  static async deleteProjectCost(req, res) {
    try {
      const { id } = req.params;

      const existingProjectCost = await project_cost.findByPk(id);

      if (!existingProjectCost) {
        return res
          .status(404)
          .json({ message: `Project cost with id ${id} not found` });
      }

      await existingProjectCost.destroy();

      res
        .status(200)
        .json({ message: `Project cost with id ${id} has been deleted` });
    } catch (error) {
      res.status(500).json(error);
    }
  }

  static async getProjectCostById(req, res) {
    try {
      const { id } = req.params;
      const existingProjectCost = await project_cost.findByPk(id);

      if (!existingProjectCost) {
        return res
          .status(404)
          .json({ message: `Project cost with id ${id} not found` });
      }
      res.status(200).json(existingProjectCost);
    } catch (error) {
      res.status(500).json(error);
    }
  }
}

module.exports = ProjectCostController;
