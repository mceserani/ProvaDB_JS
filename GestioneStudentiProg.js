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

function initializeDatabase() {
    return new Promise((resolve, reject) => {
        const db = new sqlite.Database('Studenti.db', (err) => {
            if (err) {
                reject(err);
            }
            resolve(db);
        });
    });
}

function selectAllStudents() {
    return new Promise((resolve, reject) => {
        db.all(`SELECT * FROM Studente`, [], (err, rows) => {
            if (err) {
                reject(err);
            }
            resolve(rows);
        });
    });
}

async function VisualizzaStudenti() {
    // Interrogazione del db
    const rows = await selectAllStudents();
    // Visualizzazione dei risultati
    console.table(rows);
}

const db = await initializeDatabase();

if (!db) {
    console.error("Impossibile connettersi al database. Uscita dal programma.");
    process.exit(1);
}

do {

    const answers = await inquirer.prompt(menu);
    
    switch (answers.menu) {
        case "view_all":
            await VisualizzaStudenti();
            break;
        case "add_student":
            AggiungiStudente();
            break;
        case "delete_student":
            EliminaStudente();
            break;
        case "update_student":
            AggiornaStudente();
            break;
        case "exit":
            console.log("Uscita dal programma.");
            db.close();
            process.exit(0);
        default:
            console.log("Opzione non valida.");
    }

} while (true);