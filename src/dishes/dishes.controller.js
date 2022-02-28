const path = require("path");

// Use the existing dishes data
const dishes = require(path.resolve("src/data/dishes-data"));

// Use this function to assign ID's when necessary
const nextId = require("../utils/nextId");

// TODO: Implement the /dishes handlers needed to make the tests pass

function findDish(req, res, next) {
  const { dishId } = req.params;
  const foundDish = dishes.find((dish) => dish.id === dishId);

  if (foundDish) {
    res.locals.dishId = dishId;
    res.locals.dish = foundDish;
    return next();
  }
  return next({
    status: 404,
    message: `Dish does not exist: ${dishId}`,
  });
}

function validate(req, res, next) {
  const { data: { name, description, price, image_url } = {} } = req.body;

  if (!name) {
    return next({
      status: 400,
      message: "Dish must include a name",
    });
  } else if (!description) {
    return next({
      status: 400,
      message: "Dish must include a description",
    });
  } else if (!price) {
    return next({
      status: 400,
      message: "Dish must include a price",
    });
  } else if (price <= 0 || !Number.isInteger(price)) {
    return next({
      status: 400,
      message: "Dish must have a price that is an integer greater than 0",
    });
  } else if (!image_url) {
    return next({
      status: 400,
      message: "Dish must include a image_url",
    });
  }
  return next();
}

function create(req, res) {
  const { data: { name, description, price, image_url } = {} } = req.body;

  const newDish = {
    id: { nextId },
    name: name,
    description: description,
    price: price,
    image_url: image_url,
  };
  dishes.push(newDish);
  res.status(201).json({ data: newDish });
}

function read(req, res) {
  res.json({ data: res.locals.dish });
}

function update(req, res, next) {
  const dishId = res.locals.dishId;
  const { data: { id, name, description, price, image_url } = {} } = req.body;

  if (id && dishId !== id) {
    next({
      status: 400,
      message: `Dish id does not match route id. Dish: ${id}, Route: ${dishId}`,
    });
  }
  const newDish = {
    id: dishId,
    name: name,
    description: description,
    price: price,
    image_url: image_url,
  };
  res.json({ data: newDish });
}


function list(req, res) {
res.json({ data: dishes})
}


module.exports = {
    create: [validate, create],
    read: [findDish, read],
    update: [findDish, validate, update],
    list,
}
