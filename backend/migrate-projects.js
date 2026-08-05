import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const runMigration = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');
        
        const db = mongoose.connection.db;
        const projectsCollection = db.collection('projects');
        
        const projectsToMigrate = await projectsCollection.find({
            $or: [
                { collaborators: { $exists: false } },
                { collaborators: { $size: 0 } }
            ],
            users: { $exists: true, $not: { $size: 0 } }
        }).toArray();

        console.log(`Found ${projectsToMigrate.length} projects to migrate.`);

        for (let project of projectsToMigrate) {
            const collaborators = project.users.map(userId => ({
                user: userId,
                role: 'Owner'
            }));

            await projectsCollection.updateOne(
                { _id: project._id },
                { 
                    $set: { collaborators: collaborators },
                    $unset: { users: "" }
                }
            );
            console.log(`Migrated project: ${project.name}`);
        }

        console.log('Migration complete!');
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

runMigration();
