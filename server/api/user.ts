import { defineEventHandler, readBody } from "h3";
import { User } from "~/type/user";

let users: User[] = [
  { id: 1, name: "John Doe", email: "john@example.com" },
  { id: 2, name: "Jane Doe", email: "jane@example.com" },
];

// Handle GET, POST requests
export default defineEventHandler(async (event) => {
  const method = event.node.req.method;

  if (method === "GET") {
    return users;
  }

  if (method === "POST") {
    const newUser = await readBody<User>(event);
    newUser.id = users.length + 1;
    users.push(newUser);
    return newUser;
  }
});
