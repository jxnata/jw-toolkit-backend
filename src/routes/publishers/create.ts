import { Router } from "express";
import { authorization } from "../../helpers/authorization";
import authUser from "../../middleware/authUser";
import Publishers from "../../models/publishers";

const router = Router();

router.post("/", authUser, async (req, res) => {
	try {
		const code = authorization();

		const publisher = await new Publishers({
			...req.body,
			congregation: req.user?.congregation || req.body?.congregation,
			passcode: code,
		}).save();

		res.status(201).json({ publisher: publisher._id, passcode: code });
	} catch (error) {
		res.status(500).json({ message: "Error to create a publisher." });
	}
});

export default router;
