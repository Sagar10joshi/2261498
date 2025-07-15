This project implements a reusable logging middleware in JavaScript that logs significant application events to a test server.


Authenticates using clientID, clientSecret, and accessCode.
Retrieves and uses an access_token from the Auth API
Sends logs using a reusable Log(stack, level, package, message) function
Handles different log types like info, error, fatal, etc.
Works with valid backend packages like db, handler, controller, etc.

Clone the repo or download the folder.
Run:
npm install
npm start
Logs will be sent to the test server and response will be printed on the console.

index.js – Main file for authentication and logging.
logger.js – Contains the reusable Log() function.