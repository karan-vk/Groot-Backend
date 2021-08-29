const { Router } = require('express');
const { authenticateJWT } = require('../auth');
const { createFund, getPendingFunds, getFund, updateFund, deleteFund, } = require('./service');
const funds = Router();
funds.post('/', authenticateJWT, async (req, res) => {
    const { amount, currency, treeId } = req.body;
    const fund = await createFund({ amount, currency, treeId }, req.user.user);
    return res.status(fund.status).json(fund.data);
})
funds.get('/pending', authenticateJWT, async (req, res) => {
    const { treeId } = req.body;
    const fund = await getPendingFunds(req.user.user);
    return res.status(fund.status).json(fund.data);
})

funds.get('/', authenticateJWT, async (req, res) => {
    const { id } = req.body;
    const fund = await getFund(id, req.user.user);
    return res.status(fund.status).json(fund.data);
})
funds.put('/', authenticateJWT, async (req, res) => {
    const { id, amount } = req.body;
    const fund = await updateFund({ id, amount }, req.user.user);
    return res.status(fund.status).json(fund.data);
})
funds.delete('/', authenticateJWT, async (req, res) => {
    const { id } = req.body;
    const fund = await deleteFund({ id }, req.user.user);
    return res.status(fund.status).json(fund.data);
})


module.exports = funds;