import { Express } from 'express';
import authPublisher from '../middleware/authPublisher';
import authUser from '../middleware/authUser';
import Assignments from '../models/assignments';
import Maps from '../models/maps';

export default (app: Express) => {

	app.post('/assignments', authUser, async (req, res) => {
		try {
			const { congregation } = req.body;

			const assignment = await new Assignments({
				...req.body,
				congregation: req.user?.congregation || congregation,
			}).save();

			res.status(201).json({ assignment: assignment._id });
		} catch (error) {
			res.status(500).json({ message: 'Error to create a assignment.' });
		}
	});

	app.get('/assignments', authUser, async (req, res) => {
		try {
			const { skip = 0, limit = 10 } = req.query;
			const query = req.isMaster ? {} : { congregation: req.user?.congregation }

			const assignments = await Assignments
				.find(query)
				.populate('publisher', 'map')
				.skip(Number(skip))
				.limit(Number(limit));

			res.json({ assignments, skip, limit });
		} catch (error) {
			res.status(500).json({ message: 'Error to list assignments.' });
		}
	});

	app.get('/assignments/my', authPublisher, async (req, res) => {
		try {
			const { skip = 0, limit = 10 } = req.query;

			const assignments = await Assignments
				.find({ publisher: req.publisher?._id, finished: false })
				.populate('map')
				.skip(Number(skip))
				.limit(Number(limit));

			res.json({ assignments, skip, limit });
		} catch (error) {
			res.status(500).json({ message: 'Error to list assignments.' });
		}
	});

	app.get('/assignments/my/history', authPublisher, async (req, res) => {
		try {
			const { skip = 0, limit = 10 } = req.query;

			const assignments = await Assignments
				.find({ publisher: req.publisher?._id, finished: true })
				.populate('map')
				.skip(Number(skip))
				.limit(Number(limit));

			res.json({ assignments, skip, limit });
		} catch (error) {
			res.status(500).json({ message: 'Error to list assignments.' });
		}
	});

	app.get('/assignments/:id', async (req, res) => {
		try {
			const assignment = await Assignments
				.findById(req.params.id)
				.populate('map', 'publisher');

			if (!assignment) {
				return res.status(404).json({ message: 'Assignment not found.' });
			}
			res.json({ assignment });
		} catch (error) {
			res.status(500).json({ message: 'Error to get assignment.' });
		}
	});

	app.put('/assignments/:id/finish', authPublisher, async (req, res) => {
		try {

			const assignment = await Assignments.findOneAndUpdate(
				{ _id: req.params.id, publisher: req.publisher?._id, finished: false },
				{
					found: req.body.found,
					details: req.body.details,
					finished: true
				},
				{ new: true }
			);

			if (!assignment) {
				return res.status(404).json({ message: 'Assignment not found.' });
			}

			await Maps.findByIdAndUpdate(assignment?.map, {
				last_visited: Date.now(),
				last_visited_by: assignment?.publisher
			});

			res.json({ assignment: assignment._id });
		} catch (error) {
			res.status(500).json({ message: 'Error to update assignment.' });
		}
	});

	app.put('/assignments/:id', authUser, async (req, res) => {
		try {
			const query = req.isMaster ? { _id: req.params.id } : { _id: req.params.id, congregation: req.user?.congregation }

			const assignment = await Assignments.findOneAndUpdate(
				query,
				{
					...req.body,
					congregation: req.isMaster ? req.body.congregation : req.user?.congregation
				},
				{ new: true }
			);

			if (!assignment) {
				return res.status(404).json({ message: 'Assignment not found.' });
			}

			res.json({ assignment: assignment._id });
		} catch (error) {
			res.status(500).json({ message: 'Error to update assignment.' });
		}
	});

	app.delete('/assignments/:id', authUser, async (req, res) => {
		try {
			const query = req.isMaster ? { _id: req.params.id } : { _id: req.params.id, congregation: req.user?.congregation }

			const assignment = await Assignments.findOneAndDelete(query);

			if (!assignment) {
				return res.status(404).json({ message: 'Assignment not found.' });
			}

			res.json({ message: 'Assignment deleted successfully' });
		} catch (error) {
			res.status(500).json({ message: 'Error to delete assignment.' });
		}
	});
}