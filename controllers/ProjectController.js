const { project, Sequelize } = require('../models');
const moment = require('moment');

class ProjectController {
  static async getProjectList(req, res) {
    try {
      const { keyword } = req.query;
      let { page, limit } = req.query;

      // Konversi nilai page dan limit ke tipe data numerik
      page = parseInt(page) || 1;
      limit = parseInt(limit) || 10;

      // Hitung offset berdasarkan halaman dan limit
      const offset = (page - 1) * limit;

      let projects;
      let totalCount;

      if (keyword) {
        // Lakukan pencarian data project berdasarkan kata kunci di mana pun dalam nilai kolom
        [projects, totalCount] = await Promise.all([
          project.findAll({
            where: {
              [Sequelize.Op.or]: [
                { project_code: { [Sequelize.Op.like]: `%${keyword}%` } },
                { name: { [Sequelize.Op.like]: `%${keyword}%` } },
                { key_person_id: { [Sequelize.Op.like]: `%${keyword}%` } },
                { customer_id: { [Sequelize.Op.like]: `%${keyword}%` } },
                { description: { [Sequelize.Op.like]: `%${keyword}%` } },
                { poNo1: { [Sequelize.Op.like]: `%${keyword}%` } },
                { poNo2: { [Sequelize.Op.like]: `%${keyword}%` } },
                { contact: { [Sequelize.Op.like]: `%${keyword}%` } },
                { contact_date: { [Sequelize.Op.like]: `%${keyword}%` } },
                { contact_check: { [Sequelize.Op.like]: `%${keyword}%` } },
                { wo: { [Sequelize.Op.like]: `%${keyword}%` } },
                { wo_date: { [Sequelize.Op.like]: `%${keyword}%` } },
                { wo_check: { [Sequelize.Op.like]: `%${keyword}%` } },
                { value: { [Sequelize.Op.like]: `%${keyword}%` } },
                { budget: { [Sequelize.Op.like]: `%${keyword}%` } },
                { address1: { [Sequelize.Op.like]: `%${keyword}%` } },
                { address2: { [Sequelize.Op.like]: `%${keyword}%` } },
                { phone1: { [Sequelize.Op.like]: `%${keyword}%` } },
                { phone2: { [Sequelize.Op.like]: `%${keyword}%` } },
                { invoice: { [Sequelize.Op.like]: `%${keyword}%` } },
                { invoice_date: { [Sequelize.Op.like]: `%${keyword}%` } },
                { invoice_check: { [Sequelize.Op.like]: `%${keyword}%` } },
                { compilation: { [Sequelize.Op.like]: `%${keyword}%` } },
                { compilation_date: { [Sequelize.Op.like]: `%${keyword}%` } },
                { compilation_check: { [Sequelize.Op.like]: `%${keyword}%` } },
                { start: { [Sequelize.Op.like]: `%${keyword}%` } },
                { start_date: { [Sequelize.Op.like]: `%${keyword}%` } },
                { start_check: { [Sequelize.Op.like]: `%${keyword}%` } },
              ],
            },
            limit,
            offset,
          }),
          project.count({
            where: {
              [Sequelize.Op.or]: [
                { project_code: { [Sequelize.Op.like]: `%${keyword}%` } },
                { name: { [Sequelize.Op.like]: `%${keyword}%` } },
                { key_person_id: { [Sequelize.Op.like]: `%${keyword}%` } },
                { customer_id: { [Sequelize.Op.like]: `%${keyword}%` } },
                { description: { [Sequelize.Op.like]: `%${keyword}%` } },
                { poNo1: { [Sequelize.Op.like]: `%${keyword}%` } },
                { poNo2: { [Sequelize.Op.like]: `%${keyword}%` } },
                { contact: { [Sequelize.Op.like]: `%${keyword}%` } },
                { contact_date: { [Sequelize.Op.like]: `%${keyword}%` } },
                { contact_check: { [Sequelize.Op.like]: `%${keyword}%` } },
                { wo: { [Sequelize.Op.like]: `%${keyword}%` } },
                { wo_date: { [Sequelize.Op.like]: `%${keyword}%` } },
                { wo_check: { [Sequelize.Op.like]: `%${keyword}%` } },
                { value: { [Sequelize.Op.like]: `%${keyword}%` } },
                { budget: { [Sequelize.Op.like]: `%${keyword}%` } },
                { address1: { [Sequelize.Op.like]: `%${keyword}%` } },
                { address2: { [Sequelize.Op.like]: `%${keyword}%` } },
                { phone1: { [Sequelize.Op.like]: `%${keyword}%` } },
                { phone2: { [Sequelize.Op.like]: `%${keyword}%` } },
                { invoice: { [Sequelize.Op.like]: `%${keyword}%` } },
                { invoice_date: { [Sequelize.Op.like]: `%${keyword}%` } },
                { invoice_check: { [Sequelize.Op.like]: `%${keyword}%` } },
                { compilation: { [Sequelize.Op.like]: `%${keyword}%` } },
                { compilation_date: { [Sequelize.Op.like]: `%${keyword}%` } },
                { compilation_check: { [Sequelize.Op.like]: `%${keyword}%` } },
                { start: { [Sequelize.Op.like]: `%${keyword}%` } },
                { start_date: { [Sequelize.Op.like]: `%${keyword}%` } },
                { start_check: { [Sequelize.Op.like]: `%${keyword}%` } },
              ],
            },
          }),
        ]);
      } else {
        // Ambil semua data project dengan pagination
        [projects, totalCount] = await Promise.all([
          project.findAll({ limit, offset }),
          project.count(),
        ]);
      }

      // Menghitung total halaman berdasarkan jumlah data dan limit per halaman
      const totalPages = Math.ceil(totalCount / limit);

      // Kirim respons JSON dengan hasil pencarian, jumlah data, dan informasi pagination
      res.status(200).json({
        totalCount,
        totalPages,
        currentPage: page,
        data: projects,
      });
    } catch (error) {
      res.status(500).json(error);
    }
  }

  static async createProject(req, res) {
    try {
      const {
        project_code,
        name,
        key_person_id,
        customer_id,
        description,
        poNo1,
        poNo2,
        contact,
        contact_date,
        contact_check,
        wo,
        wo_date,
        wo_check,
        value,
        budget,
        address1,
        address2,
        phone1,
        phone2,
        invoice,
        invoice_date,
        invoice_check,
        compilation,
        compilation_date,
        compilation_check,
        start,
        start_date,
        start_check,
      } = req.body;

      // Validasi dan konversi format tanggal menggunakan moment.js
      const formattedContactDate = moment(contact_date, 'YYYY-MM-DD', true);
      const formattedWoDate = moment(wo_date, 'YYYY-MM-DD', true);
      const formattedInvoiceDate = moment(invoice_date, 'YYYY-MM-DD', true);
      const formattedCompilationDate = moment(
        compilation_date,
        'YYYY-MM-DD',
        true
      );
      const formattedStartDate = moment(start_date, 'YYYY-MM-DD', true);

      // Validasi check hanya menerima "Yes" atau "No"
      // const validChecks = ['Yes', 'No'];
      // if (
      //   !validChecks.includes(contact_check) ||
      //   !validChecks.includes(wo_check) ||
      //   !validChecks.includes(invoice_check) ||
      //   !validChecks.includes(compilation_check) ||
      //   !validChecks.includes(start_check)
      // ) {
      //   return res.status(400).json({ message: 'Invalid check value' });
      // }

      // Cek apakah tanggal-tanggal yang diinput adalah format tanggal yang valid
      // if (
      //   !formattedContactDate.isValid() ||
      //   !formattedWoDate.isValid() ||
      //   !formattedInvoiceDate.isValid() ||
      //   !formattedCompilationDate.isValid() ||
      //   !formattedStartDate.isValid()
      // ) {
      //   return res.status(400).json({ message: 'Invalid date format' });
      // }

      const existingProject = await project.findOne({
        where: { project_code },
      });

      if (existingProject) {
        return res
          .status(409)
          .json({ message: 'Project code already exists.' });
      }

      // Simpan data proyek ke dalam database
      const newProject = await project.create({
        project_code,
        name,
        key_person_id,
        customer_id,
        description,
        poNo1,
        poNo2,
        contact,
        contact_date, //: formattedContactDate.format('YYYY-MM-DD'), // Format tanggal sesuai kebutuhan
        contact_check,
        wo,
        wo_date, //: formattedWoDate.format('YYYY-MM-DD'), // Format tanggal sesuai kebutuhan
        wo_check,
        value,
        budget,
        address1,
        address2,
        phone1,
        phone2,
        invoice,
        invoice_date, //: formattedInvoiceDate.format('YYYY-MM-DD'), // Format tanggal sesuai kebutuhan
        invoice_check,
        compilation,
        compilation_date, //: formattedCompilationDate.format('YYYY-MM-DD'), // Format tanggal sesuai kebutuhan
        compilation_check,
        start,
        start_date, //: formattedStartDate.format('YYYY-MM-DD'), // Format tanggal sesuai kebutuhan
        start_check,
      });

      res.status(201).json(newProject);
    } catch (error) {
      res.status(500).json(error);
    }
  }

  static async updateProject(req, res) {
    try {
      const { id } = req.params;
      const {
        project_code,
        name,
        key_person_id,
        customer_id,
        description,
        poNo1,
        poNo2,
        contact,
        contact_date,
        contact_check,
        wo,
        wo_date,
        wo_check,
        value,
        budget,
        address1,
        address2,
        phone1,
        phone2,
        invoice,
        invoice_date,
        invoice_check,
        compilation,
        compilation_date,
        compilation_check,
        start,
        start_date,
        start_check,
      } = req.body;

      // Validasi dan konversi format tanggal menggunakan moment.js
      const formattedContactDate = moment(contact_date, 'YYYY-MM-DD', true);
      const formattedWoDate = moment(wo_date, 'YYYY-MM-DD', true);
      const formattedInvoiceDate = moment(invoice_date, 'YYYY-MM-DD', true);
      const formattedCompilationDate = moment(
        compilation_date,
        'YYYY-MM-DD',
        true
      );
      const formattedStartDate = moment(start_date, 'YYYY-MM-DD', true);

      // Validasi check hanya menerima "Yes" atau "No"
      // const validChecks = ['Yes', 'No'];
      // if (
      //   !validChecks.includes(contact_check) ||
      //   !validChecks.includes(wo_check) ||
      //   !validChecks.includes(invoice_check) ||
      //   !validChecks.includes(compilation_check) ||
      //   !validChecks.includes(start_check)
      // ) {
      //   return res.status(400).json({ message: 'Invalid check value' });
      // }

      // Cek apakah tanggal-tanggal yang diinput adalah format tanggal yang valid
      // if (
      //   !formattedContactDate.isValid() ||
      //   !formattedWoDate.isValid() ||
      //   !formattedInvoiceDate.isValid() ||
      //   !formattedCompilationDate.isValid() ||
      //   !formattedStartDate.isValid()
      // ) {
      //   return res.status(400).json({ message: 'Invalid date format' });
      // }

      const existingProject = await project.findByPk(id);

      if (!existingProject) {
        return res
          .status(404)
          .json({ message: `Project with id ${id} not found` });
      }

      await existingProject.update({
        project_code,
        name,
        key_person_id,
        customer_id,
        description,
        poNo1,
        poNo2,
        contact,
        contact_date, //: formattedContactDate.format('YYYY-MM-DD'), // Format tanggal sesuai kebutuhan
        contact_check,
        wo,
        wo_date, //: formattedWoDate.format('YYYY-MM-DD'), // Format tanggal sesuai kebutuhan
        wo_check,
        value,
        budget,
        address1,
        address2,
        phone1,
        phone2,
        invoice,
        invoice_date, //: formattedInvoiceDate.format('YYYY-MM-DD'), // Format tanggal sesuai kebutuhan
        invoice_check,
        compilation,
        compilation_date, //: formattedCompilationDate.format('YYYY-MM-DD'), // Format tanggal sesuai kebutuhan
        compilation_check,
        start,
        start_date, //: formattedStartDate.format('YYYY-MM-DD'), // Format tanggal sesuai kebutuhan
        start_check,
      });

      res.status(200).json(existingProject);
    } catch (error) {
      res.status(500).json(error);
    }
  }

  static async deleteProject(req, res) {
    try {
      const { id } = req.params;

      const existingProject = await project.findByPk(id);

      if (!existingProject) {
        return res
          .status(404)
          .json({ message: `Project with id ${id} not found` });
      }

      await existingProject.destroy();

      res
        .status(200)
        .json({ message: `Project with id ${id} has been deleted` });
    } catch (error) {
      res.status(500).json(error);
    }
  }

  static async getProjectById(req, res) {
    try {
      const { id } = req.params;
      const existingProject = await project.findByPk(id);

      if (!existingProject) {
        return res
          .status(404)
          .json({ message: `Project with id ${id} not found` });
      }
      res.status(200).json(existingProject);
    } catch (error) {
      res.status(500).json(error);
    }
  }
}

module.exports = ProjectController;
