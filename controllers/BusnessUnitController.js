const { business_unit, Sequelize } = require('../models');

class BusinessUnitController {
  static async getBusinessUnitList(req, res) {
    try {
      const { keyword } = req.query;
      let { page, limit } = req.query;

      // Konversi nilai page dan limit ke tipe data numerik
      page = parseInt(page) || 1;
      limit = parseInt(limit) || 10;

      // Hitung offset berdasarkan halaman dan limit
      const offset = (page - 1) * limit;

      let businessUnits;
      let totalCount;

      if (keyword) {
        // Lakukan pencarian data business_unit berdasarkan kata kunci di mana pun dalam nilai kolom
        [businessUnits, totalCount] = await Promise.all([
          business_unit.findAll({
            where: {
              [Sequelize.Op.or]: [
                { business_code: { [Sequelize.Op.like]: `%${keyword}%` } },
                { name: { [Sequelize.Op.like]: `%${keyword}%` } },
                { contact_person: { [Sequelize.Op.like]: `%${keyword}%` } },
                { title: { [Sequelize.Op.like]: `%${keyword}%` } },
                { extension: { [Sequelize.Op.like]: `%${keyword}%` } },
                { work_phone: { [Sequelize.Op.like]: `%${keyword}%` } },
                { address: { [Sequelize.Op.like]: `%${keyword}%` } },
                { city: { [Sequelize.Op.like]: `%${keyword}%` } },
                { state_or_province: { [Sequelize.Op.like]: `%${keyword}%` } },
                { postal_code: { [Sequelize.Op.like]: `%${keyword}%` } },
                { country: { [Sequelize.Op.like]: `%${keyword}%` } },
                { email: { [Sequelize.Op.like]: `%${keyword}%` } },
                { phone: { [Sequelize.Op.like]: `%${keyword}%` } },
              ],
            },
            limit,
            offset,
          }),
          business_unit.count({
            where: {
              [Sequelize.Op.or]: [
                { business_code: { [Sequelize.Op.like]: `%${keyword}%` } },
                { name: { [Sequelize.Op.like]: `%${keyword}%` } },
                { contact_person: { [Sequelize.Op.like]: `%${keyword}%` } },
                { title: { [Sequelize.Op.like]: `%${keyword}%` } },
                { extension: { [Sequelize.Op.like]: `%${keyword}%` } },
                { work_phone: { [Sequelize.Op.like]: `%${keyword}%` } },
                { address: { [Sequelize.Op.like]: `%${keyword}%` } },
                { city: { [Sequelize.Op.like]: `%${keyword}%` } },
                { state_or_province: { [Sequelize.Op.like]: `%${keyword}%` } },
                { postal_code: { [Sequelize.Op.like]: `%${keyword}%` } },
                { country: { [Sequelize.Op.like]: `%${keyword}%` } },
                { email: { [Sequelize.Op.like]: `%${keyword}%` } },
                { phone: { [Sequelize.Op.like]: `%${keyword}%` } },
              ],
            },
          }),
        ]);
      } else {
        // Ambil semua data business_unit dengan pagination
        [businessUnits, totalCount] = await Promise.all([
          business_unit.findAll({ limit, offset }),
          business_unit.count(),
        ]);
      }

      // Menghitung total halaman berdasarkan jumlah data dan limit per halaman
      const totalPages = Math.ceil(totalCount / limit);

      // Kirim respons JSON dengan hasil pencarian, jumlah data, dan informasi pagination
      res.status(200).json({
        totalCount,
        totalPages,
        currentPage: page,
        data: businessUnits,
      });
    } catch (error) {
      res.status(500).json(error);
    }
  }

  static async createBusinessUnit(req, res) {
    try {
      const {
        business_code,
        name,
        contact_person,
        title,
        extension,
        work_phone,
        address,
        city,
        state_or_province,
        postal_code,
        country,
        email,
        phone,
      } = req.body;

      const existingBusinessUnit = await business_unit.findOne({
        where: { business_code },
      });

      if (existingBusinessUnit) {
        return res.status(409).json({
          message: 'Business Unit code already exists.',
        });
      }

      const newBusinessUnit = await business_unit.create({
        business_code,
        name,
        contact_person,
        title,
        extension,
        work_phone,
        address,
        city,
        state_or_province,
        postal_code,
        country,
        email,
        phone,
      });

      res.status(201).json(newBusinessUnit);
    } catch (error) {
      res.status(500).json(error);
    }
  }

  static async updateBusinessUnit(req, res) {
    try {
      const { id } = req.params;
      const {
        business_code,
        name,
        contact_person,
        title,
        extension,
        work_phone,
        address,
        city,
        state_or_province,
        postal_code,
        country,
        email,
        phone,
      } = req.body;

      const existingBusinessUnit = await business_unit.findByPk(id);

      if (!existingBusinessUnit) {
        return res
          .status(404)
          .json({ message: `Business unit with id ${id} not found` });
      }

      await existingBusinessUnit.update({
        business_code,
        name,
        contact_person,
        title,
        extension,
        work_phone,
        address,
        city,
        state_or_province,
        postal_code,
        country,
        email,
        phone,
      });

      res.status(200).json(existingBusinessUnit);
    } catch (error) {
      res.status(500).json(error);
    }
  }

  static async deleteBusinessUnit(req, res) {
    try {
      const { id } = req.params;

      const existingBusinessUnit = await business_unit.findByPk(id);

      if (!existingBusinessUnit) {
        return res
          .status(404)
          .json({ message: `Business unit with id ${id} not found` });
      }

      await existingBusinessUnit.destroy();

      res
        .status(200)
        .json({ message: `Business unit with id ${id} has been deleted` });
    } catch (error) {
      res.status(500).json(error);
    }
  }

  static async getBusinessUnitById(req, res) {
    try {
      const { id } = req.params;
      const existingBusinessUnit = await business_unit.findByPk(id);

      if (!existingBusinessUnit) {
        return res
          .status(404)
          .json({ message: `Business unit with id ${id} not found` });
      }
      res.status(200).json(existingBusinessUnit);
    } catch (error) {
      res.status(500).json(error);
    }
  }
}

module.exports = BusinessUnitController;
