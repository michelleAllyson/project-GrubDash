const express = require("express");
const router = express.Router();
const controller = require("./dishes.controller");
const methodNotAllowed = require("../errors/methodNotAllowed");

router.route("/")
    .get(controller.list)
    .post(controller.create);

router.route("/:dishId")
    .get(controller.read)
    .put(controller.update)
    .all(methodNotAllowed);

module.exports = router;
