import { Router } from "express";
import { verifyMessage } from "viem";
import authPublisher from "../../middleware/authPublisher";
import Assignments from "../../models/assignments";
import Users from "../../models/users";

const router = Router();

router.post("/accept", authPublisher, async (req, res) => {
	try {
		if (!req.publisher) {
			return res.status(401).json({ message: "Only publishers can accept assignments." });
		}

		const exists = await Assignments.findOne({
			map: req.body.map,
			finished: false,
			congregation: req.publisher?.congregation,
		});

		if (exists) {
			return res.status(400).json({ message: "Map already assigned." });
		}

		const user = await Users.findById(req.body.user);

		if (!user) {
			return res.status(400).json({ message: "Invalid user assignment." });
		}

		const valid = await verifyMessage({
			address: user.address as `0x${string}`,
			message: JSON.stringify({ map: req.body.map, user: user._id, expiration: req.body.expiration }),
			signature: req.body.signature,
		});

		if (!valid) {
			return res.status(400).json({ message: "Invalid assignment." });
		}

		const current = new Date(Date.now()).toUTCString();
		const expiration = new Date(req.body.expiration).toUTCString();

		if (current > expiration) {
			return res.status(400).json({ message: "Expired assignment." });
		}

		const assignment = await new Assignments({
			publisher: req.publisher._id,
			map: req.body.map,
			permanent: false,
			congregation: req.publisher?.congregation,
		}).save();

		res.status(201).json({ assignment: assignment._id });
	} catch (error) {
		res.status(500).json({ message: "Error to create a assignment." });
	}
});

export default router;
