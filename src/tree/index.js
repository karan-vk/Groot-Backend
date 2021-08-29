const { Router } = require('express');
const { createTree, modifyTree, getTree, deleteTree } = require('./service');
const feed = require("./feed");
const like = require("./like");
const { cache, cacheFeedSetName, noCacheQuery } = require("../plugins");

const { authenticateJWT, authenticateJWTOPT } = require('../auth');

const tree = Router();

tree.post("/", authenticateJWT, async (req, res) => {
    const { status, data } = await createTree(req.body, req.user.user);
    return res.status(status).json(data);
})

tree.put("/:id", authenticateJWT, async (req, res) => {
    const { status, data } = await modifyTree(req.params.id, req.body, req.user.user);
    return res.status(status).json(data);
})

tree.get("/get/:name", authenticateJWT, async (req, res) => {
    const { status, data } = await getTree(req.params.name);
    return res.status(status).json(data);
})

tree.delete("/:id", authenticateJWT, async (req, res) => {
    const { status, data } = await deleteTree(req.params.id, req.user.user);
    return res.status(status).json(data);
})
tree.get("/feed", authenticateJWTOPT, noCacheQuery, cacheFeedSetName, cache.route({
    expire: 20,
}), async (req, res) => {
    const { status, data } = await feed(req.body.cursor, Number(req.body.limit), req.user.user);
    return res.status(status).json(data);
    // return res.sendStatus(200);
})


// tree.use();
tree.use("/like", authenticateJWT, like)
// tree.use("/like", like);


module.exports = tree;