const { user, business_unit, Sequelize } = require('../models');
const { decryptPwd } = require('../helpers/bcrypt');
const { tokenGenerator, tokenVerifier } = require('../helpers/jsonwebtoken');
const { Op } = require('sequelize');

class UserController {
  static async getUsersList(req, res) {
    try {
      const { keyword } = req.query;
      let { page, limit } = req.query;

      // Konversi nilai page dan limit ke tipe data numerik
      page = parseInt(page) || 1;
      limit = parseInt(limit) || 10;

      // Hitung offset berdasarkan halaman dan limit
      const offset = (page - 1) * limit;

      let users;
      let totalCount;

      if (keyword) {
        // Lakukan pencarian data user berdasarkan kata kunci di mana pun dalam nilai kolom
        [users, totalCount] = await Promise.all([
          user.findAll({
            include: [business_unit],
            where: {
              [Sequelize.Op.or]: [
                { user_name: { [Sequelize.Op.like]: `%${keyword}%` } },
                { name: { [Sequelize.Op.like]: `%${keyword}%` } },
                { business_code: { [Sequelize.Op.like]: `%${keyword}%` } },
                { level: { [Sequelize.Op.like]: `%${keyword}%` } },
              ],
            },
            // attributes: { exclude: ['password'] }, // Exclude password
            limit,
            offset,
          }),
          user.count({
            where: {
              [Sequelize.Op.or]: [
                { user_name: { [Sequelize.Op.like]: `%${keyword}%` } },
                { name: { [Sequelize.Op.like]: `%${keyword}%` } },
                { business_code: { [Sequelize.Op.like]: `%${keyword}%` } },
                { level: { [Sequelize.Op.like]: `%${keyword}%` } },
              ],
            },
          }),
        ]);
      } else {
        // Ambil semua data user dengan pagination
        [users, totalCount] = await Promise.all([
          user.findAll({
            include: [business_unit],
            // attributes: { exclude: ['password'] }, // Exclude password
            limit,
            offset,
          }),
          user.count(),
        ]);
      }

      // Menghitung total halaman berdasarkan jumlah data dan limit per halaman
      const totalPages = Math.ceil(totalCount / limit);

      // Kirim respons JSON dengan hasil pencarian, jumlah data, dan informasi pagination
      res.status(200).json({
        totalCount,
        totalPages,
        currentPage: page,
        data: users,
      });
    } catch (error) {
      res.status(500).json(error);
    }
  }

  static async createUser(req, res) {
    try {
      const { user_name, name, password, business_code, level } = req.body;

      // Cek apakah user_name sudah ada di database
      const existingUser = await user.findOne({ where: { user_name } });
      if (existingUser) {
        return res.status(400).json({ message: 'User name already exists' });
      }

      // Jika tidak ada duplikat, buat user baru
      let result = await user.create({
        user_name,
        name,
        password,
        business_code,
        level,
      });
      res.status(201).json(result);
    } catch (error) {
      res.status(500).json(error);
    }
  }

  static async loginUser(req, res) {
    try {
      const { user_name, password } = req.body;

      // Temukan user berdasarkan user_name yang persis sama (case-sensitive)
      let userFound = await user.findOne({
        where: Sequelize.where(
          Sequelize.fn('BINARY', Sequelize.col('user_name')),
          user_name
        ),
      });

      if (userFound) {
        // Periksa kata sandi menggunakan fungsi decryptPwd yang case-sensitive
        if (decryptPwd(password, userFound.password)) {
          let access_token = tokenGenerator(userFound);
          // console.log({ access_token });
          res.status(200).json({ access_token });
          console.log(tokenVerifier(access_token));
        } else {
          res.status(403).json({ message: 'Invalid password' });
        }
      } else {
        res.status(404).json({ message: 'User not found' });
      }
    } catch (error) {
      res.status(500).json(error);
    }
  }

  static async updateUser(req, res) {
    try {
      const { id } = req.params;
      const { user_name, name, password, business_code, level } = req.body;

      // 1️⃣ Cari user BERDASARKAN ID
      const existingUser = await user.findByPk(id);
      if (!existingUser) {
        return res.status(404).json({ message: 'User not found' });
      }

      // 2️⃣ Cek username dipakai user lain
      if (user_name) {
        const usernameUsed = await user.findOne({
          where: {
            user_name,
            id: { [Op.ne]: id }, // selain user ini
          },
        });

        if (usernameUsed) {
          return res.status(400).json({ message: 'User name already exists' });
        }
      }

      // 3️⃣ Siapkan payload update
      const updateData = {
        user_name,
        name,
        business_code,
        level,
      };

      // 4️⃣ Password hanya diupdate jika DIKIRIM & TIDAK KOSONG
      if (password && password.trim() !== '') {
        updateData.password = password;
      }

      // 5️⃣ Update user
      await existingUser.update(updateData);

      res.status(200).json(existingUser);
    } catch (error) {
      console.error(error);
      res.status(500).json(error);
    }
  }

  static async deleteUser(req, res) {
    try {
      const { id } = req.params; // Ambil ID dari parameter URL

      // Temukan data user berdasarkan ID
      let existingUser = await user.findByPk(id);

      // Jika data tidak ditemukan, kirim respons dengan status 404
      if (!existingUser) {
        return res
          .status(404)
          .json({ message: `Data user with id ${id} not found` });
      }

      // Hapus data user
      await existingUser.destroy();

      // Kirim respons JSON dengan pesan sukses
      res
        .status(200)
        .json({ message: `Data user with id ${id} has been deleted` });
    } catch (error) {
      res.status(500).json(error);
    }
  }

  static async getUserById(req, res) {
    try {
      const { id } = req.params; // Ambil ID dari parameter URL

      // Temukan data user berdasarkan ID
      let existingUser = await user.findByPk(id);

      // Jika data tidak ditemukan, kirim respons dengan status 404
      if (!existingUser) {
        return res
          .status(404)
          .json({ message: `Data user with id ${id} not found` });
      }
      res.status(200).json(existingUser);
    } catch (error) {
      res.status(500).json(error);
    }
  }
}

module.exports = UserController;
