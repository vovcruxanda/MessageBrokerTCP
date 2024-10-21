// Select the container that will hold all the subscribers
const subscribersContainer = document.querySelector('.subscribers-container');

// Function to add a new subscriber card
function addSubscriberCard() {
    // Create a new div for the new subscriber card
    const newSubscriber = document.createElement('div');
    newSubscriber.classList.add('subscriber-section');

    // Add the HTML content for the new subscriber card
    newSubscriber.innerHTML = `
        <h2>Subscriber</h2>
        <div class="input-group">
            <label for="select-topic">Subscribe to Topic:</label>
            <select>
                <option value="" disabled selected>Select a topic</option>
            </select>
        </div>
        <div class="output-box">
            <!-- Messages from topics will appear here -->
        </div>
        <div class="input-group">
            <button class="new-subscriber-btn">Add New Subscriber</button>
        </div>
    `;

    // Append the new subscriber card to the container
    subscribersContainer.appendChild(newSubscriber);
}

// Event listener for the initial button (ensure this is present in your HTML with id="new-subscriber-btn")
document.querySelector('#new-subscriber-btn').addEventListener('click', addSubscriberCard);

// Event delegation: listen for clicks on the container
subscribersContainer.addEventListener('click', (event) => {
    // Check if the clicked element has the class 'new-subscriber-btn'
    if (event.target && event.target.classList.contains('new-subscriber-btn')) {
        console.log('New Subscriber Button Clicked'); // For debugging
        // Add a new subscriber card when the button is clicked
        addSubscriberCard();
    }
});
