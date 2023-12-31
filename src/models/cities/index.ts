import mongoose, { Schema } from "mongoose";
import ICity from "./types";

const CitySchema = new Schema<ICity>({
	name: {
		type: String,
		required: true,
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

const Cities = mongoose.model<ICity>("City", CitySchema, "cities");

export default Cities;
