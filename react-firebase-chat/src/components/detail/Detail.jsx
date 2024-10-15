import "./Detail.css"
const Detail = () => {
    return (
        <div className="detail">
            <div className="user">
                <img src="./avatar.png" alt="" />
                <h2>Ankith Khaitan</h2>
                <p>Lorem ipsum dolor </p>

            </div>
            <div className="info">
                <div className="option">
                    <div className="title">
                        <span>Chat settings</span>
                        <img src="./arrowUp.png" alt="" className="icon"/>
                    </div>
                </div>
                <div className="option">
                    <div className="title">
                        <span>Privacy and Security</span>
                        <img src="./arrowUp.png" alt="" className="icon"/>
                    </div>
                    <div className="photos">
                        <div className="photoItem">
                        <div className="photoDetail">
                        <img src="https://m.media-amazon.com/images/I/81vxWpPpgNL._AC_SF226,226_QL85_.jpg?aicid=discounts-widgets-horizonte 1x,
                https://m.media-amazon.com/images/I/81vxWpPpgNL._AC_FMavif_SF339,339_QL58_.jpg?aicid=discounts-widgets-horizonte 1.5x,
                https://m.media-amazon.com/images/I/81vxWpPpgNL._AC_FMavif_SF452,452_QL58_.jpg?aicid=discounts-widgets-horizonte 2x" alt="" />
                <span>photo this that</span>
                        </div>
                        <img src="./download.png" alt="" className="icon"/>
                        </div>
                        <div className="photoItem">
                        <div className="photoDetail">
                        <img src="https://m.media-amazon.com/images/I/81vxWpPpgNL._AC_SF226,226_QL85_.jpg?aicid=discounts-widgets-horizonte 1x,
                https://m.media-amazon.com/images/I/81vxWpPpgNL._AC_FMavif_SF339,339_QL58_.jpg?aicid=discounts-widgets-horizonte 1.5x,
                https://m.media-amazon.com/images/I/81vxWpPpgNL._AC_FMavif_SF452,452_QL58_.jpg?aicid=discounts-widgets-horizonte 2x" alt="" />
                <span>photo this that</span>
                        </div>
                        <img src="./download.png" alt="" className="icon"/>
                        </div>
                        <div className="photoItem">
                        <div className="photoDetail">
                        <img src="https://m.media-amazon.com/images/I/81vxWpPpgNL._AC_SF226,226_QL85_.jpg?aicid=discounts-widgets-horizonte 1x,
                https://m.media-amazon.com/images/I/81vxWpPpgNL._AC_FMavif_SF339,339_QL58_.jpg?aicid=discounts-widgets-horizonte 1.5x,
                https://m.media-amazon.com/images/I/81vxWpPpgNL._AC_FMavif_SF452,452_QL58_.jpg?aicid=discounts-widgets-horizonte 2x" alt="" />
                <span>photo this that</span>
                        </div>
                        <img src="./download.png" alt="" className="icon"/>
                        </div>
                        <div className="photoItem">
                        <div className="photoDetail">
                        <img src="https://m.media-amazon.com/images/I/81vxWpPpgNL._AC_SF226,226_QL85_.jpg?aicid=discounts-widgets-horizonte 1x,
                https://m.media-amazon.com/images/I/81vxWpPpgNL._AC_FMavif_SF339,339_QL58_.jpg?aicid=discounts-widgets-horizonte 1.5x,
                https://m.media-amazon.com/images/I/81vxWpPpgNL._AC_FMavif_SF452,452_QL58_.jpg?aicid=discounts-widgets-horizonte 2x" alt="" />
                <span>photo this that</span>
                        </div>
                        <img src="./download.png" alt="" className="icon"/>
                        </div>
                    </div>
                </div>
                <div className="option">
                    <div className="title">
                        <span>Shared Photos</span>
                        <img src="./arrowDown.png" alt="" className="icon"/>
                    </div>
                </div>
                <div className="option">
                    <div className="title">
                        <span>Shared files</span>
                        <img src="" alt="" />
                    </div>
                </div>
                <button>Block User</button>
                <button className="logout">Logout</button>
            </div>
        </div>
    )
}

export default Detail