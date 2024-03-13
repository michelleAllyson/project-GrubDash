const path = require("path");

// Use the existing dishes data
const dishes = require(path.resolve("src/data/dishes-data"));

// Use this function to assign ID's when necessary
const nextId = require("../utils/nextId");


// // In the src/dishes/dishes.controller.js file, add handlers and middleware functions to 
// create, read, update, and list dishes. Note that dishes cannot be deleted.
// TODO: Implement the /dishes handlers needed to make the tests pass
function list(req, res) {
    res.json({ data: dishes });
}

function create(req, res) {
    const { data: { name, description, price, image_url } = {} } = req.body;
    const newDish = {
        id: ++lastDishId,
        name: name,
        description: description,
        price: price,
        image_url: image_url,
    };
    dishes.push(newDish);
    res.status(201).json({ data: newDish });
}

function dishExists(req, res, next) {
    const { dishId } = req.params;
    const foundDish = dishes.find((dish) => dish.id === Number(dishId));
    if (foundDish) {
        return next();
    }
    next({
        status: 404,
        message: `Dish does not exist: ${dishId}`,
    }); 
}

function read(req, res) {
    const { dishId } = req.params;
    const foundDish = dishes.find((dish) => dish.id === Number(dishId));
    res.json({ data: foundDish });
}

function dishIdMatchesBody(req, res, next) {
    const { dishId } = req.params;
    const { data: { id } = {} } = req.body;
    if (id === undefined || id === dishId) {
        return next();
    }
    next({
        status: 400,
        message: `Dish id does not match route id. Dish: ${id}, Route: ${dishId}`,
    });
}

function update(req, res) {
    const { dishId } = req.params;
    const foundDish = dishes.find((dish) => dish.id === Number(dishId));
    const { data: { name, description, price, image_url } = {} } = req.body;
    if (foundDish) {
        foundDish.name = name;
        foundDish.description = description;
        foundDish.price = price;
        foundDish.image_url = image_url;
        res.json({ data: foundDish });
    }
}

module.exports = {
    create,
    list,
    read: [dishExists, read],
    update: [dishExists, dishIdMatchesBody, update],
};
