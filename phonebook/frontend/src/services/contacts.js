import axios from 'axios'
const baseUrl = '/api/persons'

const createContact = newContactObject => {
    const response = axios.post(baseUrl, newContactObject)    
    return response.then(response => response.data)
}

const updatePhoneNumber = (id, newContactObject) => {
    const response = axios.put(`${baseUrl}/${id}`, newContactObject)

    return response.then(response => response.data)
}

const getAll = () => {
    const response = axios.get(baseUrl)
    console.log(response.data);
    
    return response.then(response => response.data)
}

const deleteContact = id => {
    return axios.delete(`${baseUrl}/${id}`)
}

export default {createContact, getAll, deleteContact, updatePhoneNumber}