const Course = (props) => {

    const totalExcercises = props.course.parts.reduce((sum, part) => sum + part.exercises, 0);

    return (
      <div>
        <h1>{props.course.name}</h1>
        <ul>
        {props.course.parts.map(part => (
          <li key={part.id}>
            {part.name} {part.exercises}
          </li>
        ))}
        </ul>
        <div> total of {totalExcercises} excercises

        </div>
      </div>
    )
  }
  
  export default Course