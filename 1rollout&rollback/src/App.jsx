import { useState } from 'react'

import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <p>this is a react app to check k8s deployments with vite</p>
      <p> this is version 2 image for checking Rollouts</p>
      <button className='button' onClick={()=>{setCount(count+1)}} >{count}</button>
    </>
  )
}

export default App


// create image push to docker hub 
// create deployment 
// create expose service 