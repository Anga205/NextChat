const bcrypt = require('bcrypt');

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

module.exports = { hashPassword, comparePassword };