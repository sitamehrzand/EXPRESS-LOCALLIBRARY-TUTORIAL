// test-connection.js
const mongoose = require('mongoose');

const connectionString = 'mongodb+srv://setayeshmehrzand_db_user:Sita13381332@cluster0.wsfjxvn.mongodb.net/local_library?retryWrites=true&w=majority&appName=Cluster0';

async function testConnection() {
    try {
        console.log('Attempting to connect to MongoDB...');

        await mongoose.connect(connectionString, {
            serverSelectionTimeoutMS: 5000, // 5 second timeout
        });

        console.log('✅ MongoDB connected successfully!');

        // Check if connection is ready
        console.log('Connection state:', mongoose.connection.readyState);
        // 1 = connected, 2 = connecting, 3 = disconnecting, 0 = disconnected

        // List databases (if permissions allow)
        const adminDb = mongoose.connection.db.admin();
        const databases = await adminDb.listDatabases();
        console.log('Available databases:', databases.databases.map(db => db.name));

        await mongoose.connection.close();
        console.log('Connection closed.');

    } catch (error) {
        console.error('❌ Connection failed:', error.message);
    }
}

testConnection();