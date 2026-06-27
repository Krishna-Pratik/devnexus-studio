// Loads environment variables before any other module reads them.
//
// In ESM, all `import` statements are hoisted and executed before the
// importing module's body runs. Modules such as authController capture
// env values at module-load time (e.g. `const googleClientId =
// process.env.GOOGLE_CLIENT_ID`). If `dotenv.config()` lived in the body
// of server.js it would run *after* those imports, leaving the captured
// values undefined. Importing this file first guarantees dotenv runs
// before any env-reading module is evaluated.
import dotenv from 'dotenv';

dotenv.config();
