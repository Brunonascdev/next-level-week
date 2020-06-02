import express from "express";

import PointsController from "./controllers/PointsController";
import ItemsController from "./controllers/ItemsController";

const pointsController = new PointsController();
const itemsController = new ItemsController();

const Routes = express.Router();

Routes.get("/items", itemsController.index);

Routes.post("/points", pointsController.create);
Routes.get("/points/:id", pointsController.show);
Routes.get("/points", pointsController.index);

export default Routes;
