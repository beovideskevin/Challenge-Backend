const fastify = require("fastify")({ logger: true });
const listenMock = require("../mock-server");
const fetchWithRetry = require("../utils/fetchWithRetry");

fastify.get("/getUsers", async (request, reply) => {
  const resp = await fetch("http://event.com/getUsers");
  const data = await resp.json();
  reply.send(data);
});

fastify.post("/addEvent", async (request, reply) => {
  try {
    const data = await fetchWithRetry(
      "http://event.com/addEvent",
      JSON.stringify({
        id: new Date().getTime(),
        ...request.body,
      }),
    );
    reply.send(data);
  } catch (err) {
    reply.code(503).send(err);
  }
});

fastify.get("/getEvents", async (request, reply) => {
  const resp = await fetch("http://event.com/getEvents");
  const data = await resp.json();
  reply.send(data);
});

fastify.get("/getEventsByUserId/:id", async (request, reply) => {
  const { id } = request.params;
  const user = await fetch("http://event.com/getUserById/" + id);
  const userData = await user.json();
  const userEvents = userData.events;
  const serverCall = [];

  for (let i = 0; i < userEvents.length; i++) {
    serverCall.push(
      fetch("http://event.com/getEventById/" + userEvents[i]).then((event) =>
        event.json(),
      ),
    );
  }

  const eventArray = await Promise.all(serverCall);

  reply.send(eventArray);
});

fastify.listen({ port: 3000 }, (err) => {
  listenMock();
  if (err) {
    fastify.log.error(err);
    process.exit();
  }
});
