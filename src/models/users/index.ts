import bcrypt from "bcrypt";
import mongoose, { CallbackError, Schema } from "mongoose";
import { SALT_ROUNDS } from "../../constants";
import IUser from "./types";

const UserSchema = new Schema<IUser>({
	name: {
		type: String,
		required: true,
	},
	username: {
		type: String,
		unique: true,
		required: true,
		lowercase: true,
	},
	password: {
		type: String,
		required: true,
		select: false,
	},
	congregation: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Congregation",
		required: true,
	},
	created_at: {
		type: Date,
		default: Date.now,
	},
});

UserSchema.pre<IUser>("save", async function (next) {
	if (!this.isModified("password")) return next();

	try {
		const hashedPassword = await bcrypt.hash(this.password, SALT_ROUNDS);
		this.password = hashedPassword;
		next();
	} catch (error) {
		return next(error as CallbackError);
	}
});

const Users = mongoose.model<IUser>("User", UserSchema, "users");

export default Users;
