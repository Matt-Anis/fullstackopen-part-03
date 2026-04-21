import { useState } from "react";
import contactService from "../services/contacts";
import Notification from "./Notification";

const PersonForm = ({ persons, setPersons, setNotification }) => {
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");

  const compareNames = (name1, name2) => {
    return name1.toLowerCase() === name2.toLowerCase();
  };

  const addNewPerson = (event) => {
    event.preventDefault();
    const personObject = {
      name: newName,
      number: newNumber,
    };

    const oldPerson = persons.find((person) =>
      compareNames(person.name, newName),
    );
    if (oldPerson !== undefined) {
      if (
        window.confirm(
          `"${newName}" already exists, replace the new phone number?`,
        )
      ) {
        contactService
          .updatePhoneNumber(oldPerson.id, personObject)
          .then(() =>
            contactService.getAll().then((contacts) => setPersons(contacts)),
          )
          .catch((error) => {
            setNotification( {
              message: `Information of ${oldPerson.name} has already been removed from server`,
              isError: true
            });
            contactService.getAll().then((contacts) => setPersons(contacts))
            setTimeout(() => {
              setNotification(null);
            }, 5000);
          });
      }
    } else {
      setNotification({
        message: `Added ${newName}`,
        isError: false
      });
      setTimeout(() => {
        setNotification(null);
      }, 5000);
      contactService.createContact(personObject).then((newPerson) => {
        setPersons(persons.concat(newPerson));
        setNewName("");
        setNewNumber("");
      })
      .catch( error => {
        setNotification( {
          message: `error adding ${newName}: ${error.response.data.error}`,
          isError: true
        });
        setTimeout(() => {
          setNotification(null);
        }, 5000);
      })
    }
  };

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  };

  return (
    <form onSubmit={addNewPerson}>
      <h2>Add a new person</h2>
      <div>
        name: <input value={newName} onChange={handleNameChange} />
      </div>
      <div>
        number: <input value={newNumber} onChange={handleNumberChange} />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  );
};

export default PersonForm;
