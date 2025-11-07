import dotenv from 'dotenv';

import app from './app.js';
import { connectDatabase } from './config/database.js';

dotenv.config();

const PORT = Number(process.env.PORT) || 4000;

const startServer = async () => {
	try {
		await connectDatabase();
		app.listen(PORT, () => {
			console.log(`Server is running on port ${PORT}`);
		});
	} catch (error) {
		console.error('Failed to start server:', error.message);
		process.exit(1);
	}
};

startServer();

process.on('unhandledRejection', (reason) => {
	console.error('Unhandled Rejection:', reason);
});

process.on('uncaughtException', (error) => {
	console.error('Uncaught Exception:', error);
});
