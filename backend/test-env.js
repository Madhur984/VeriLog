const dotenv = require('dotenv');
const result = dotenv.config();
console.log('Result:', result);
console.log('SUPABASE_URL:', process.env.SUPABASE_URL);
