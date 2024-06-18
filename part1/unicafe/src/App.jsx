import { useState } from 'react'

const Header = (props) => {
  return(
    <h1>{props.header}</h1>
  )
}

const Button = (props) => {
  return(
    <button onClick={props.onClick}>
      {props.text}
    </button>
  )
}

const Statistics = (props) => {
  if (props.all == 0){
    return (
      <p>No feedback given</p>
    )
  }
  return(
  <table>
    <tbody>
      <tr>
        <td>{props.title1}</td>
        <td>{props.value1}</td>
      </tr>
      <tr>
        <td>{props.title2}</td>
        <td>{props.value2}</td>
      </tr>
      <tr>
        <td>{props.title3}</td>
        <td>{props.value3}</td>
      </tr>
      <tr>
        <td>{props.title4}</td>
        <td>{props.value4}</td>
      </tr>
      <tr>
        <td>{props.title5}</td>
        <td>{props.value5}</td>
      </tr>
      <tr>
        <td>{props.title6}</td>
        <td>{props.value6}</td>
      </tr>
    </tbody>
  </table>
  )
}

const App = () => {
  // header
  const feedbackHeader = "give feedback"
  const statsHeader = "statistics"
  // title
  const goodTitle = "good"
  const neutralTitle = "neutral"
  const badTitle = "bad"
  const allTitle = "all"
  const averageTitle = "average"
  const positiveTitle = "positive"
  // state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  const [all, setAll] = useState(0)
  const [average, setAverage] = useState(0)

  //functions
  const increaseGood = () => {
    setGood(good + 1)
    setAverage(average + 1)
    setAll(all + 1)
  }

  const increaseNeutral = () => {
    setNeutral(neutral + 1)
    setAverage(average + 0)
    setAll(all + 1)
  }

  const increaseBad = () => {
    setBad(bad + 1)
    setAverage(average - 1)
    setAll(all + 1)
  }

  return (
    <div>
      <Header header = {feedbackHeader}/>
      <Button onClick={increaseGood} text='good'/>
      <Button onClick={increaseNeutral} text='neutral'/>
      <Button onClick={increaseBad} text='bad'/>
      <Header header = {statsHeader}/>
      <Statistics
        all ={all}
        title1={goodTitle} value1={good}
        title2={neutralTitle} value2={neutral}
        title3={badTitle} value3={bad}
        title4={allTitle} value4={all}
        title5={averageTitle} value5={all === 0 ? 0 : (average / all)}
        title6={positiveTitle} value6={all === 0 ? "0 %" : ((good / all) * 100 + " %")}/>
    </div>
  ) 
}

export default App