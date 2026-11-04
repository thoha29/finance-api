const {
  account_category,
  business_unit,
  project,
  external,
  internal,
  project_cost,
} = require('../models');

class MenuDropdownController {
  static async getAccountCategoryDropdown(req, res) {
    try {
      // Ambil data dengan level = 5
      const categories = await account_category.findAll({
        where: { level: 5 },
        attributes: ['id', 'account_code', 'name5'], // Ambil hanya kolom yang diperlukan
      });

      // Olah data menjadi format yang diinginkan
      const formattedData = categories.map((category) => ({
        label: `${category.account_code} - ${category.name5}`, // Format: 'account_code - name5'
        value: category.account_code, // Gunakan 'id' sebagai value
      }));

      // Kirimkan hasil dalam respons
      res.status(200).json({
        success: true,
        data: formattedData,
      });
    } catch (error) {
      res.status(500).json(error);
    }
  }

  static async getBusinessUnitDropdown(req, res) {
    try {
      const businessUnit = await business_unit.findAll();

      const formattedData = businessUnit.map((unit) => ({
        label: `${unit.business_code} - ${unit.name}`,
        value: `${unit.business_code}`,
      }));
      res.status(200).json(formattedData);
    } catch (error) {
      res.status(500).json(error);
    }
  }

  static async getProjectsDropdown(req, res) {
    try {
      const value = await project.findAll();
      const formattedData = value.map((project) => ({
        label: `${project.project_code} : ${project.name}`,
        value: `${project.project_code}`,
      }));
      res.status(200).json(formattedData);
    } catch (error) {
      res.status(500).json(error);
    }
  }

  static async getExternalDropdown(req, res) {
    try {
      const value = await external.findAll();
      const formattedData = value.map((external) => ({
        label: `${external.external_code} - ${external.name}`,
        value: `${external.external_code}`,
      }));
      res.status(200).json(formattedData);
    } catch (error) {
      res.status(500).json(error);
    }
  }

  static async getInternalDropdown(req, res) {
    try {
      const value = await internal.findAll();
      const formattedData = value.map((internal) => ({
        label: `${internal.internal_code} - ${internal.first_name}`,
        value: `${internal.internal_code}`,
      }));
      res.status(200).json(formattedData);
    } catch (error) {
      res.status(500).json(error);
    }
  }

  static async getProjectCostDropdown(req, res) {
    try {
      // Ambil data dengan level = 4
      const projectCost = await project_cost.findAll({
        where: { level: 4 },
        attributes: ['id', 'prjCost_code', 'name4'], // Ambil hanya kolom yang diperlukan
      });

      // Olah data menjadi format yang diinginkan
      const formattedData = projectCost.map((prj_cost) => ({
        label: `${prj_cost.prjCost_code} - ${prj_cost.name4}`,
        value: prj_cost.prjCost_code, // Gunakan 'id' sebagai value
      }));

      // Kirimkan hasil dalam respons
      res.status(200).json(formattedData);
    } catch (error) {
      res.status(500).json(error);
    }
  }
}

module.exports = MenuDropdownController;
