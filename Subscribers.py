import socket
# Importă modulul `socket` pentru a facilita comunicarea de rețea între client și broker.

import threading
# Importă modulul `threading` pentru a putea gestiona ascultarea mesajelor pe un fir de execuție separat.

class Subscriber:
    def __init__(self, broker_ip, broker_port):
        # Constructorul clasei Subscriber care primește adresa IP și portul broker-ului.
        self.broker_ip = broker_ip
        # Salvează adresa IP a broker-ului.
        self.broker_port = broker_port
        # Salvează portul broker-ului.
        self.running = True
        # Variabilă ce controlează execuția buclei principale din meniul de opțiuni.

    def start(self):
        try:
            self.client_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            # Creează un socket TCP/IP pentru a comunica cu broker-ul.
            self.client_socket.connect((self.broker_ip, self.broker_port))
            # Conectează clientul la broker folosind IP-ul și portul specificate.
            print(f"Connected to broker at {self.broker_ip}:{self.broker_port}")
            # Afișează un mesaj de confirmare că s-a realizat conexiunea cu broker-ul.

            # Start a thread to listen for messages from the broker
            threading.Thread(target=self.receive_messages, daemon=True).start()
            # Creează un nou fir de execuție (thread) care va rula metoda `receive_messages` pentru a asculta mesajele de la broker în fundal.

            # Main loop for subscribing to topics
            self.menu()
            # Intră în bucla principală a meniului de opțiuni pentru a permite utilizatorului să se aboneze la categorii.
        except Exception as e:
            print(f"Error connecting to broker: {e}")
            # Capturează și afișează orice eroare întâlnită la conectarea la broker.

    def menu(self):
        # Funcția care gestionează meniul de opțiuni al utilizatorului.
        while self.running:
            print("\n--- Menu ---")
            # Afișează meniul.
            print("1. Subscribe to categories")
            # Opțiunea 1 pentru abonarea la categorii.
            print("2. Exit")
            # Opțiunea 2 pentru a ieși din aplicație.
            option = input("Choose an option: ")
            # Solicită utilizatorului să selecteze o opțiune.

            if option == "1":
                self.subscribe_to_topics()
                # Dacă utilizatorul alege opțiunea 1, se va abona la categorii.
            elif option == "2":
                self.running = False
                # Dacă utilizatorul alege opțiunea 2, oprește bucla principală.
                print("Exiting...")
                # Afișează un mesaj de ieșire.
                self.client_socket.close()
                # Închide conexiunea socket.
            else:
                print("Invalid option. Please choose again.")
                # Afișează un mesaj de eroare dacă opțiunea introdusă este invalidă.

    def subscribe_to_topics(self):
        # Funcția care gestionează abonarea utilizatorului la una sau mai multe categorii.
        topics_input = input("Enter the categories you wish to subscribe to: ")
        # Solicită utilizatorului să introducă categoriile la care dorește să se aboneze.
        if not topics_input:
            print("Category cannot be empty.")
            # Verifică dacă utilizatorul nu a introdus nimic și afișează un mesaj de eroare.
            return

        subscribe_message = f"SUBSCRIBE|{topics_input}"
        # Creează un mesaj de abonare în formatul "SUBSCRIBE|{categorii}".
        self.client_socket.sendall(subscribe_message.encode('ascii'))
        # Trimite mesajul către broker prin conexiunea socket.
        print(f"Subscribed to categories: {topics_input}")
        # Afișează un mesaj care confirmă categoriile la care utilizatorul s-a abonat.

    def receive_messages(self):
        # Funcția care gestionează primirea mesajelor de la broker.
        buffer = ""
        # Creează un buffer pentru stocarea mesajelor primite parțial.
        while True:
            try:
                message_chunk = self.client_socket.recv(1024).decode('ascii')
                # Primește un segment de 1024 de octeți de date de la broker și îl decodează în format ASCII.
                if message_chunk:
                    buffer += message_chunk
                    # Adaugă segmentul primit la buffer.

                    # Split messages by newline (delimiter added by the broker)
                    while "\n" in buffer:
                        message, buffer = buffer.split("\n", 1)
                        # Împarte bufferul în mesaje complete folosind caracterul de newline ca delimitator.
                        print(f"\n[Message received] {message}")
                        # Afișează mesajul primit.
                else:
                    break  # Connection closed
                    # Închide bucla dacă nu mai sunt date de primit (conexiunea a fost închisă).
            except Exception as e:
                print(f"Error receiving messages: {e}")
                # Capturează și afișează orice eroare întâlnită în timpul recepționării mesajelor.
                break

if __name__ == "__main__":
    broker_ip = "127.0.0.1"  # Replace with your broker's IP address
    # Adresa IP a broker-ului (de înlocuit cu IP-ul corect).
    broker_port = 5000        # Replace with your broker's port
    # Portul broker-ului (de înlocuit cu portul corect).
    subscriber = Subscriber(broker_ip, broker_port)
    # Creează o instanță a clasei Subscriber cu IP-ul și portul broker-ului.
    subscriber.start()
    # Pornește procesul de abonare la broker.
