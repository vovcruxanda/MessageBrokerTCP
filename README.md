# Message Broker TCP
Socket-urile reprezintă puncte de conexiune într-o rețea TCP/IP. Ele permit comunicarea între programe aflate pe calculatoare diferite.
Funcționarea acestora are loc prin serverul ce deschide un socket și așteaptă conexiuni; clientul se conectează la server, permițând astfel schimbul de informații. Clientul trebuie să cunoască adresa destinației și portul pe care socket-ul este deschis.
Principalele Operații ale Socket-urilor
Conectare la un alt socket
Trimitere date
Recepționare date
Închidere conexiune
Acceptare conexiuni
Brokerul de mesaje  este o componentă fizică care gestionează comunicarea între componentele unei aplicații distribuite. Avantajul principal al acetuia este decuplarea receptorului de transmițătorul mesajelor.
Modul de funcționare este destul de simplu. Aplicațiile transmit mesaje doar agentului, specificând un nume logic al receptorului. Brokerul poate expune diverse interfețe pentru colaborare între aplicații, fără a impune o interfață comună.
Responsabilități
Componente de comunicare
Primirea mesajelor
Expeditori: aplicații care trimit mesaje agentului
Determinarea destinatarilor și efectuarea rutării
Receptori: aplicații care primesc mesaje de la broker
Tratarea diferențelor dintre interfețe


Transmiterea mesajelor



Avantajele brokerului sunt:
Reducerea Cuplării: Transmițătorii comunică doar cu brokerul, permițând o grupare transparentă a receptorilor sub un nume logic comun.
Mărirea Integrabilității: Aplicațiile nu trebuie să aibă aceeași interfață, brokerul funcționând ca o punte între aplicații cu diferite nivele de securitate și calitate a serviciilor (QoS).
Mărirea Evolutivității: Brokerul protejează componentele de modificările aplicațiilor integrate, oferind capacități de configurare dinamică.
Dezavantajele brokerului sunt:
Creșterea Complexității: Brokerul trebuie să implementeze multiple interfețe și să utilizeze multithreading pentru a gestiona comunicația.
Creșterea Efortului pentru Mentenanță: Participanții trebuie să fie înregistrați la broker și să aibă un mecanism de identificare.
Reducerea Disponibilității: Brokerul reprezintă un singur punct de eșec, iar căderea acestuia poate bloca întregul sistem. Acest lucru poate fi remedial prin dublarea brokerului și sincronizarea stărilor.
Reducerea Performanței: Brokerul introduce overhead suplimentar, ceea ce poate afecta performanța sistemului.
gRPC este o platformă modernă de înaltă performanță, derivată din vechiul protocol RPC (Remote Procedure Call), facilitând mesageria între clienți și serviciile de backend.
Avantajele HTTP/2
Comprimarea antetului
Multiplexare (trimiterea mai multor solicitări simultan)
Conexiune unică pentru cereri multiple
Împingerea răspunsurilor multiple către client
Folosirea formatului binar în loc de text
Beneficiile gRPC
Utilizarea HTTP/2 ca protocol de transport, cu funcții avansate:
Protocol de încadrare binar pentru transportul de date.
Suport pentru multiplexare, permițând trimiterea mai multor cereri paralele printr-o singură conexiune.
Comunicație bidirecțională full duplex pentru a trimite cererile clientului și răspunsurile serverului simultan.
Streaming încorporat pentru transmiterea asincronă a cererilor și răspunsurilor.
Comprimarea antetului care reduce utilizarea rețelei.
JSON (JavaScript Object Notation) și XML (Extensible Markup Language) sunt formate utilizate pentru stocarea și schimbul de date între sisteme. 
JSON este un format de date bazat pe text, care este ușor de citit și scris atât de oameni, cât și de mașini. JSON utilizează o structură de perechi cheie-valoare și liste ordonate. Elementele sunt delimitate de acolade {} pentru obiecte și de paranteze pătrate [] pentru liste (array-uri).
{
  "nume": "Ruxanda",
  "varsta": 22,
  "abilitati": ["programare", "matematică", "analiză de date"]
}
Avantaje JSON sunt:
Mai ușor de citit și de scris pentru oameni.
Mai compact și eficient în termeni de spațiu.
Se integrează bine cu limbaje moderne de programare și API-uri.
XML este un limbaj de marcare care utilizează etichete pentru a defini structura datelor. Este folosit pentru a descrie și a transporta date, fiind mai orientat spre documente și utilizat în aplicații web și în transferul de date între sisteme.
XML utilizează o structură bazată pe etichete (tags), unde fiecare element are o etichetă de început și o etichetă de sfârșit. Elementele pot avea, de asemenea, atribute.
<persoana>
  <nume>Ruxanda</nume>
  <varsta>22</varsta>
  <abilitati>
    <abilitate>programare</abilitate>
    <abilitate>matematică</abilitate>
    <abilitate>analiză de date</abilitate>
  </abilitati>
</persoana>
Avantaje XML sunt:
Este auto-descriptiv, ceea ce înseamnă că fiecare etichetă explică ce reprezintă datele.
Poate gestiona date complexe și structuri ierarhice.
Folosit pe scară largă în aplicațiile enterprise și în configurațiile de sistem.
Diferențe cheie între JSON și XML
Caracteristică
JSON
XML
Ușurința de citire
Mai ușor pentru oameni
Mai greu pentru oameni
Dimensiunea
Mai mică
Mai mare
Suport pentru tipuri de date
Suport nativ pentru obiecte, liste, numere, șiruri de caractere, booleeni
Toate datele sunt tratate ca text
Utilizare
Cel mai des folosit în aplicații web moderne și API-uri
Folosit în aplicații vechi, enterprise și în documente complexe
Flexibilitate
Mai puțin flexibil în ceea ce privește structura
Mai flexibil în definirea structurilor complexe

Ambele formate sunt utilizate pentru a transmite date între client și server în aplicații web, dar alegerea între JSON și XML depinde de nevoile specifice ale aplicației și de preferințele dezvoltatorilor.

În cadrul acestui laborator s-a lucrat în 3 limbaje pentru a colabora în realizarea unui sistem de comunicare de tip publisher-subscriber folosind un broker de mesaje. 
Acest sistem publisher-subscriber folosește un broker central pentru a intermedia comunicarea între publisheri și subscriberi. Publisherii pot trimite mesaje pe anumite topicuri fără a cunoaște cine sunt abonații, iar subscriberii primesc mesajele doar de la topicurile la care s-au abonat. Această arhitectură asigură o comunicare eficientă și scalabilă, permitând adăugarea ușoară a noi publisheri și subscriberi fără modificări semnificative ale codului existent.
Publisher-ul (Python):
Acest cod este responsabil pentru a permite utilizatorului să introducă mesaje și să le trimită către broker. Utilizatorul poate specifica formatul mesajului (JSON sau XML), topicul și conținutul mesajului.
Publisher-ul utilizează un socket TCP pentru a se conecta la broker și trimite mesajele formate către acesta utilizând comanda PUBLISH. După trimiterea unui mesaj, utilizatorul poate alege dacă dorește să mai trimită alte mesaje sau să închidă conexiunea.
Broker-ul de mesaje (C#):
Acesta este componenta centrală care gestionează conexiunile TCP de la clienți (publisheri și subscriberi), menține listele de abonați pentru fiecare topic și distribuie mesajele către aceștia.
Broker-ul primește mesaje de tip PUBLISH de la publisheri și le trimite către toți subscriberii înregistrați la topicul respectiv. În același timp, gestionează cererile de abonare la diferite topicuri utilizând comanda SUBSCRIBE.
Subscriber-ul (JavaScript):
Subscriber-ul se conectează la broker și se abonează la unul sau mai multe topicuri. După abonare, acesta primește și afișează mesajele trimise către topicurile respective.
Subscriber-ul utilizează comanda SUBSCRIBE pentru a se înregistra la topicuri și rămâne conectat pentru a primi mesaje în timp real de la broker.
În continuare, se va analiza fiecare etapă de funcționare al sistemului Publisher-Subscriber.
1. Etapa de inițializare:
Broker-ul pornește primul și începe să asculte conexiunile TCP pe un port specific (în cazul nostru, portul 5000). Broker-ul inițializează și topicurile predefinite: "Romane", "Detective" și "Psihologie".
2. Abonarea subscriber-ilor la topicuri:
Subscriber-ul se conectează la broker și trimite o cerere de abonare utilizând comanda SUBSCRIBE, specificând la ce topicuri dorește să se aboneze (de exemplu, SUBSCRIBE|Romane,Detective).
Broker-ul adaugă clientul în lista de abonați pentru fiecare topic indicat și confirmă abonarea.
3. Publicarea mesajelor de către publisher:
Publisher-ul se conectează la broker și permite utilizatorului să specifice formatul mesajului (JSON sau XML), topicul și conținutul acestuia. Publisher-ul formează un mesaj utilizând comanda PUBLISH (de exemplu, PUBLISH|Romane|{"topic": "Romane", "content": "Noua carte este acum disponibilă."}) și trimite acest mesaj broker-ului.
4. Distribuirea mesajelor către abonați:
Broker-ul primește mesajul publicat de la publisher și verifică dacă există abonați pentru topicul respectiv. Dacă există abonați, broker-ul trimite mesajul către toți aceștia.
Subscriber-ul primește mesajul de la broker în timp real și îl afișează pe ecran, oferind utilizatorului final acces instantaneu la informația publicată.
Fluxul de comunicare între componente se poate descrie prin următorul mod:
Publisher -> Broker: Publisher-ul trimite mesaje către broker pentru a publica informații pe un anumit topic.
Broker -> Subscriber: Broker-ul trimite mesajele publicate către subscriberii abonați la topicul respectiv.
Subscriber -> Broker: Subscriber-ul trimite o cerere de abonare către broker pentru a se înregistra la topicurile dorite.
