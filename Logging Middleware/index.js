// If you're on Node.js v18+, fetch is built-in; otherwise, uncomment the next line:
// import fetch from "node-fetch";
import { Log } from "./logger.js";

async function getToken() {
  const res = await fetch("http://20.244.56.144/evaluation-service/auth", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: "joshisagar0596@gmail.com",
      name: "Sagar Joshi",
      rollNo: "2261498",
      accessCode: "QAhDUr",
      clientID: "ae7a712c-c4a7-4102-a7fc-6aec8b917f0b",             // from registration response
      clientSecret: "YfVqxxkFFrPhjCdm"      // from registration response
    })
  });

//   const data = await res.json();
//   return data.access_token;

 const data = await res.json();

  // Log the entire response to see the token
  console.log(" Full Token Response:", data);

  if (data.access_token) {
    console.log(" Access Token:", data.access_token);
    return data.access_token;
  } else {
    console.error(" Failed to retrieve access token. Response was:");
    console.log(data);
    return null;
  }
}


// Optional: Registration function (run once if needed)
// async function register() {
//   const res = await fetch("http://20.244.56.144/evaluation-service/register", {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({
//       email: "joshisagar0596@gmail.com",
//       name: "Sagar Joshi",
//       mobileNo: "8218019943",
//       githubUsername: "Sagar10joshi",
//       rollNo: "2261498",
//       accessCode: "QAhDUr"
//     })
//   });

//   const data = await res.json();
//   console.log("Registration data:", data);
// }

// register(); // Uncomment to run registration

// Main execution
(async () => {
  const token = await getToken();

  // Example of logging an error
  await Log("backend", "error", "handler", "received string, expected bool", token);

  // Example of logging a DB failure
  await Log("backend", "fatal", "db", "Critical database connection failure.", token);
})();
