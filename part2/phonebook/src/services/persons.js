import axios from 'axios'
const baseUrl = '/api/persons'

/* 
axios
- interacts with a RESTful API,
- defines functions for performing various HTTP requests to manage a resource on the server,
- typically used in the frontend part of an application to communicate with the backend
 */

const getAll = () => {
    const request = axios.get(baseUrl)
    return request.then(response => response.data)
}

const create = newObject => {
    const request = axios.post(baseUrl, newObject)
    return request.then(response => response.data)
}

const deleteName = (id) => {
    const url = `${baseUrl}/${id}`;
    return axios.delete(url)
}

const updateNumber = (existingPersonID, updatedPerson) => {
    const url = `${baseUrl}/${existingPersonID}`
    return axios.put(url, updatedPerson)
}

export default { getAll, create, deleteName, updateNumber}