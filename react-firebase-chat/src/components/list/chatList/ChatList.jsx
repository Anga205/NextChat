import { useState } from 'react'
import './chatList.css'

const chatList = () => {
  const [addMode, setAddMode] = useState(false)
  return (
    <div className='chatList'>
      <div className="search">
        <div className="searchBar">
          <img src='./search.png' alt=''/>
          <input type='text' placeholder='Search'/>
        </div>
        <img src={addMode ? './minus.png' :'./plus.png'} 
        alt='' 
        className='add'
        onClick={() => setAddMode((prev) => !prev)}/>
      </div>
      <div className="item">
        <img src="./avatar.png" alt="" />
        <div className="texts">
          <span>Suryaprasad</span>
          <p>Hello</p>
        </div>
      </div>
      <div className="item">
        <img src="./avatar.png" alt="" />
        <div className="texts">
          <span>M R Doreswamy</span>
          <p>Hello</p>
        </div>
      </div>
      <div className="item">
        <img src="./avatar.png" alt="" />
        <div className="texts">
          <span>Jawahar D</span>
          <p>Hello</p>
        </div>
      </div>
      
    </div>
  )
}

export default chatList;
