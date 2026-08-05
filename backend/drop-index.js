import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const run = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');
        
        const db = mongoose.connection.db;
        const projectsCollection = db.collection('projects');
        
        try {
            await projectsCollection.dropIndex('name_1');
            console.log('Dropped name_1 index successfully!');
        } catch (e) {
            console.log('Index name_1 might not exist or already dropped:', e.message);
        }

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

run();
