const Persons = (props) => {
    return(
      <ul>
        {props.personsToShow.map((person) => (
          <li key = {person.id}>
            {person.name} {person.number}
            <button onClick={() => props.deleteName(person.id)}>delete</button>
          </li>
        ))}
      </ul>
    )
}

export default Persons