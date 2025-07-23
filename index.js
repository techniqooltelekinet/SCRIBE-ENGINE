import express from 'express';
import sqlite3 from 'sqlite3';

const app = express();
const port = 3001;

app.use(express.json());

// Verse I: We summon the spirit of the Memory-Stone and give it a permanent, global name.
const db = new sqlite3.Database('./scribe_archive.db', (err) => {
    if (err) {
        console.error("Error opening database:", err.message);
    } else {
        console.log('Connected to the Scribe\'s Archive.');
        // Verse II: We command the now-global spirit to consecrate the temple.
        db.run(`CREATE TABLE IF NOT EXISTS reports (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            description TEXT NOT NULL,
            location TEXT,
            timestamp TEXT NOT NULL,
            type TEXT NOT NULL
        )`, (err) => {
            if (err) {
                console.error("Error creating table:", err.message);
            }
            console.log('"reports" table is consecrated.');
        });
    }
});

// Verse III: Now, the Spell of Submission can see the global spirit "db".
app.post('/report', (req, res) => {
    const { description, location, timestamp, type } = req.body;

    if (!description || !timestamp || !type) {
        return res.status(400).json({ error: 'description, timestamp, and type are required fields.' });
    }

    const sql = `INSERT INTO reports (description, location, timestamp, type) VALUES (?, ?, ?, ?)`;
    const params = [description, location, timestamp, type];

    db.run(sql, params, function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({
            message: 'Success',
            id: this.lastID
        });
    });
});

// Verse IV: The Spell of Scrying (The Next Chapter)
app.get('/reports', (req, res) => {
    const sql = "SELECT * FROM reports";
    db.all(sql, [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({
            message: "Archive scryed successfully.",
            data: rows
        });
    });
});


// The Final Verse: The Golem opens its ears.
app.listen(port, () => {
    console.log(`The Scribe's Engine is listening on port ${port}`);
});