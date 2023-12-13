import { Express } from 'express';
import authUser from '../middleware/authUser';
import master from '../middleware/master';
import Cities from '../models/cities';

export default (app: Express) => {

	app.post('/cities', authUser, async (req, res) => {
		try {
			const { name, congregation } = req.body;

			const city = await new Cities({ name, congregation: req.user?.congregation || congregation }).save();

			res.status(201).json({ city: city._id });
		} catch (error) {
			res.status(500).json({ message: 'Error to create a city.' });
		}
	});

	app.get('/cities', authUser, async (req, res) => {
		try {
			const { skip = 0, limit = 10 } = req.query;
			const query = req.isMaster ? {} : { congregation: req.user?.congregation };

			const cities = await Cities.find(query).skip(Number(skip)).limit(Number(limit));

			res.json({ cities, skip, limit });
		} catch (error) {
			res.status(500).json({ message: 'Error to list cities.' });
		}
	});

	app.get('/cities/:id', authUser, async (req, res) => {
		try {
			const city = await Cities.findById(req.params.id);
			if (!city) {
				return res.status(404).json({ message: 'City not found.' });
			}
			res.json({ city });
		} catch (error) {
			res.status(500).json({ message: 'Error to get city.' });
		}
	});

	app.put('/cities/:id', authUser, async (req, res) => {
		try {
			const query = req.isMaster ? { _id: req.params.id } : { _id: req.params.id, congregation: req.user?.congregation };

			const city = await Cities.findOneAndUpdate(
				query,
				{
					...req.body,
					congregation: req.isMaster ? req.body.congregation : req.user?.congregation
				},
				{ new: true }
			);

			if (!city) {
				return res.status(404).json({ message: 'City not found.' });
			}

			res.json({ city: city._id });
		} catch (error) {
			res.status(500).json({ message: 'Error to update city.' });
		}
	});

	app.delete('/cities/:id', master, async (req, res) => {
		try {
			const city = await Cities.findByIdAndDelete(req.params.id);

			if (!city) {
				return res.status(404).json({ message: 'City not found.' });
			}

			res.json({ message: 'City deleted successfully' });
		} catch (error) {
			res.status(500).json({ message: 'Error to delete city.' });
		}
	});
}