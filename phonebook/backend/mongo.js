const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log("give password as argument");
  process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://admin:${password}@notesdb.ntx0c91.mongodb.net/noteApp?retryWrites=true&w=majority&appName=NotesDB`;

mongoose.set("strictQuery", false);
const contactSchema = new mongoose.Schema({
  name: String,
  number: String,
});
const Contact = mongoose.model("Contact", contactSchema);

mongoose.connect(url, { family: 4 }).then(() => {
  if (process.argv.length === 5) {
    const contact = new Contact({
      name: process.argv[3],
      number: process.argv[4],
    });

    contact.save().then((result) => {
      console.log("contact saved!");
      mongoose.connection.close();
    });
  } else {
    Contact.find({}).then((result) => {
        console.log("phonebook:");
        
      result.forEach((contact) => {
        console.log(contact.name, contact.number);
      });
      mongoose.connection.close();
    });
  }
});
