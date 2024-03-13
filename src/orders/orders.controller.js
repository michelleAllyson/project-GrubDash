const path = require("path");
const orders = require(path.resolve("src/data/orders-data"));
const nextId = require("../utils/nextId");

function list(req, res) {
    res.json({ data: orders });
}

function read(req, res) {
    const { orderId } = req.params;
    const foundOrder = orders.find((order) => order.id === orderId);
    res.json({ data: foundOrder });
}

function orderExists(req, res, next) {
    const { orderId } = req.params;
    const foundOrder = orders.find((order) => order.id === orderId);
    if (foundOrder) {
        return next();
    }
    next({
        status: 404,
        message: `Order does not exist: ${orderId}`,
    });
}

function create(req, res, next) {
    const { data: { deliverTo, mobileNumber, status, dishes } = {} } = req.body;

    // Check if deliverTo is missing or empty
    if (!deliverTo || deliverTo === "") {
        return next({
            status: 400,
            message: 'deliverTo is required.',
        });
    }

    // Check if mobileNumber is missing or empty
    if (!mobileNumber || mobileNumber === "") {
        return next({
            status: 400,
            message: 'mobileNumber is required.',
        });
    }

    // Check if dishes is missing, not an array, or empty
    if (!dishes || !Array.isArray(dishes) || dishes.length === 0) {
        return next({
            status: 400,
            message: 'dishes must be provided as a non-empty array.',
        });
    }

    // Check if any dish is missing quantity or if any quantity is not an integer
    for (const dish of dishes) {
        if (!('quantity' in dish) || dish.quantity === "" || !Number.isInteger(dish.quantity)) {
            return next({
                status: 400,
                message: 'Each dish must have a valid quantity as an integer.',
            });
        }
    }

    // Check if status is missing, empty, or not valid
    if (!status || status === "" || (status !== "pending" && status !== "preparing" && status !== "out-for-delivery" && status !== "delivered")) {
        return next({
            status: 400,
            message: 'status must be one of "pending", "preparing", "out-for-delivery", or "delivered".',
        });
    }

    // Generate new order ID
    const id = nextId();

    // Create new order
    const newOrder = {
        id,
        deliverTo,
        mobileNumber,
        status,
        dishes,
    };

    // Add new order to the orders array
    orders.push(newOrder);

    // Return the newly created order
    res.status(201).json({ data: newOrder });
}


function update(req, res, next) {
    const { orderId } = req.params;
    const foundOrder = orders.find((order) => order.id === orderId);
    const { data: { deliverTo, mobileNumber, status, dishes } = {} } = req.body;

    // Check if deliverTo is missing or empty
    if (!deliverTo || deliverTo === "") {
        return next({
            status: 400,
            message: 'deliverTo is required.',
        });
    }

    // Check if mobileNumber is missing or empty
    if (!mobileNumber || mobileNumber === "") {
        return next({
            status: 400,
            message: 'mobileNumber is required.',
        });
    }

    // Check if dishes is missing, not an array, or empty
    if (!dishes || !Array.isArray(dishes) || dishes.length === 0) {
        return next({
            status: 400,
            message: 'dishes must be provided as a non-empty array.',
        });
    }

    // Check if any dish is missing quantity or if any quantity is not an integer
    for (const dish of dishes) {
        if (!('quantity' in dish) || dish.quantity === "" || !Number.isInteger(dish.quantity)) {
            return next({
                status: 400,
                message: 'Each dish must have a valid quantity as an integer.',
            });
        }
    }

    // Check if status is missing, empty, or not valid
    if (!status || status === "" || (status !== "pending" && status !== "preparing" && status !== "out-for-delivery" && status !== "delivered")) {
        return next({
            status: 400,
            message: 'status must be one of "pending", "preparing", "out-for-delivery", or "delivered".',
        });
    }

    // Update the order
    foundOrder.deliverTo = deliverTo;
    foundOrder.mobileNumber = mobileNumber;
    foundOrder.status = status;
    foundOrder.dishes = dishes;

    res.json({ data: foundOrder });
}


function destroy(req, res, next) {
    const { orderId } = req.params;
    const foundOrder = orders.find((order) => order.id === orderId);

    if (!foundOrder) {
        return next({
            status: 404,
            message: `Order does not exist: ${orderId}`,
        });
    }

    if (foundOrder.status !== 'pending') {
        return next({
            status: 400,
            message: 'Order status must be "pending" to delete.',
        });
    }

    const index = orders.findIndex((order) => order.id === orderId);
    orders.splice(index, 1);
    res.sendStatus(204);
}


module.exports = {
    list,
    create: [create],
    read: [orderExists, read],
    update: [orderExists, update],
    delete: [orderExists, destroy],
};
