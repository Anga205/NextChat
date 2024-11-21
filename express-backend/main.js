const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;
const { ObjectId } = require('mongodb');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const adminPassword = 'adminpassword';
const bcrypt = require('bcrypt');


let databaseInitialized = false;
async function initializeDatabase() {
    const uri = 'mongodb://localhost:27017';
    const client = new MongoClient(uri);
    if (!databaseInitialized) {
        try {
            await client.connect();
            const adminDb = client.db().admin();

            const databasesList = await adminDb.listDatabases();
            const dbExists = databasesList.databases.some(db => db.name === 'quickchat');

            if (!dbExists) {
                const db = client.db('quickchat');
                await db.createCollection('chatdata');
                await db.createCollection('accountdata');
                console.log('Database and collections created successfully.');
            }

            databaseInitialized = true;
        } catch (err) {
            console.error(err);
        }
    }
    const accountsCollection = client.db('quickchat').collection('accountdata');
    const chatdataCollection = client.db('quickchat').collection('chatdata');
    return { accountsCollection, chatdataCollection };
}

async function insertUser(userinfo) {
    try {
        const { accountsCollection, _ } = await initializeDatabase();
        const result = await accountsCollection.insertOne(userinfo);
        return result
    } catch (err) {
        console.error(err);
        return false;
    }
}

async function hashPassword(password) {
    const saltRounds = 10;
    try {
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        return hashedPassword;
    } catch (error) {
        console.error('Error hashing password:', error);
    }
}

async function comparePassword(plainPassword, hashedPassword) {
    try {
        const match = await bcrypt.compare(plainPassword, hashedPassword);
        return match; // Returns true if passwords match, false otherwise
    } catch (error) {
        console.error('Error comparing passwords:', error);
    }
}

async function getUserInfoFromUsername(username) {
    try {
        const { accountsCollection } = await initializeDatabase();
        const user = await accountsCollection.findOne({ username: username });
        return user;
    } catch (err) {
        console.error(err);
        return null;
    }
}

async function checkIfUsernameExists(username) {
    try {
        const { accountsCollection } = await initializeDatabase();
        const user = await accountsCollection.findOne({ username: username });
        return user !== null;
    } catch (err) {
        console.error(err);
        return false;
    }
}

async function removeUser(username) {
    try {
        const { accountsCollection, _ } = await initializeDatabase();
        const result = await accountsCollection.deleteOne({ username: username });
        return result.deletedCount === 1;
    } catch (err) {
        console.error(err);
        return false;
    }
}

async function getAllUsers() {
    try {
        const { accountsCollection, _ } = await initializeDatabase();
        const users = await accountsCollection.find().toArray();
        return users;
    } catch (err) {
        console.error(err);
        return [];
    }
}

let data = 0;

app.get('/', (_, res) => {
    data++;
    res.send(data.toString());
});


app.use(bodyParser.json());
app.use(cors({
    origin: '*',
    methods: '*',
    allowedHeaders: '*'  
}));

// Request Body Format:
// {
//     "username": "anga",
//     "display_name": "Angad Bhalla",
//     "password": "abcd",
//     "timestamp": 5347980,
//     "pendingInvites": [],
//     "friends": []
// }
app.post('/newUser', async (req, res) => {
    let { username, display_name, hashed_password, password, timestamp, pendingInvites, friends } = req.body;

    if (!username || !display_name) {
        return res.status(400).json({ error: 'Invalid data format' });
    }

    // Check if username is alphanumeric and has a length between 4 and 32
    const usernameRegex = /^[a-zA-Z0-9]{4,32}$/;
    if (!usernameRegex.test(username)) {
        return res.status(400).json({ error: 'Username must be alphanumeric and between 4 and 32 characters long' });
    }

    if (!timestamp) {
        timestamp = new Date().getTime();
    }

    if (!pendingInvites) {
        pendingInvites = [];
    }

    if (!friends) {
        friends = [];
    }

    if (!hashed_password) {
        if (!password) {
            return res.status(400).json({ error: 'Password or hashed_password is required' });
        }
        hashed_password = await hashPassword(password);
        delete req.body.password;
    }

    try {
        const userExists = await checkIfUsernameExists(username);
        if (userExists) {
            return res.status(500).json({ error: 'Username already exists' });
        }

        const insertResult = await insertUser({ username, display_name, hashed_password, timestamp, pendingInvites, friends });
        if (insertResult) {
            return res.status(201).json(insertResult);
        } else {
            console.log('Failed to create user', insertResult);
            return res.status(500).json({ error: 'Failed to create user' });
        }
    } catch (error) {
        return res.status(500).json({ error: 'Server error' });
    }
});



// Request Body Format:
// {
//     "username": "angad",
//     "password": "abcd",
//     "admin": "adminpassword"
// }
app.post('/removeUser', async (req, res) => {
    console.log("Entered /removeUser with:",req.body);
    const { username, admin, password } = req.body;

    if (!username || (!admin && !password)) {
        console.log("Invalid data format");
        return res.status(400).json({ error: 'Invalid data format' });
    }

    try {
        if (admin) {
            if (admin !== adminPassword) {
                console.log("Unauthorized");
                return res.status(401).json({ error: 'Unauthorized' });
            }
        } else {
            const user = await getUserInfoFromUsername(username);
            if (!user) {
                console.log("User not found");
                return res.status(404).json({ error: 'User not found' });
            }

            const match = await comparePassword(password, user.hashed_password);
            if (!match) {
                console.log("Incorrect password");
                return res.status(401).json({ error: 'Incorrect password' });
            }
        }

        const userExists = await checkIfUsernameExists(username);
        if (!userExists) {
            console.log("User does not exist");
            return res.status(404).json({ error: 'User does not exist' });
        }

        const { accountsCollection } = await initializeDatabase();

        // Remove user from everyone's friends list and pending invites
        await accountsCollection.updateMany(
            {},
            { $pull: { friends: userExists._id, pendingInvites: userExists._id } }
        );

        const removeResult = await removeUser(username);
        if (removeResult) {
            console.log("User removed successfully");
            return res.status(200).json({ message: 'User removed successfully' });
        } else {
            console.log("Failed to remove user");
            return res.status(500).json({ error: 'Failed to remove user' });
        }
    } catch (error) {
        console.error("Server error:",error);
        return res.status(500).json({ error: 'Server error' });
    }
});


// Request Body Format:
// {
//     "admin": "adminpassword"
// }
app.post('/getAllUsers', async (req, res) => {
    const { admin } = req.body;

    if (admin !== adminPassword) {
        return res.status(400).json({ error: 'Unauthorized' });
    }

    try {
        const users = await getAllUsers();
        return res.status(200).json(users);
    } catch (error) {
        return res.status(500).json({ error: 'Server error' });
    }
});

// Request Body Format:
// {
//     "senderUsername": "angad",
//     "senderPassword": "abcd",
//     "recipientUsername": "anga",
//     "message": {
//         "text": "hello there!",
//         "b64attachment": null
//     }
// }
app.post('/sendMessage', async (req, res) => {
    const { senderUsername, senderPassword, recipientUsername, message } = req.body;

    if (!senderUsername || !senderPassword || !recipientUsername || !message || !message.text) {
        return res.status(400).json({ error: 'Invalid data format' });
    }

    try {
        const sender = await getUserInfoFromUsername(senderUsername);
        if (!sender) {
            return res.status(404).json({ error: 'Sender not found' });
        }

        const recipient = await getUserInfoFromUsername(recipientUsername);
        if (!recipient) {
            return res.status(404).json({ error: 'Recipient not found' });
        }

        const match = await comparePassword(senderPassword, sender.hashed_password);
        if (!match) {
            return res.status(401).json({ error: 'Incorrect password' });
        }

        const { chatdataCollection } = await initializeDatabase();
        const result = await chatdataCollection.insertOne({ senderId: sender._id, recipientId: recipient._id, timestamp: new Date().getTime(), message });
        return res.status(201).json(result);
    } catch (error) {
        return res.status(500).json({ error: 'Server error' });
    }
});

// Request Body Format:
// {
//     "admin": "adminpassword"
// }
app.post('/getAllChats', async (req, res) => {
    const { admin } = req.body;

    if (admin !== adminPassword) {
        return res.status(400).json({ error: 'Unauthorized' });
    }

    try {
        const { chatdataCollection } = await initializeDatabase();
        const chats = await chatdataCollection.find().toArray();
        return res.status(200).json(chats);
    } catch (error) {
        return res.status(500).json({ error: 'Server error' });
    }
});

// Request Body Format:
// {
//     "admin": "adminpassword"
// }
app.post("/deleteDatabase", async (req, res) => {
    const { admin } = req.body;

    if (admin !== adminPassword) {
        return res.status(400).json({ error: 'Unauthorized' });
    }

    const uri = 'mongodb://localhost:27017';
    const client = new MongoClient(uri);
    try {
        await client.connect();
        await client.db('quickchat').dropDatabase();
        return res.status(200).json({ message: 'Database deleted successfully' });
    } catch (error) {
        return res.status(500).json({ error: 'Server error' });
    }
})

// Request Body Format:
// {
//     "messageID": "67342716afa8e5ceb5a5ed3a",
//     "auth": {
//         "username": "anga",
//         "password": "abcd"
//     }
// }
app.post('/deleteMessage', async (req, res) => {
    const { messageID, auth } = req.body;

    if (!messageID || !auth || !auth.username || !auth.password) {
        return res.status(400).json({ error: 'Invalid data format' });
    }

    try {
        const user = await getUserInfoFromUsername(auth.username);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const match = await comparePassword(auth.password, user.hashed_password);
        if (!match) {
            return res.status(401).json({ error: 'Incorrect password' });
        }

        const { chatdataCollection } = await initializeDatabase();
        const message = await chatdataCollection.findOne({ _id: ObjectId.createFromTime(parseInt(messageID, 16)) });

        if (!message) {
            return res.status(404).json({ error: 'Message not found' });
        }

        if (message.senderId.toString() !== user._id.toString()) {
            return res.status(403).json({ error: 'Unauthorized to delete this message' });
        }

        const result = await chatdataCollection.deleteOne({ _id: ObjectId.createFromTime(parseInt(messageID, 16)) });
        if (result.deletedCount === 1) {
            return res.status(200).json({ message: 'Message deleted successfully' });
        } else {
            return res.status(404).json({ error: 'Message not found' });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Server error' });
    }
});


// Request Body Format:
// {
//     "sender": "anga",
//     "password": "abcd"
//     "recipient": "angad"
// }
app.post('/sendInvite', async (req, res) => {
    const { sender, recipient, password } = req.body;

    if (!sender || !recipient || !password) {
        return res.status(400).json({ error: 'Invalid data format' });
    }

    try {
        const senderUser = await getUserInfoFromUsername(sender);
        if (!senderUser) {
            return res.status(404).json({ error: 'Sender not found' });
        }

        const recipientUser = await getUserInfoFromUsername(recipient);
        if (!recipientUser) {
            return res.status(404).json({ error: 'Recipient not found' });
        }

        const match = await comparePassword(password, senderUser.hashed_password);
        if (!match) {
            return res.status(401).json({ error: 'Incorrect password' });
        }

        if (recipientUser.pendingInvites.includes(senderUser._id)) {
            return res.status(400).json({ error: 'Invite already sent' });
        }

        if (recipientUser.friends.map(id => id.toString()).includes(senderUser._id.toString()) && senderUser.friends.map(id => id.toString()).includes(recipientUser._id.toString())) {
            return res.status(400).json({ error: 'Users are already friends' });
        }

        const { accountsCollection } = await initializeDatabase();

        if (senderUser.pendingInvites.map(id => id.toString()).includes(recipientUser._id.toString())) {
            await accountsCollection.updateOne(
                { username: sender },
                { $pull: { pendingInvites: recipientUser._id }, $push: { friends: recipientUser._id } }
            );
            await accountsCollection.updateOne(
                { username: recipient },
                { $push: { friends: senderUser._id } }
            );
            return res.status(200).json({ message: 'Friend request accepted' });
        }

        // Add sender's invite to recipient's pending invites if not already present
        const result = await accountsCollection.updateOne(
            { username: recipient, pendingInvites: { $ne: senderUser._id } },
            { $push: { pendingInvites: senderUser._id } }
        );

        if (result.modifiedCount === 0) {
            return res.status(400).json({ error: 'Invite already sent' });
        }

        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({ error: 'Server error' });
    }
});

// Request Body Format:
// {
//     "sender": "anga",
//     "recipient": "angad"
// }
app.post('/cancelInvite', async (req, res) => {
    const { sender, password, recipient } = req.body;

    if (!sender || !recipient || !password) {
        return res.status(400).json({ error: 'Invalid data format' });
    }

    try {
        const senderUser = await getUserInfoFromUsername(sender);
        if (!senderUser) {
            return res.status(404).json({ error: 'Sender not found' });
        }

        const recipientUser = await getUserInfoFromUsername(recipient);
        if (!recipientUser) {
            return res.status(404).json({ error: 'Recipient not found' });
        }

        const match = await comparePassword(password, senderUser.hashed_password);
        if (!match) {
            return res.status(401).json({ error: 'Incorrect password' });
        }

        if (!recipientUser.pendingInvites.map(id => id.toString()).includes(senderUser._id.toString())) {
            return res.status(400).json({ error: 'Invite not found' });
        }

        const { accountsCollection } = await initializeDatabase();
        const result = await accountsCollection.updateOne(
            { username: recipient },
            { $pull: { pendingInvites: senderUser._id } }
        );

        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({ error: 'Server error' });
    }
})


// Request Body Format:
// {
//     "username": "anga",
//     "password": "abcd"
// }
app.post('/getAllOutgoingInvites', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Invalid data format' });
    }

    try {
        const user = await getUserInfoFromUsername(username);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const match = await comparePassword(password, user.hashed_password);
        if (!match) {
            return res.status(401).json({ error: 'Incorrect password' });
        }

        const { accountsCollection } = await initializeDatabase();
        const outgoingInvites = await accountsCollection.find({ pendingInvites: user._id }).toArray();
        return res.status(200).json(outgoingInvites);
    } catch (error) {
        return res.status(500).json({ error: 'Server error' });
    }
})


// Request Body Format:
// {
//     "username": "anga",
//     "password": "abcd"
// }
app.post('/getUserInfo', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({error:'Invalid data format'});
    }

    try {
        const user = await getUserInfoFromUsername(username);
        if (!user) {
            return res.status(404).json({error:'User not found'});
        }

        const match = await comparePassword(password, user.hashed_password);
        if (!match) {
            return res.status(401).json({error:'Incorrect password'});
        }

        return res.status(200).json(user);
    } catch (error) {
        return res.status(500).json({error:'Server error'});
    }
});


// Request Body Format:
// {
//     "username": "angad",
//     "password": "abcd"
// }
app.post('/getFriends', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Invalid data format' });
    }

    try {
        const user = await getUserInfoFromUsername(username);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const match = await comparePassword(password, user.hashed_password);
        if (!match) {
            return res.status(401).json({ error: 'Incorrect password' });
        }

        const { accountsCollection } = await initializeDatabase();
        const friends = await accountsCollection.find({ _id: { $in: user.friends } }).toArray();

        // Remove hashed_password from friends data
        const friendsWithoutPassword = friends.map(friend => {
            const { hashed_password, ...friendWithoutPassword } = friend;
            return friendWithoutPassword;
        });

        return res.status(200).json(friendsWithoutPassword);
    } catch (error) {
        return res.status(500).json({ error: 'Server error' });
    }
})

// Request Body Format:
// {
//     "username": "anga",
//     "password": "abcd",
//     "messagesWith": "angad"
// }
app.post('/getMessages', async (req, res) => {
    const { username, password, messagesWith } = req.body;

    if (!username || !password || !messagesWith) {
        return res.status(400).json({ error: 'Invalid data format' });
    }

    try {
        const user = await getUserInfoFromUsername(username);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const match = await comparePassword(password, user.hashed_password);
        if (!match) {
            return res.status(401).json({ error: 'Incorrect password' });
        }

        const messagesWithUserObj = await getUserInfoFromUsername(messagesWith);

        const { chatdataCollection } = await initializeDatabase();
        const messagesWithUser = await chatdataCollection.find({
            $or: [
                { senderId: user._id, recipientId: messagesWithUserObj._id },
                { senderId: messagesWithUserObj._id, recipientId: user._id }
            ]
        }).toArray();

        return res.status(200).json(messagesWithUser);
    } catch (error) {
        return res.status(500).json({ error: 'Server error: '+error });
    }
})

// Request Body Format:
// {
//     "username": "anga",
//     "password": "abcd"
// }
app.post('/getAllIncomingInvites', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Invalid data format' });
    }

    try {
        const user = await getUserInfoFromUsername(username);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const match = await comparePassword(password, user.hashed_password);
        if (!match) {
            return res.status(401).json({ error: 'Incorrect password' });
        }

        const { accountsCollection } = await initializeDatabase();
        const incomingInvites = await accountsCollection.find({ _id: { $in: user.pendingInvites } }).toArray();

        // Remove hashed_password, pending invites, timestamp, friends from incoming invites data
        const SecureInvite = incomingInvites.map(invite => {
            const { hashed_password, ...SecureInvite } = invite;
            delete SecureInvite.timestamp;
            delete SecureInvite.pendingInvites;
            delete SecureInvite.friends;
            return SecureInvite;
        });

        return res.status(200).json(SecureInvite);
    } catch (error) {
        return res.status(500).json({ error: 'Server error' });
    }
});


// Request Body Format:
// {
//     "username": "anga",
//     "password": "abcd",
//     "friend_to_remove": "angad"
// }
app.post('/removeFriend', async (req, res) => {
    const { username, password, friend_to_remove } = req.body;

    if (!username || !password || !friend_to_remove) {
        return res.status(400).json({ error: 'Invalid data format' });
    }

    try {
        const user = await getUserInfoFromUsername(username);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const friend = await getUserInfoFromUsername(friend_to_remove);
        if (!friend) {
            return res.status(404).json({ error: 'Friend not found' });
        }

        const match = await comparePassword(password, user.hashed_password);
        if (!match) {
            return res.status(401).json({ error: 'Incorrect password' });
        }

        if (!user.friends.map(id => id.toString()).includes(friend._id.toString())) {
            return res.status(400).json({ error: 'User is not a friend' });
        }

        const { accountsCollection } = await initializeDatabase();
        const result = await accountsCollection.updateOne(
            { username: username },
            { $pull: { friends: friend._id } }
        );

        await accountsCollection.updateOne(
            { username: friend_to_remove },
            { $pull: { friends: user._id } }
        );

        if (result.modifiedCount === 0) {
            return res.status(400).json({ error: 'Friend not found' });
        }

        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({ error: 'Server error' });
    }
})

app.listen(port, () => {
    console.log(`QuickChat listening at http://localhost:${port}`);
}).on('error', (err) => {
    console.error(err);
})
