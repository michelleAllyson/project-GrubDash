const path = require("path");

// Use the existing dishes data
const dishes = require(path.resolve("src/data/dishes-data"));

// Use this function to assign ID's when necessary
const nextId = require("../utils/nextId");

function list(req, res) {
    res.json({ data: dishes });
}

function create(req, res, next) {
    const { data: { name, description, price, image_url } = {} } = req.body;
    if (!name || !description || price === undefined || price <= 0 || isNaN(price) || !image_url) {
        return next({
            status: 400,
            message: "All fields (name, description, price, image_url) are required.",
        });
    }
    const newDish = {
        id: nextId(),
        name,
        description,
        price,
        image_url,
    };
    dishes.push(newDish);
    res.status(201).json({ data: newDish });
}

function dishExists(req, res, next) {
    const { dishId } = req.params;
    const foundDish = dishes.find((dish) => dish.id === dishId);
    if (foundDish) {
        return next();
    }
    next ({
        status: 404,
        message: `Dish does not exist: ${dishId}`
    });
}

function read(req, res) {
    const { dishId } = req.params;
    const foundDish = dishes.find((dish) => dish.id === dishId);
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

function update(req, res, next) {
    const { dishId } = req.params;
    const foundDish = dishes.find((dish) => dish.id === dishId);
    if (!foundDish) {
        return next({
            status: 404,
            message: `Dish not found with ID: ${dishId}`,
        });
    }
    const { data: { name, description, price, image_url } = {} } = req.body;
    if (!name || !description || price === undefined || price <= 0  || isNaN(price) || !image_url) {
        return next({
            status: 400,
            message: "All fields (name, description, price, image_url) are required.",
        });
    }
    foundDish.name = name;
    foundDish.description = description;
    foundDish.price = price;
    foundDish.image_url = image_url;
    res.json({ data: foundDish });
}

function destroy(req, res) {
    // Your logic to delete the dish
    const { dishId } = req.params;
    const index = dishes.findIndex((dish) => dish.id === dishId);
    if (index !== -1) {
        dishes.splice(index, 1);
        res.sendStatus(204); // No content, dish successfully deleted
    } else {
        res.status(404).json({ error: `Dish with id ${dishId} not found` });
    }
}


module.exports = {
    create,
    list,
    read: [dishExists, read],
    update: [dishExists, dishIdMatchesBody, update],
    delete: destroy
};
