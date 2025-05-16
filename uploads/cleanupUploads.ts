import { promises as fs } from 'fs';
import path from 'path';
import cron from 'node-cron';

cron.schedule('0 0 * * *', async () => {
    const uploadsDir = path.join(process.cwd(), 'uploads');
    const files = await fs.readdir(uploadsDir);
    for (const file of files) {
        await fs.unlink(path.join(uploadsDir, file));
    }
    console.log('Uploads directory cleaned');
});