const net = require('net');
// Import? modulul `net` pentru a crea conexiuni de re?ea TCP.

const readline = require('readline');
// Import? modulul `readline` pentru a permite intrarea de la tastatur?.

const brokerIp = '127.0.0.1'; // Broker IP address
// Specific? adresa IP a broker-ului.

const brokerPort = 5000;      // Broker port
// Specific? portul broker-ului.

// Create a readline interface for user input
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
// Creeaz? o interfa?? de citire pentru a permite utilizatorului s? introduc? date de la tastatur?.

const client = new net.Socket();
// Creeaz? un socket global pentru a se conecta la broker.

// Function to connect to the broker
function connectToBroker() {
    client.connect(brokerPort, brokerIp, () => {
        console.log('Connected to broker');
        // Afi?eaz? un mesaj de confirmare a conexiunii la broker.
        promptUserForMessage(); // Start asking for input after connection
        // Ini?iaz? procesul de solicitare a mesajului de la utilizator dup? conectare.
    });

    client.on('error', (error) => {
        console.error('Error:', error.message);
        // Gestioneaz? erorile de conexiune ?i le afi?eaz?.
    });

    client.on('close', () => {
        console.log('Connection to broker closed.');
        // Afi?eaz? un mesaj când conexiunea este închis?.
        rl.close(); // Close readline when the connection is closed
        // Închide interfa?a de citire atunci când conexiunea se închide.
    });
}

// Function to send a message to the broker
function sendMessage(message) {
    client.write(message);
    // Trimite mesajul c?tre broker prin conexiunea TCP.
    console.log('Message sent:', message);
    // Afi?eaz? un mesaj de confirmare c? mesajul a fost trimis.
}

// Function to create a message in JSON or XML format
function createMessage(topic, content, format) {
    let message = '';
    if (format === '1') { // JSON
        message = `PUBLISH|${topic}|{"topic": "${topic}", "content": "${content}"}`;
        // Creeaz? un mesaj în format JSON.
    } else if (format === '2') { // XML
        message = `PUBLISH|${topic}|<message><topic>${topic}</topic><content>${content}</content></message>`;
        // Creeaz? un mesaj în format XML.
    }
    return message;
}

// Function to prompt user for input and send messages
function promptUserForMessage() {
    rl.question('Choose message format (1: JSON, 2: XML): ', (formatChoice) => {
        // Solicit? utilizatorului s? aleag? formatul mesajului (JSON sau XML).
        if (formatChoice !== '1' && formatChoice !== '2') {
            console.log('Invalid choice. Please select 1 for JSON or 2 for XML.');
            // Afi?eaz? un mesaj de eroare dac? formatul selectat este invalid.
            return promptUserForMessage(); // Ask again if invalid format
            // Reia solicitarea dac? formatul nu este valid.
        }

        rl.question('Enter topic (Romane, Detective, Psihologie): ', (topic) => {
            // Solicit? utilizatorului s? introduc? un topic.
            if (!topic) {
                console.log('Topic cannot be empty.');
                // Afi?eaz? un mesaj de eroare dac? topicul este gol.
                return promptUserForMessage(); // Ask again if topic is empty
                // Reia solicitarea dac? topicul este gol.
            }

            rl.question('Enter message content: ', (content) => {
                // Solicit? utilizatorului s? introduc? con?inutul mesajului.
                if (!content) {
                    console.log('Message content cannot be empty.');
                    // Afi?eaz? un mesaj de eroare dac? con?inutul este gol.
                    return promptUserForMessage(); // Ask again if content is empty
                    // Reia solicitarea dac? con?inutul este gol.
                }

                // Create and send the message
                const message = createMessage(topic, content, formatChoice);
                // Creeaz? mesajul folosind topicul, con?inutul ?i formatul ales.
                sendMessage(message);
                // Trimite mesajul la broker.

                // Ask the user if they want to send another message
                rl.question('Do you want to send another message? (yes/no): ', (answer) => {
                    // Întreab? utilizatorul dac? dore?te s? trimit? un alt mesaj.
                    if (answer.toLowerCase() === 'yes') {
                        promptUserForMessage(); // Continue sending messages
                        // Dac? utilizatorul r?spunde "da", continu? s? solicite alte mesaje.
                    } else {
                        console.log('Closing the connection and exiting the publisher.');
                        // Afi?eaz? un mesaj de închidere ?i ie?ire.
                        client.end(); // Close the connection gracefully
                        // Închide conexiunea în mod corespunz?tor.
                    }
                });
            });
        });
    });
}

// Connect to the broker and start the process
connectToBroker();
// Conecteaz? clientul la broker ?i începe procesul de trimitere a mesajelor.
