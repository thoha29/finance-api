const { ho_advance, project_cost_transaction } = require('../models');

class HoAdvanceController {
  static async getHoAdvanceByPctId(req, res) {
    try {
      const { pct_id } = req.params;

      // Cari HO Advance
      let hoAdvance = await ho_advance.findOne({
        where: { pct_id },
        include: [
          {
            model: project_cost_transaction,
            as: 'project_cost_transaction',
          },
        ],
      });

      // Jika belum ada → auto create
      if (!hoAdvance) {
        const pct = await project_cost_transaction.findByPk(pct_id);

        if (!pct) {
          return res.status(404).json({
            message: `Project cost transaction with id ${pct_id} not found`,
          });
        }

        const total_cost_1 = Number(pct.total_cost) || 0;

        hoAdvance = await ho_advance.create({
          pct_id,
          total_cost_1,
          third_party_tax: 0,
          cost_of_money: 0,
          cost_of_money_percent: 0,
          sales_markrting_cost: 0,
          total_cost_2: 0,
          grand_total_cost: total_cost_1,
          boq_value: 0,
          pph_and_risk: 0,
          nett_revenue: 0,
          management_fee: 0,
          management_fee_percent: 0,
          qtyB: 1,
          qtyC: 1,
          qtyD: 1,
          totalB: 0,
          totalC: 0,
          totalD: 0,
        });
      }

      res.status(200).json(hoAdvance);
    } catch (error) {
      res.status(500).json(error);
    }
  }

  static async updateHoAdvance(req, res) {
    try {
      const { pct_id } = req.params;
      const {
        qtyB,
        qtyC,
        qtyD,
        third_party_tax,
        cost_of_money_percent,
        sales_markrting_cost,
        boq_value,
      } = req.body;

      const hoAdvance = await ho_advance.findOne({
        where: { pct_id },
      });

      if (!hoAdvance) {
        return res.status(404).json({
          message: `HO Advance with pct_id ${pct_id} not found`,
        });
      }

      // ===== Ambil sumber utama =====
      const pct = await project_cost_transaction.findByPk(pct_id);

      if (!pct) {
        return res.status(404).json({
          message: `Project cost transaction not found`,
        });
      }

      const total_cost_1 = Number(pct.total_cost) || 0;

      // ===== RUMUS =====
      const _qtyB = Number(qtyB) || 1;
      const _qtyC = Number(qtyC) || 1;
      const _qtyD = Number(qtyD) || 1;

      const _thirdPartyTax = Number(third_party_tax) || 0;
      const _salesCost = Number(sales_markrting_cost) || 0;
      const _boqValue = Number(boq_value) || 0;
      const _costMoneyPercent = Number(cost_of_money_percent) || 0;

      // totalB
      const totalB = _qtyB * _thirdPartyTax;

      // cost_of_money
      const cost_of_money = (_costMoneyPercent / 100) * total_cost_1 * (1 / 12);

      // totalC
      const totalC = _qtyC * cost_of_money;

      // totalD
      const totalD = _qtyD * _salesCost;

      // total_cost_2
      const total_cost_2 = totalB + totalC + totalD;

      // grand total
      const grand_total_cost = total_cost_1 + total_cost_2;

      // pph & risk (10%)
      const pph_and_risk = 0.1 * _boqValue;

      // nett revenue
      const nett_revenue = _boqValue - pph_and_risk;

      // management fee
      const management_fee = nett_revenue - grand_total_cost;

      // management fee %
      const management_fee_percent =
        grand_total_cost > 0 ? (management_fee / grand_total_cost) * 100 : 0;

      // ===== UPDATE =====
      await hoAdvance.update({
        total_cost_1,

        qtyB,
        qtyC,
        qtyD,

        third_party_tax: _thirdPartyTax,
        cost_of_money_percent: _costMoneyPercent,
        cost_of_money,
        sales_markrting_cost: _salesCost,

        totalB,
        totalC,
        totalD,

        total_cost_2,
        grand_total_cost,

        boq_value: _boqValue,
        pph_and_risk,
        nett_revenue,
        management_fee,
        management_fee_percent,
      });

      res.status(200).json(hoAdvance);
    } catch (error) {
      res.status(500).json(error);
    }
  }
}

module.exports = HoAdvanceController;
