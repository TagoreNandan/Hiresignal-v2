import { Router, Request, Response } from 'express';
import { Note } from '../models/Note';

const router = Router();


//upsert - update or insert note

router.post('/', async (req: Request, res: Response) => {
    try {
        const { applicationId, companyName, researchNotes, techStack, culture, salaryInfo, interviewPrep, contacts, tags, notedata } = req.body;

        const note = await Note.findOneAndUpdate(
            { applicationId },
            { companyName, researchNotes, techStack, culture, salaryInfo, interviewPrep, contacts, tags, notedata },
            { new: true, upsert: true }
        );

        res.status(201).json(note);
    } catch (error) {
        res.status(500).json({ message: 'Failed to save note', error });
    }
});

//get note for specific app ID

router.get('/:applicationId', async (req: Request, res: Response) => {
    try {
        const note = await Note.findOne({
            applicationId: parseInt(String(req.params.applicationId), 10)
        });

        if (!note)return res.status(404).json({ message: 'No notes found' });

        res.json(note);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch note', error });
    }
});

export default router;

//entire code - defines Express routes for creating/updating and fetching notes associated with job applications