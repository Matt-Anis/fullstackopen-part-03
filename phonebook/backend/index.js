require("dotenv").config();
const express = require("express");
const Contact = require("./models/contact");
const app = express();
const morgan = require("morgan");
const cors = require("cors");

app.use(
  morgan((tokens, req, res) => {
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, "content-length"),
      "-",
      tokens["response-time"](req, res),
      "ms",
      JSON.stringify(req.body),
    ].join(" ");
  }),
);
app.use(express.json());
app.use(cors());
app.use(express.static("dist"));

app.get("/api/persons", (request, response) => {
  Contact.find({}).then((contacts) => {
    response.json(contacts);
  });
});

app.get("/info", (request, response) => {
  const date = new Date();
  Contact.find({}).then((contacts) => {
    response.send(`<p>Phonebook has info for ${contacts.length} people</p>
        <p>${date}</p>`);
  });
});

app.get("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  Contact.findById(id)
    .then(contact => {
      response.json(contact)
    })
  .catch(error => {
    console.log(error)
    response.status(404).end()
  })
});

app.delete("/api/persons/:id", (request, response) => {
  const id = request.params.id.toString();
  const contact = contacts.find((contact) => contact.id === id);

  if (contact) {
    contacts = contacts.filter((contact) => contact.id !== id);
    response.status(204).end();
  } else {
    response.status(404).end();
  }
});

app.post("/api/persons", (request, response) => {
  const body = request.body;
  if (!body.name || !body.number) {
    return response.status(400).json({
      error: "missing data",
    });
  }

  Contact.findOne({ name: body.name })
    .then((existingContact) => {
      if (existingContact) {
        return response.status(400).json({
          error: "name must be unique",
        });
      }

      const contact = new Contact({
        name: body.name,
        number: body.number,
      });

      return contact.save().then((savedContact) => {
        response.json(savedContact);
      });
    })
    .catch((error) => {
      response.status(400).json({ error: error.message });
    });
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};
app.use(unknownEndpoint);

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
