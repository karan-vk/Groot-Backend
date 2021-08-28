const { Router } = require('express');
const { createTree, modifyTree, getTree, deleteTree } = require('./service');
const feed = require("./feed");
const like = require("./like");
const { cache } = require("../plugins");

const { authenticateJWT } = require('../auth');

const tree = Router();

tree.post("/", authenticateJWT, async (req, res) => {
    const { status, data } = await createTree(req.body, req.user.user);
    return res.status(status).json(data);
})

tree.put("/:id", authenticateJWT, async (req, res) => {
    const { status, data } = await modifyTree(req.params.id, req.body, req.user.user);
    return res.status(status).json(data);
})

tree.get("/:name", authenticateJWT, async (req, res) => {
    const { status, data } = await getTree(req.params.name);
    return res.status(status).json(data);
})

tree.delete("/:id", authenticateJWT, async (req, res) => {
    const { status, data } = await deleteTree(req.params.id, req.user.user);
    return res.status(status).json(data);
})
tree.get("/feed", cache.route({ name: "feed", expire: 30 }), async (_, res) => {
    const { status, data } = await feed();
    return res.status(status).json(data);
})


tree.use("/like", authenticateJWT, like);
// tree.use("/like", like);


module.exports = tree;