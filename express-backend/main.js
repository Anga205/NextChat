const express = require('express');
const { hashPassword, comparePassword } = require('./passwordHasher.js');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;
const { ObjectId } = require('mongodb');
const { MongoClient } = require('mongodb');
const adminPassword = 'adminpassword';


let databaseInitialized = false;
async function initializeDatabase() {
    const uri = 'mongodb://localhost:27017';
    const client = new MongoClient(uri);
    if (!databaseInitialized) {
        try {
            await client.connect();
            const adminDb = client.db().admin();

            // Check if the database exists
            const databasesList = await adminDb.listDatabases();
            const dbExists = databasesList.databases.some(db => db.name === 'quickchat');

            if (!dbExists) {
                const db = client.db('quickchat');
                await db.createCollection('chatdata');
                await db.createCollection('accountdata');
                console.log('Database and collections created successfully.');
            } else {
                console.log('Database already exists.');
            }

            databaseInitialized = true;
            const accountsCollection = client.db('quickchat').collection('accountdata');
            const chatdataCollection = client.db('quickchat').collection('chatdata');
            return { accountsCollection, chatdataCollection };
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


// Request Body Format:
// {
//     "username": "anga",
//     "displayName": "Angad Bhalla",
//     "password": "abcd",
//     "timestamp": 5347980,
//     "pendingInvites": [],
//     "friends": []
// }
app.post('/newUser', async (req, res) => {
    let { username, displayName, hashed_password, password, timestamp, pendingInvites, friends } = req.body;

    if (!username || !displayName || !Array.isArray(pendingInvites) || !Array.isArray(friends)) {
        return res.status(400).send('Invalid data format');
    }

    // Check if username is alphanumeric and has a length between 8 and 32
    const usernameRegex = /^[a-zA-Z0-9]{4,32}$/;
    if (!usernameRegex.test(username)) {
        return res.status(400).send('Username must be alphanumeric and between 8 and 32 characters long');
    }

    if (!timestamp) {
        timestamp = new Date().getTime();
    }

    if (!hashed_password) {
        if (!password) {
            return res.status(400).send('Password or hashed_password is required');
        }
        hashed_password = await hashPassword(password);
        delete req.body.password;
    }

    try {
        const userExists = await checkIfUsernameExists(username);
        if (userExists) {
            return res.status(500).send('Username already exists');
        }

        const insertResult = await insertUser({ username, displayName, hashed_password, timestamp, pendingInvites, friends });
        if (insertResult) {
            return res.status(201).send(insertResult);
        } else {
            console.log('Failed to create user', insertResult);
            return res.status(500).send('Failed to create user');
        }
    } catch (error) {
        return res.status(500).send('Server error');
    }
});



// Request Body Format:
// {
//     "username": "angad",
//     "admin": "adminpassword"
// }
app.post('/removeUser', async (req, res) => {
    const { username, admin } = req.body;

    if (!username || admin !== adminPassword) {
        return res.status(400).send('Invalid data format or unauthorized');
    }

    try {
        const userExists = await checkIfUsernameExists(username);
        if (!userExists) {
            return res.status(404).send('User does not exist');
        }

        const removeResult = await removeUser(username);
        if (removeResult) {
            return res.status(200).send('User removed successfully');
        } else {
            return res.status(500).send('Failed to remove user');
        }
    } catch (error) {
        return res.status(500).send('Server error');
    }
});


// Request Body Format:
// {
//     "admin": "adminpassword"
// }
app.post('/getAllUsers', async (req, res) => {
    const { admin } = req.body;

    if (admin !== adminPassword) {
        return res.status(400).send('Unauthorized');
    }

    try {
        const users = await getAllUsers();
        return res.status(200).json(users);
    } catch (error) {
        return res.status(500).send('Server error');
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
        return res.status(400).send('Invalid data format');
    }

    try {
        const sender = await getUserInfoFromUsername(senderUsername);
        if (!sender) {
            return res.status(404).send('Sender not found');
        }

        const recipient = await getUserInfoFromUsername(recipientUsername);
        if (!recipient) {
            return res.status(404).send('Recipient not found');
        }

        const match = await comparePassword(senderPassword, sender.hashed_password);
        if (!match) {
            return res.status(401).send('Incorrect password');
        }

        const { chatdataCollection } = await initializeDatabase();
        const result = await chatdataCollection.insertOne({ senderId: sender._id, recipientId: recipient._id, timestamp: new Date().getTime(), message });
        return res.status(201).send(result);
    } catch (error) {
        return res.status(500).send('Server error');
    }
});

// Request Body Format:
// {
//     "admin": "adminpassword"
// }
app.post('/getAllChats', async (req, res) =>{
    const { admin } = req.body;

    if (admin !== adminPassword) {
        return res.status(400).send('Unauthorized');
    }

    try {
        const { chatdataCollection } = await initializeDatabase();
        const chats = await chatdataCollection.find().toArray();
        return res.status(200).json(chats);
    } catch (error) {
        return res.status(500).send('Server error');
    }
}) 

// Request Body Format:
// {
//     "admin": "adminpassword"
// }
app.post("/deleteDatabase", async (req, res) => {
    const { admin } = req.body;

    if (admin !== adminPassword) {
        return res.status(400).send('Unauthorized');
    }

    const uri = 'mongodb://localhost:27017';
    const client = new MongoClient(uri);
    try {
        await client.connect();
        await client.db('quickchat').dropDatabase();
        return res.status(200).send('Database deleted successfully');
    } catch (error) {
        return res.status(500).send('Server error');
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
        return res.status(400).send('Invalid data format');
    }

    try {
        const user = await getUserInfoFromUsername(auth.username);
        if (!user) {
            return res.status(404).send('User not found');
        }

        const match = await comparePassword(auth.password, user.hashed_password);
        if (!match) {
            return res.status(401).send('Incorrect password');
        }

        const { chatdataCollection } = await initializeDatabase();
        const message = await chatdataCollection.findOne({ _id: ObjectId.createFromTime(parseInt(messageID, 16)) });

        if (!message) {
            return res.status(404).send('Message not found');
        }

        if (message.senderId.toString() !== user._id.toString()) {
            return res.status(403).send('Unauthorized to delete this message');
        }

        const result = await chatdataCollection.deleteOne({ _id: ObjectId.createFromTime(parseInt(messageID, 16)) });
        if (result.deletedCount === 1) {
            return res.status(200).send('Message deleted successfully');
        } else {
            return res.status(404).send('Message not found');
        }
    } catch (error) {
        console.error(error);
        return res.status(500).send('Server error');
    }
});


// Request Body Format:
// {
//     "sender": "anga",
//     "recipient": "angad"
// }
app.post('/sendInvite', async (req, res) => {
    const { sender, recipient } = req.body;

    if (!sender || !recipient) {
        return res.status(400).send('Invalid data format');
    }

    try {
        const senderUser = await getUserInfoFromUsername(sender);
        if (!senderUser) {
            return res.status(404).send('Sender not found');
        }

        const recipientUser = await getUserInfoFromUsername(recipient);
        if (!recipientUser) {
            return res.status(404).send('Recipient not found');
        }

        if (recipientUser.pendingInvites.includes(senderUser._id)) {
            return res.status(400).send('Invite already sent');
        }

        if (recipientUser.friends.includes(senderUser._id) && senderUser.friends.includes(recipientUser._id)) {
            return res.status(400).send('Users are already friends');
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
            return res.status(200).send('Friend request accepted');
        }

        // Add sender's invite to recipient's pending invites if not already present
        const result = await accountsCollection.updateOne(
            { username: recipient, pendingInvites: { $ne: senderUser._id } },
            { $push: { pendingInvites: senderUser._id } }
        );

        if (result.modifiedCount === 0) {
            return res.status(400).send('Invite already sent');
        }

        return res.status(200).send(result);
    } catch (error) {
        return res.status(500).send('Server error');
    }
});

// Request Body Format:
// {
//     "sender": "anga",
//     "recipient": "angad"
// }
app.post('/cancelInvite', async (req, res) => {
    const { sender, recipient } = req.body;

    if (!sender || !recipient) {
        return res.status(400).send('Invalid data format');
    }

    try {
        const senderUser = await getUserInfoFromUsername(sender);
        if (!senderUser) {
            return res.status(404).send('Sender not found');
        }

        const recipientUser = await getUserInfoFromUsername(recipient);
        if (!recipientUser) {
            return res.status(404).send('Recipient not found');
        }

        if (!recipientUser.pendingInvites.map(id => id.toString()).includes(senderUser._id.toString())) {
            return res.status(400).send('Invite not found');
        }

        const { accountsCollection } = await initializeDatabase();
        const result = await accountsCollection.updateOne(
            { username: recipient },
            { $pull: { pendingInvites: senderUser._id } }
        );

        return res.status(200).send(result);
    } catch (error) {
        return res.status(500).send('Server error');
    }
})

app.listen(port, () => {
    console.log(`QuickChat listening at http://localhost:${port}`);
}).on('error', (err) => {
    console.error(err);
})
