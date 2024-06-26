import bcrypt from "bcrypt";
import { Router } from "express";
import jwt from "jsonwebtoken";
import { SECRET_KEY } from "../../constants";
import Congregations from "../../models/congregations";
import Users from "../../models/users";

const router = Router();

router.post("/users", async (req, res) => {
	try {
		const { username, password } = req.body;
		let congregation: string = req.body.congregation;

		if (!congregation) {
			const first = await Congregations.find().limit(1).select("_id");

			if (first) {
				congregation = first[0]._id;
			}
		}

		const user = await Users.findOne({ username, congregation })
			.select(["+password", "+private_key"])
			.populate("congregation");

		if (!user) {
			return res.status(400).json({ message: "User not found." });
		}

		const passwordMatch = await bcrypt.compare(password, user.password);

		if (!passwordMatch) {
			return res.status(400).json({ message: "Wrong username or password." });
		}

		const userWithoutSecrets = { ...user.toObject(), password: undefined, private_key: undefined };

		const token = jwt.sign({ user: userWithoutSecrets }, SECRET_KEY);

		res.json({ user: userWithoutSecrets, token, private_key: user.private_key });
	} catch (error) {
		res.status(500).json({ message: "Error to authenticate user" });
	}
});

export default router;
