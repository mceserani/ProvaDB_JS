import inquirer from "inquirer"
import sqlite from "sqlite3"

const menu = [
    {
        type: "list",
        name: "menu",
        message: "Seleziona un'opzione:",
        choices: [
            { name: "Visualizza tutti gli studenti", value: "view_all" },
            { name: "Aggiungi un nuovo studente", value: "add_student" },
            { name: "Elimina un studente", value: "delete_student" },
            { name: "Aggiorna i dati di un studente", value: "update_student" },
            { name: "Esci", value: "exit" }
        ],
    },
];

async function initializeDatabase() {
    const db = await new Promise((resolve, reject) => { 
        const database = new sqlite.Database('Studenti.db', (err) => {
            if (err) {
                reject(err);
            } else {
                console.log('Connessione alla base di dati stabilita');
                resolve(database);
            }
        });
    });

    // Creazione della tabella
    await new Promise((resolve, reject) => {
        db.run(`CREATE TABLE IF NOT EXISTS Studente (
                Matricola INTEGER PRIMARY KEY AUTOINCREMENT,
                Nome TEXT NOT NULL,
                Data_N TEXT NOT NULL)`, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });

    // Verifica se la tabella è vuota
    const row = await new Promise((resolve, reject) => {
        db.get(`SELECT COUNT(*) AS count FROM Studente`, [], (err, row) => {
            if (err) {
                reject(err);
            } else {
                resolve(row);
            }
        });
    });

    // Inserimento dati di esempio se necessario
    if (row.count === 0) {
        await new Promise((resolve, reject) => {
            db.run(`INSERT INTO Studente (Nome, Data_N) VALUES (?, ?)`, 
                ['Mario Rossi', '2000-05-15'], (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });

        await new Promise((resolve, reject) => {
            db.run(`INSERT INTO Studente (Nome, Data_N) VALUES (?, ?)`, 
                ['Luigi Bianchi', '1999-08-22'], (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }

    return db;
}

async function showMenu(db) {
    try {
        const answers = await inquirer.prompt(menu);
        
        switch (answers.menu) {
            case "view_all":
                await VisualizzaStudenti(db);
                break;
            case "add_student":
                await AggiungiStudente(db);
                break;
            case "delete_student":
                await EliminaStudente(db);
                break;
            case "update_student":
                await AggiornaStudente(db);
                break;
            case "exit":
                console.log("Uscita dal programma.");
                db.close();
                process.exit(0);
            default:
                console.log("Opzione non valida.");
        }
        
        await showMenu(db);
    } catch (error) {
        console.error("Errore durante la selezione del menu:", error);
        db.close();
    }
}

async function main() {
    let db;

    try {
        db = await initializeDatabase();
        await showMenu(db);
    } catch (error) {
        console.error('Errore nell\'apertura della base di dati:', error.message);
        if (db) db.close();
    }
}

main();

async function VisualizzaStudenti(db) {
    try {
        const rows = await new Promise((resolve, reject) => {
            db.all(`SELECT * FROM Studente`, [], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
            
        if (rows.length === 0) {
            console.log("Nessun studente trovato.");
        } else {
            console.log("Elenco degli studenti:");
            rows.forEach((row) => {
                console.log(`Matricola: ${row.Matricola}, Nome: ${row.Nome}, Data di Nascita: ${row.Data_N}`);
            });
        }
    } catch (error) {
        console.error("Errore durante la visualizzazione degli studenti:", error);
    }
}

async function AggiungiStudente(db) {
    // Domande da porre all'utente
    const questions = [
        {
            type: "input",
            name: "name",
            message: "Inserisci il nome dello studente",
            validate: (answer) => {
                if( !answer || answer.length === 0 )
                    return "Inserisci il nome dello studente";
                return true;
            }
        },
        {
            type: "input",
            name: "matricola",
            message: "Inserisci matricola dello studente",
            validate: (answer) => {
                if( !answer || answer.length === 0 )
                    return "Inserisci il nome dello studente";
                return true;
            }
        },
        {
            type: "input",
            name: "dataN",
            message: "Inserisci data di nascita (yyyy-mm-dd)",
            validate: (answer) => {
                if( !answer || answer.length === 0 )
                    return "Inserisci il nome dello studente";
                return true;
            }
        },
    ];

    const answers = await inquirer.prompt(questions);

    const res = await new Promise((resolve,reject) => {
        db.run("INSERT INTO Studente(Matricola, Nome, Data_N) VALUES (?,?,?)",[answers.matricola,answers.nome,answers.dataN],(err) => {
              if (err)
                reject("Errore durante l'inserimento");
              else
                resolve("Inserimento effettuato correttamente");
        });
    });

    console.log(res);
}

async function EliminaStudente(db) {
    
    // Domanda da porre all'utente
    const question = [
        {
            type: "input",
            name: "matricola",
            message: "Inserisci la matricola dello studente da eliminare",
            validate: (answer) => {
                if( !answer || answer.length === 0 )
                    return "Inserisci la matricola dello studente da eliminare";
                return true;
            }
        },
    ];

    const answer = await inquirer.prompt(question);

    const res = await new Promise((resolve,reject) => {
        db.run("DELETE FROM Studente WHERE Matricola = ?",[answer.matricola],(err) => {
                if (err)
                    reject("Errore durante l'eliminazione");
                else
                    resolve("Eliminazione effettuata correttamente");
        });
    });

    console.log(res);
}

async function AggiornaStudente(db) {
    // Implementa qui
}