import { useState } from 'react'

const Button = (props) => {
  return(
    <button onClick = {props.onClick}>
      {props.text}
    </button>
  )
}

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
    'The only way to go fast, is to go well.'
  ]
   
  const [selected, setSelected] = useState(0)
  const [votes, setVotes] = useState(Array(anecdotes.length).fill(0)) //votes is an empty array

  const nextAnecdote = () => {
    const randomIndex = Math.floor(Math.random() * anecdotes.length) //next anecdote is randomly selected
    setSelected(randomIndex)
  }

  const voteAnecdote = () => {
    const newVotes = [...votes] //creating a copy of votes array, can't manipulate votes directly
    newVotes[selected] += 1 //update existing votes value using index of random selection
    setVotes(newVotes) //setting the copied and updated array to votes
  }

  return (
    <div>
      <h1>Anecdote of the day</h1>
      <div>{anecdotes[selected]}</div>
      <div>has {votes[selected]} votes </div>
      <div>
        <Button onClick={voteAnecdote} text='vote'/>
        <Button onClick={nextAnecdote} text='next anecdote'/>
      </div>
      <h1>Anecdote with most votes</h1>
      <div>{anecdotes[votes.indexOf(Math.max(...votes))]}</div>
      <div>has {Math.max(...votes)} votes </div>
    </div>
  )
}

export default App