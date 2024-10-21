using System.Net.Sockets;
using System.Net;
using System.Text;
using System.Collections.Generic;
using System.Threading;
using System;

// Definește clasa MessageBroker care va gestiona abonații și trimiterea mesajelor.
public class MessageBroker
{
    // Dicționar pentru a păstra listele de abonați pentru fiecare topic.
    private readonly Dictionary<string, List<TcpClient>> subscribers = new Dictionary<string, List<TcpClient>>();

    // Constructorul clasei, care inițializează categoriile disponibile.
    public MessageBroker()
    {
        InitializeTopics();
    }

    // Inițializează categoriile predefinite ("Romane", "Detective", "Psihologie").
    private void InitializeTopics()
    {
        subscribers.Add("Romane", new List<TcpClient>());
        subscribers.Add("Detective", new List<TcpClient>());
        subscribers.Add("Psihologie", new List<TcpClient>());
        Console.WriteLine("Categoriile de produse (temele) predefinite au fost adăugate:");

        // Afișează toate categoriile predefinite.
        foreach (var topic in subscribers.Keys)
        {
            Console.WriteLine($"- {topic}");
        }
    }

    // Pornește brokerul pe portul specificat și ascultă conexiunile TCP.
    public void Start(int port)
    {
        // Creează un TcpListener care ascultă pe toate interfețele de rețea (IPAddress.Any) și pe portul specificat.
        TcpListener listener = new TcpListener(IPAddress.Any, port);
        listener.Start();
        Console.WriteLine("Brokerul a pornit pe portul " + port);

        // Buclă infinită pentru a accepta noi conexiuni de la clienți.
        while (true)
        {
            TcpClient client = listener.AcceptTcpClient();
            // Creează un nou fir de execuție pentru fiecare client conectat.
            new Thread(() => HandleClient(client)).Start();
        }
    }

    // Manipulează interacțiunea cu fiecare client într-un fir de execuție separat.
    private void HandleClient(TcpClient client)
    {
        try
        {
            NetworkStream stream = client.GetStream();
            byte[] buffer = new byte[1024];

            // Buclă pentru a primi mesaje de la client.
            while (true)
            {
                int bytesRead = stream.Read(buffer, 0, buffer.Length);
                if (bytesRead == 0) break; // Dacă nu se citesc date, înseamnă că s-a închis conexiunea.

                // Decodifică cererea primită în format ASCII.
                string request = Encoding.ASCII.GetString(buffer, 0, bytesRead);

                // Verifică dacă cererea este un mesaj de tip "PUBLISH".
                if (request.StartsWith("PUBLISH"))
                {
                    HandlePublish(request);
                }
                // Verifică dacă cererea este un mesaj de tip "SUBSCRIBE".
                else if (request.StartsWith("SUBSCRIBE"))
                {
                    HandleSubscribe(request, client);
                }
            }
        }
        catch (Exception ex)
        {
            // Capturează orice eroare și o afișează.
            Console.WriteLine($"Eroare la manipularea clientului: {ex.Message}");
        }
    }

    // Manipulează cererile de publicare a mesajelor.
    private void HandlePublish(string request)
    {
        // Împarte cererea în părți folosind separatorul "|".
        string[] parts = request.Split('|');
        if (parts.Length < 3)
        {
            Console.WriteLine("Mesaj PUBLISH invalid.");
            return;
        }

        // Extrage topicul și mesajul din cerere.
        string topic = parts[1];
        string message = parts[2];

        // Verifică dacă există abonați la topicul specificat.
        if (subscribers.ContainsKey(topic))
        {
            // Trimite mesajul tuturor abonaților la acel topic.
            foreach (var subscriber in subscribers[topic])
            {
                SendMessage(subscriber, message);
            }
            Console.WriteLine($"Mesaj trimis catre toti abonatii categoriei {topic}.");
        }
        else
        {
            Console.WriteLine($"Categoria {topic} nu exista.");
        }
    }

    // Manipulează cererile de abonare la anumite topicuri.
    private void HandleSubscribe(string request, TcpClient client)
    {
        // Împarte cererea în părți folosind separatorul "|".
        string[] parts = request.Split('|');
        if (parts.Length < 2)
        {
            Console.WriteLine("Mesaj SUBSCRIBE invalid.");
            return;
        }

        // Împarte topicurile în funcție de virgulă.
        string[] topics = parts[1].Split(',');

        // Parcurge fiecare topic la care clientul vrea să se aboneze.
        foreach (var topic in topics)
        {
            string trimmedTopic = topic.Trim();
            if (!subscribers.ContainsKey(trimmedTopic))
            {
                // Dacă topicul nu există, îl adaugă în dicționar.
                subscribers[trimmedTopic] = new List<TcpClient>();
            }

            // Adaugă clientul în lista de abonați dacă nu este deja abonat.
            if (!subscribers[trimmedTopic].Contains(client))
            {
                subscribers[trimmedTopic].Add(client);
                Console.WriteLine($"Client abonat la categoria: {trimmedTopic}");
            }
            else
            {
                Console.WriteLine($"Clientul este deja abonat la categoria: {trimmedTopic}");
            }
        }
    }

    // Trimite un mesaj unui abonat specific.
    private void SendMessage(TcpClient subscriber, string message)
    {
        try
        {
            NetworkStream stream = subscriber.GetStream();
            byte[] data = Encoding.ASCII.GetBytes(message + "\n"); // Adaugă delimitatorul newline.
            stream.Write(data, 0, data.Length);
            stream.Flush();
        }
        catch (Exception ex)
        {
            // Capturează și afișează erorile la trimiterea mesajelor.
            Console.WriteLine($"Eroare la trimiterea mesajului: {ex.Message}");
        }
    }

    // Punctul de intrare al programului.
    public static void Main(string[] args)
    {
        int port = 5000; // Specifică portul dorit.
        MessageBroker broker = new MessageBroker();
        broker.Start(port);
    }
}
