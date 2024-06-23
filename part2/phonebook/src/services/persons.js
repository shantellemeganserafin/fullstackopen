import axios from 'axios'
const baseUrl = 'http://localhost:3001/persons'

const getAll = () => {
    const request = axios.get(baseUrl)
    return request.then(response => response.data)
}

const create = newObject => {
    const request = axios.post(baseUrl, newObject)
    return request.then(response => response.data)
}

const deleteName = (id) => {
    const url = `http://localhost:3001/persons/${id}`;
    return axios.delete(url)
}

const updateNumber = (existingPersonID, updatedPerson) => {
    return axios.put(`http://localhost:3001/persons/${existingPersonID}`, updatedPerson)
}

export default { getAll, create, deleteName, updateNumber}