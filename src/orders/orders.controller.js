const path = require("path");

// Use the existing order data
const orders = require(path.resolve("src/data/orders-data"));

// Use this function to assigh ID's when necessary
const nextId = require("../utils/nextId");

// In the src/orders/orders.controller.js file, 
// add handlers and middleware functions to create, read, update, delete, and list orders.

// TODO: Implement the /orders handlers needed to make the tests pass
function list(req, res) {

    res.json({ data: orders });
}

function read(req, res) {
    const { orderId } = req.params;
    const foundOrder = orders.find((order) => order.id === Number(orderId));
    res.json({ data: foundOrder });
}

function orderExists(req, res, next) {
    const { orderId } = req.params;
    const foundOrder = orders.find((order) => order.id === Number(orderId));
    if (foundOrder) {
        return next();
    }
    next({
        status: 404,
        message: `Order does not exist: ${orderId}`,
    });
}

function deliverToExists(req, res, next) {
    const { data: { deliverTo } = {} } = req.body;
}

function mobileNumberExists(req, res, next) {
    const { data: { mobileNumber } = {} } = req.body;
}

function statusExists(req, res, next) {
    const { data: { status } = {} } = req.body;
}

function dishesExists(req, res, next) {
    const { data: { dishes } = {} } = req.body;
}

function dishIdMatchesBody(req, res, next) {
    const { orderId } = req.params;
    const { data: { id } = {} } = req.body;
    if (id === undefined || id === orderId) {
        return next();
    } 
    next({
        status: 400,
        message: `Order id does not match route id. Order: ${id}, Route: ${orderId}`,
    });
}

function create (req, res) {
    const { data: { deliverTo, mobileNumber, status, dishes } = {} } = req.body;        
    const newOrder = {
        id: ++lastOrderId,
        deliverTo: deliverTo,
        mobileNumber: mobileNumber,
        status: status,
        dishes: dishes,
    };
    orders.push(newOrder);
    res.status(201).json({data: newOrder });
}

function update(req, res) {
    const { orderId } = req.params;
    const foundOrder = orders.find((order) => order.id === Number(orderId));
    const { data: { deliverTo, mobileNumber, status, dishes } = {} } = req.body;

    foundOrder.deliverTo = deliverTo;
    foundOrder.mobileNumber = mobileNumber;
    foundOrder.status = status;
    foundOrder.dishes = dishes;

    res.json({ data: foundOrder });
}

function destroy(req, res) {
    const { orderId } = req.params;
    const index = orders.findIndex((order) => order.id === Number(orderId));
    const deletedOrders = orders.splice(index, 1);
    res.sendStatus(204);
}




module.exports = {
    list,
    delete: [orderExists, destroy],
    create: [deliverToExists, mobileNumberExists, statusExists, dishesExists, create],
    read: [orderExists, read],
    update: [orderExists, dishIdMatchesBody, deliverToExists, mobileNumberExists, statusExists, dishesExists, update],
}