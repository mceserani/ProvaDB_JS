import sqlite3 from 'sqlite3';

const db = new sqlite3.Database('Studenti.db', (err) => {
    if (err) {
        console.error('Errore nell\'apertura della base di dati:', err.message);
        return;
    }
    console.log('Connessione alla base di dati stabilita');
});

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS Studente (
    Matricola INTEGER PRIMARY KEY AUTOINCREMENT,
    Nome TEXT NOT NULL,
    Data_N TEXT NOT NULL)`, (err) => {
    if (err) {
        console.error('Errore nella creazione della tabella:', err.message);
        return;
    }
    console.log('Tabella Studente creata o già esistente');
    });

    let nome = 'Mario Rossi';
    let dataN = '2000-05-15';

    db.run(`INSERT INTO Studente (Nome, Data_N) VALUES (?, ?)`, [nome, dataN], (err) => {
        if (err) {
            console.error('Errore nell\'inserimento dello studente:', err.message);
            return;
        }
        console.log('Studente inserito con successo');
    });

    db.all(`SELECT * FROM Studente`, [], (err, rows) => {
        if (err) {
            console.error('Errore nella lettura degli studenti:', err.message);
            return;
        }
        console.log('Studenti letti con successo:', rows);
    });
});