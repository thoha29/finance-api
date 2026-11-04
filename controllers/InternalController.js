const { internal, Sequelize } = require('../models');

class internalController {
  static async getInternalList(req, res) {
    try {
      const { keyword } = req.query;
      let { page, limit } = req.query; // Mengambil kata kunci pencarian, halaman, dan limit dari query parameter

      // Konversi nilai page dan limit ke tipe data numerik
      page = parseInt(page) || 1;
      limit = parseInt(limit) || 10;

      // Hitung offset berdasarkan halaman dan limit
      const offset = (page - 1) * limit;

      let internals;
      let totalCount;

      if (keyword) {
        // Lakukan pencarian data internal berdasarkan kata kunci di mana pun dalam nilai kolom
        [internals, totalCount] = await Promise.all([
          internal.findAll({
            where: {
              [Sequelize.Op.or]: [
                { internal_code: { [Sequelize.Op.like]: `%${keyword}%` } },
                { first_name: { [Sequelize.Op.like]: `%${keyword}%` } },
                { last_name: { [Sequelize.Op.like]: `%${keyword}%` } },
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
          internal.count({
            where: {
              [Sequelize.Op.or]: [
                { internal_code: { [Sequelize.Op.like]: `%${keyword}%` } },
                { first_name: { [Sequelize.Op.like]: `%${keyword}%` } },
                { last_name: { [Sequelize.Op.like]: `%${keyword}%` } },
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
        // Ambil semua data internal dengan pagination
        [internals, totalCount] = await Promise.all([
          internal.findAll({ limit, offset }),
          internal.count(),
        ]);
      }

      // Menghitung total halaman berdasarkan jumlah data dan limit per halaman
      const totalPages = Math.ceil(totalCount / limit);

      // Kirim respons JSON dengan hasil pencarian, jumlah data, dan informasi pagination
      res.status(200).json({
        totalCount,
        totalPages,
        currentPage: page,
        data: internals,
      });
    } catch (error) {
      // Jika terjadi error, kirim respons JSON dengan pesan error
      res.status(500).json(error);
    }
  }

  static async create(req, res) {
    try {
      const {
        internal_code,
        first_name,
        last_name,
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

      const existingInternal = await internal.findOne({
        where: { internal_code },
      });

      if (existingInternal) {
        return res
          .status(409)
          .json({ message: 'Internal code already exists.' });
      }

      let result = await internal.create({
        internal_code,
        first_name,
        last_name,
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

      res.status(201).json(result);
    } catch (error) {
      res.status(500).json(error);
    }
  }

  static async update(req, res) {
    try {
      const { id } = req.params; // Ambil ID dari parameter URL
      const {
        internal_code,
        first_name,
        last_name,
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

      // Temukan data internal berdasarkan ID
      let existingInternal = await internal.findByPk(id);

      // Jika data tidak ditemukan, kirim respons dengan status 404
      if (!existingInternal) {
        return res
          .status(404)
          .json({ message: `Data internal with id ${id} not found` });
      }

      const existingInternalCode = await internal.findOne({
        where: {
          internal_code,
          id: { [Sequelize.Op.ne]: id }, // Mengecualikan record dengan id yang sedang diupdate
        },
      });

      if (existingInternalCode) {
        return res
          .status(409)
          .json({ message: 'Internal code already exists.' });
      }

      // Update data internal
      await existingInternal.update({
        internal_code,
        first_name,
        last_name,
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

      res.status(200).json(existingInternal);
    } catch (error) {
      res.status(500).json(error);
    }
  }

  static async delete(req, res) {
    try {
      const { id } = req.params; // Ambil ID dari parameter URL

      // Temukan data internal berdasarkan ID
      let existingInternal = await internal.findByPk(id);

      // Jika data tidak ditemukan, kirim respons dengan status 404
      if (!existingInternal) {
        return res
          .status(404)
          .json({ message: `Data internal with id ${id} not found` });
      }

      // Hapus data internal
      await existingInternal.destroy();

      // Kirim respons JSON dengan pesan sukses
      res
        .status(200)
        .json({ message: `Data internal with id ${id} has been deleted` });
    } catch (error) {
      res.status(500).json(error);
    }
  }

  static async getInternalById(req, res) {
    try {
      const { id } = req.params;
      const existingInternal = await internal.findByPk(id);

      if (!existingInternal) {
        return res
          .status(404)
          .json({ message: `Internal with id ${id} not found` });
      }
      res.status(200).json(existingInternal);
    } catch (error) {
      res.status(500).json(error);
    }
  }
}

module.exports = internalController;
