import app from './app.js';
import { testTransporter } from './controllers/auth.controllers.js';

const PORT = process.env.PORT || 3000;

await testTransporter();

app.get('/', (req, res) => {
    res.send('Hello, World!');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
