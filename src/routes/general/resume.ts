import { Router } from "express";
import { FilterQuery } from "mongoose";
import authUser from "../../middleware/authUser";
import Assignments from "../../models/assignments";
import Cities from "../../models/cities";
import Maps from "../../models/maps";
import Publishers from "../../models/publishers";
import Users from "../../models/users";

const router = Router();

router.get("/resume", authUser, async (req, res) => {
	try {
		const query: FilterQuery<any> = req.isMaster ? {} : { congregation: req.user?.congregation };

		const publishers = await Publishers.count(query);
		const maps = await Maps.count(query);
		const assignments = await Assignments.count({ ...query, finished: false });
		const cities = await Cities.count(query);
		const users = await Users.count(query);

		res.json({ publishers, maps, assignments, cities, users });
	} catch (error) {
		res.status(500).json({ message: "Error to authenticate user" });
	}
});

export default router;
