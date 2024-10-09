import "./tailwind.css";

function SidebarButton({ text }) {
    return (
        <li className="mb-2">
            <button className="bg-gray-800 p-2 rounded-lg text-white w-full hover:bg-gray-700 text-left">
                {text}
            </button>
        </li>
    );
}


function Chat() {
    return (
        <div className="bg-gray-900 text-white h-screen flex flex-col">
            <header className="bg-gray-800 p-4 text-center text-xl font-bold">
                Chat Room
            </header>
            <div className="flex flex-1">
                <aside className="bg-gray-800 w-64 p-4">
                    <h2 className="text-lg font-bold mb-4">Sidebar</h2>
                    <ul>
                        <SidebarButton text={"Bob"} />
                        <SidebarButton text={"Alice"} />
                        <SidebarButton text={"Jones"} />
                    </ul>
                </aside>
                <main className="flex-1 p-4 overflow-y-auto">
                    <div className="mb-4">
                        <div className="bg-gray-700 p-2 rounded-lg">
                            <p>User1: Hello!</p>
                        </div>
                    </div>
                    <div className="mb-4">
                        <div className="bg-gray-700 p-2 rounded-lg">
                            <p>User2: Hi there!</p>
                        </div>
                    </div>
                </main>
            </div>
            <footer className="bg-gray-800 p-4">
                <input
                    type="text"
                    placeholder="Type your message..."
                    className="w-full p-2 rounded-lg bg-gray-700 text-white"
                />
            </footer>
        </div>
    );
}

export default Chat;