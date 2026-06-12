import { Router, Request, Response } from 'express';
import { db } from '../db/postgres';
import { applications } from '../db/schema';
import { eq, sql, count} from 'drizzle-orm';

const router = Router();

//get count of apps by status for current user

router.get('/:userId', async (req: Request, res: Response) => {
    try {
        const userId = Number(req.params.userId);
        const statusCounts = await db.select({
            status: applications.status,
            count: count()
        })
        .from(applications)
        .where(eq(applications.userId, userId))
        .groupBy(applications.status);


        //count of apps grouped by source


        const sourceCounts = await db.select({
            source: applications.source,
            count: count()
        })
        .from(applications)
        .where(eq(applications.userId, userId))
        .groupBy(applications.source);

        //total count of apps



        const [{ total }] = await db.select({
            total: count()
        })
        .from(applications)
        .where(eq(applications.userId, userId));

        res.json({ statusCounts, sourceCounts, total });
    } 
    catch (error) {
        res.status(500).json({ message: 'Failed to fetch stats', error });
    }
});

export default router;