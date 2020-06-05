import express from "express";
import multer from "multer";
import multerConfig from "./config/multer";
import { celebrate, Joi } from "celebrate";

import PointsController from "./controllers/PointsController";
import ItemsController from "./controllers/ItemsController";

const pointsController = new PointsController();
const itemsController = new ItemsController();

const Routes = express.Router();
const upload = multer(multerConfig);

Routes.get("/items", itemsController.index);

Routes.get("/points/:id", pointsController.show);
Routes.get("/points", pointsController.index);

Routes.post(
  "/points",
  upload.single("image"),
  celebrate(
    {
      body: Joi.object().keys({
        name: Joi.string().required(),
        email: Joi.string().required().email(),
        whatsapp: Joi.number().required(),
        latitude: Joi.number().required(),
        longitude: Joi.number().required(),
        city: Joi.string().required(),
        uf: Joi.string().required().max(2),
        items: Joi.string().required(),
      }),
    },
    {
      abortEarly: false,
    }
  ),
  pointsController.create
);

export default Routes;
