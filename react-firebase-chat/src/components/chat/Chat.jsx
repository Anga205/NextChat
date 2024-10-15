import EmojiPicker from "emoji-picker-react"
import "./Chat.css"
import { useEffect, useRef, useState } from "react"

const Chat = () => {

  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const endRef = useRef(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
}, []);


  const handleEmoji = (e) => {
    setText((prev) => prev + e.emoji);
    setOpen(false);
};

  return (
    <div className="chat">
      <div className="top">
        <div className="user">
          <img src="./avatar.png" alt=""/>
          <div className="texts">
            <span>Ankith</span>
            <p>Lorem ipsum</p>
          </div>
        </div>
        <div className="icons">
          <img src="./phone.png" alt="" />
          <img src="./video.png" alt="" />
          <img src="./info.png" alt="" />
        </div>
      </div>
      <div className="center">
        <div className="message">
          <img src="./avatar.png" alt="" />
          <div className="texts">
            <p>Lorem ipsum Lorem ipsum, dolor sit amet consectetur adipisicing elit. Labore repellendus enim sunt odio eaque recusandae quod ex soluta! At debitis sequi fugit optio veniam illum distinctio libero architecto nulla neque.</p>
            <span>One min</span>
          </div>
        </div>
        <div className="message own">
          <img src="./avatar.png" alt="" />
          <div className="texts">
            <p>Lorem ipsum Lorem ipsum, dolor sit amet consectetur adipisicing elit. Labore repellendus enim sunt odio eaque recusandae quod ex soluta! At debitis sequi fugit optio veniam illum distinctio libero architecto nulla neque.</p>
            <span>One min</span>
          </div>
        </div>
        <div className="message">
          <img src="./avatar.png" alt="" />
          <div className="texts">
            <p>Lorem ipsum Lorem ipsum, dolor sit amet consectetur adipisicing elit. Labore repellendus enim sunt odio eaque recusandae quod ex soluta! At debitis sequi fugit optio veniam illum distinctio libero architecto nulla neque.</p>
            <span>One min</span>
          </div>
        </div>
        <div className="message own">
          <img src="./avatar.png" alt="" />
          <div className="texts">
            <img src="https://m.media-amazon.com/images/I/81vxWpPpgNL._AC_SF226,226_QL85_.jpg?aicid=discounts-widgets-horizonte 1x,
                https://m.media-amazon.com/images/I/81vxWpPpgNL._AC_FMavif_SF339,339_QL58_.jpg?aicid=discounts-widgets-horizonte 1.5x,
                https://m.media-amazon.com/images/I/81vxWpPpgNL._AC_FMavif_SF452,452_QL58_.jpg?aicid=discounts-widgets-horizonte 2x" alt="" />
            <p>Lorem ipsum Lorem ipsum, dolor sit amet consectetur adipisicing elit. Labore repellendus enim sunt odio eaque recusandae quod ex soluta! At debitis sequi fugit optio veniam illum distinctio libero architecto nulla neque.</p>
            <span>One min</span>
          </div>
        </div>
        <div ref={endRef}></div>
      </div>
      <div className="bottom">
        <div className="icons">
          <img src="./img.png" alt="" />
          <img src="./camera.png" alt="" />
          <img src="./mic.png" alt="" />
        </div>
        <input type="text" placeholder="Type a message..." onChange={e=>setText(e.target.value)}/>
        <div className="emoji">
          <img src="./emoji.png" alt="" onClick={() => setOpen((prev)=>!prev)}/>
          <div className="picker">
          <EmojiPicker open={open} onEmojiClick={handleEmoji}/>
          </div>
        </div>
        <button className="sendButton">Send</button>
      </div>
    </div>
  )
}

export default Chat
