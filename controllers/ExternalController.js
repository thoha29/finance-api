const { external, Sequelize } = require('../models');

class externalController {
  static async getExternalList(req, res) {
    try {
      const { keyword } = req.query;
      let { page, limit } = req.query; // Mengambil kata kunci pencarian, halaman, dan limit dari query parameter

      // Konversi nilai page dan limit ke tipe data numerik
      page = parseInt(page) || 1;
      limit = parseInt(limit) || 10;

      // Hitung offset berdasarkan halaman dan limit
      const offset = (page - 1) * limit;

      let externals;
      let totalCount;

      if (keyword) {
        // Lakukan pencarian data external berdasarkan kata kunci di mana pun dalam nilai kolom
        [externals, totalCount] = await Promise.all([
          external.findAll({
            where: {
              [Sequelize.Op.or]: [
                { external_code: { [Sequelize.Op.like]: `%${keyword}%` } },
                { name: { [Sequelize.Op.like]: `%${keyword}%` } },
                { npwp: { [Sequelize.Op.like]: `%${keyword}%` } },
                { contact_name: { [Sequelize.Op.like]: `%${keyword}%` } },
                { contact_title: { [Sequelize.Op.like]: `%${keyword}%` } },
                { address: { [Sequelize.Op.like]: `%${keyword}%` } },
                { city: { [Sequelize.Op.like]: `%${keyword}%` } },
                { state_or_province: { [Sequelize.Op.like]: `%${keyword}%` } },
                { postal_code: { [Sequelize.Op.like]: `%${keyword}%` } },
                { country: { [Sequelize.Op.like]: `%${keyword}%` } },
                { email: { [Sequelize.Op.like]: `%${keyword}%` } },
                { phone: { [Sequelize.Op.like]: `%${keyword}%` } },
                { fax: { [Sequelize.Op.like]: `%${keyword}%` } },
                { payment_terms: { [Sequelize.Op.like]: `%${keyword}%` } },
                { notes: { [Sequelize.Op.like]: `%${keyword}%` } },
                { flag: { [Sequelize.Op.like]: `%${keyword}%` } },
                { segment_type: { [Sequelize.Op.like]: `%${keyword}%` } },
                // Tambahkan kolom lain yang ingin Anda cari berdasarkan keyword
              ],
            },
            limit,
            offset,
          }),
          external.count({
            where: {
              [Sequelize.Op.or]: [
                { external_code: { [Sequelize.Op.like]: `%${keyword}%` } },
                { name: { [Sequelize.Op.like]: `%${keyword}%` } },
                { npwp: { [Sequelize.Op.like]: `%${keyword}%` } },
                { contact_name: { [Sequelize.Op.like]: `%${keyword}%` } },
                { contact_title: { [Sequelize.Op.like]: `%${keyword}%` } },
                { address: { [Sequelize.Op.like]: `%${keyword}%` } },
                { city: { [Sequelize.Op.like]: `%${keyword}%` } },
                { state_or_province: { [Sequelize.Op.like]: `%${keyword}%` } },
                { postal_code: { [Sequelize.Op.like]: `%${keyword}%` } },
                { country: { [Sequelize.Op.like]: `%${keyword}%` } },
                { email: { [Sequelize.Op.like]: `%${keyword}%` } },
                { phone: { [Sequelize.Op.like]: `%${keyword}%` } },
                { fax: { [Sequelize.Op.like]: `%${keyword}%` } },
                { payment_terms: { [Sequelize.Op.like]: `%${keyword}%` } },
                { notes: { [Sequelize.Op.like]: `%${keyword}%` } },
                { flag: { [Sequelize.Op.like]: `%${keyword}%` } },
                { segment_type: { [Sequelize.Op.like]: `%${keyword}%` } },
              ],
            },
          }),
        ]);
      } else {
        // Ambil semua data external dengan pagination
        [externals, totalCount] = await Promise.all([
          external.findAll({ limit, offset }),
          external.count(),
        ]);
      }

      // Menghitung total halaman berdasarkan jumlah data dan limit per halaman
      const totalPages = Math.ceil(totalCount / limit);

      // Kirim respons JSON dengan hasil pencarian, jumlah data, dan informasi pagination
      res.status(200).json({
        totalCount,
        totalPages,
        currentPage: page,
        data: externals,
      });
    } catch (error) {
      res.status(500).json(error);
    }
  }
  static async create(req, res) {
    try {
      const {
        external_code,
        name,
        npwp,
        contact_name,
        contact_title,
        address,
        city,
        state_or_province,
        postal_code,
        country,
        email,
        phone,
        fax,
        payment_terms,
        notes,
        flag,
        segment_type,
      } = req.body;

      const existingExternal = await external.findOne({
        where: { external_code },
      });

      if (existingExternal) {
        return res.status(409).json({
          message: 'External code already exists.',
        });
      }

      // Membuat data external baru
      let result = await external.create({
        external_code,
        name,
        npwp,
        contact_name,
        contact_title,
        address,
        city,
        state_or_province,
        postal_code,
        country,
        email,
        phone,
        fax,
        payment_terms,
        notes,
        flag,
        segment_type,
      });

      // Mengirim respons JSON dengan data yang telah dibuat
      res.status(201).json(result);
    } catch (error) {
      // Jika terjadi error, kirim respons JSON dengan pesan error
      res.status(500).json(error);
    }
  }
  static async update(req, res) {
    try {
      const { id } = req.params; // Ambil ID dari parameter URL
      const {
        external_code,
        name,
        npwp,
        contact_name,
        contact_title,
        address,
        city,
        state_or_province,
        postal_code,
        country,
        email,
        phone,
        fax,
        payment_terms,
        notes,
        flag,
        segment_type,
      } = req.body;

      // Temukan data external berdasarkan ID
      let existingExternal = await external.findByPk(id);

      // Jika data tidak ditemukan, kirim respons dengan status 404
      if (!existingExternal) {
        return res
          .status(404)
          .json({ message: `Data external with id ${id} not found` });
      }

      const existingExternalCode = await external.findOne({
        where: {
          external_code,
          id: { [Sequelize.Op.ne]: id },
        },
      });

      if (existingExternalCode) {
        return res.status(409).json({
          message: 'External code already exists.',
        });
      }

      // Update data external
      await existingExternal.update({
        external_code,
        name,
        npwp,
        contact_name,
        contact_title,
        address,
        city,
        state_or_province,
        postal_code,
        country,
        email,
        phone,
        fax,
        payment_terms,
        notes,
        flag,
        segment_type,
      });

      res.status(200).json(existingExternal);
    } catch (error) {
      res.status(500).json(error);
    }
  }
  static async delete(req, res) {
    try {
      const { id } = req.params; // Ambil ID dari parameter URL

      // Temukan data external berdasarkan ID
      let existingExternal = await external.findByPk(id);

      // Jika data tidak ditemukan, kirim respons dengan status 404
      if (!existingExternal) {
        return res
          .status(404)
          .json({ message: `Data external with id ${id} not found` });
      }

      // Hapus data external
      await existingExternal.destroy();

      res
        .status(200)
        .json({ message: `Data external with id ${id} has been deleted` });
    } catch (error) {
      res.status(500).json(error);
    }
  }

  static async getExternalById(req, res) {
    try {
      const { id } = req.params;
      const existingExternal = await external.findByPk(id);

      if (!existingExternal) {
        return res
          .status(404)
          .json({ message: `External with id ${id} not found` });
      }
      res.status(200).json(existingExternal);
    } catch (error) {
      res.status(500).json(error);
    }
  }
}

module.exports = externalController;
