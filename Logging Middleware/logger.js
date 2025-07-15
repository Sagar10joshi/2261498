
export async function Log(stack, level, packageName, message, token) {
  const response = await fetch("http://20.244.56.144/evaluation-service/logs", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({
      stack: stack.toLowerCase(),
      level: level.toLowerCase(),
      package: packageName.toLowerCase(),
      message
    })
  });

  const data = await response.json();
  console.log("Log response:", data);
}
// export {Log}