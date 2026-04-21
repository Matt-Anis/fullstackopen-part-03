import { useState, useEffect } from "react";
import Filter from "./Filter";
import PersonForm from "./PersonForm";
import Person from "./Person";
import contactService from "../services/contacts";
import Notification from "./Notification";

const PhoneBook = () => {
  const [persons, setPersons] = useState([]);
  const [notification, setNotification] = useState({
    message: null,
    isError: false,
  });

  useEffect(() => {
    console.log("fetching persons from the json-server");

    contactService
      .getAll()
      .then((returnedContacts) => setPersons(returnedContacts));
  }, []);

  const handleContactDelete = (person) => {
    if (window.confirm(`Delete ${person.name} ?`)) {
      contactService
        .deleteContact(person.id)
        .then(() =>
          setPersons(
            persons.filter(
              (currentPerson) => !(currentPerson.id === person.id),
            ),
          ),
        )
        .then(() => {
          setNotification({
            message: `${person.name} was deleted`,
          });
          setTimeout(() => {
            setNotification(null);
          }, 5000);
        });
    }
  };

  const [filter, setFilter] = useState("");
  const filteredPersons =
    filter === ""
      ? persons
      : persons.filter((p) =>
          p.name.toLowerCase().includes(filter.toLowerCase()),
        );

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification notification={notification} />
      <Filter filter={filter} setFilter={setFilter} />
      <PersonForm
        persons={persons}
        setPersons={setPersons}
        setNotification={setNotification}
      />

      <h2>Numbers</h2>
      {filteredPersons.map((person) => (
        <Person
          key={person.id}
          person={person}
          handleDelete={handleContactDelete}
        />
      ))}
    </div>
  );
};

export default PhoneBook;
