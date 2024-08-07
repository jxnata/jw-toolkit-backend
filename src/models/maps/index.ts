import mongoose, { Schema } from "mongoose";
import IMap from "./types";

const MapSchema = new Schema<IMap>({
	name: {
		type: String,
		required: true,
	},
	address: {
		type: String,
		required: true,
	},
	details: {
		type: String,
		required: false,
	},
	city: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "City",
		required: true,
	},
	district: {
		type: String,
		required: false,
		default: "",
		trim: true,
	},
	coordinates: {
		type: [Number, Number],
		required: true,
	},
	congregation: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Congregation",
		required: true,
	},
	assigned: {
		type: Boolean,
		default: false,
		required: true,
	},
	last_visited: {
		type: Date,
	},
	last_visited_by: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Publisher",
	},
	created_at: {
		type: Date,
		default: Date.now,
	},
	updated_at: {
		type: Number,
		default: Date.now,
	},
});

const Maps = mongoose.model<IMap>("Map", MapSchema, "maps");

export default Maps;
