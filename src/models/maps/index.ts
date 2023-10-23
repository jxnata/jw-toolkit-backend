import mongoose, { Schema } from 'mongoose'
import IMap from './types'

const MapSchema = new Schema<IMap>({
	name: {
		type: String,
		required: true,
	},
	address: {
		street: {
			type: String,
			required: true,
		},
		number: {
			type: String,
			required: true,
		},
		district: {
			type: String,
		},
		city: {
			type: String,
			required: true,
		},
	},
	coordinates: {
		type: [Number, Number],
		required: true,
	},
	congregation: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Congregation',
		required: true,
	},
	last_visited: {
		type: Date,
	},
	created_at: {
		type: Date,
		default: Date.now,
	},
})

const model = mongoose.model<IMap>('Map', MapSchema, 'maps')

export default model
