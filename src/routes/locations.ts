import { Router } from "express";
import PickupLocation from "../models/PickupLocation";

const router = Router();

router.get("/", async (_req, res) => {
  const locs = await PickupLocation.findAll({ order: [["id", "ASC"]] });
  return res.json(locs);
});

export default router;