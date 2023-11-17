document.addEventListener('DOMContentLoaded', () => {
  const cardContainer = document.getElementById('card-container');
  const toyForm = document.querySelector('.add-toy-form');

  let addToy = false;

  // Event listener to toggle toy form visibility
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");

  addBtn.addEventListener("click", () => {
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });

  // Event listener for form submission
  toyForm.addEventListener('submit', (event) => {
    event.preventDefault();

    // Get form data
    const name = event.target.elements['name'].value;
    const image = event.target.elements['image'].value;
    const likes = 0; // Initial likes count

    // Add new toy
    addNewToy(name, image, likes);

    // Clear form
    event.target.reset();
  });

  // Fetch data and display existing toys
  fetchToys();

  // Function to fetch toys and display them
  function fetchToys() {
    fetch('http://localhost:3000/toys')
      .then(response => response.json())
      .then(data => {
        data.forEach(toy => {
          const card = createToyCard(toy);
          cardContainer.appendChild(card);
        });
      })
      .catch(error => console.error('Error fetching data:', error));
  }

  // Function to create a toy card
  function createToyCard(toy) {
    const card = document.createElement('div');
    card.setAttribute('class', 'card');

    const name = document.createElement('h2');
    name.textContent = toy.name;

    const toyImage = document.createElement('img');
    toyImage.setAttribute('src', toy.image);
    toyImage.setAttribute('alt', 'Toy Image');

    const likes = document.createElement('p');
    likes.textContent = `Toy Likes: ${toy.likes}`;

    const likeButton = document.createElement('button');
    likeButton.setAttribute('class', 'like-btn');
    likeButton.setAttribute('id', toy.id);
    likeButton.textContent = 'Like ❤️';

    // Event listener for the "Like" button
    likeButton.addEventListener('click', () => {
      const toyId = toy.id;
      const newLikes = toy.likes + 1; // Increase likes by 1
      updateToyLikes(toyId, newLikes);
    });

    card.appendChild(name);
    card.appendChild(toyImage);
    card.appendChild(likes);
    card.appendChild(likeButton);

    return card;
  }

  // Function to add a new toy
  function addNewToy(name, image, likes) {
    const toyData = {
      name: name,
      image: image,
      likes: likes
    };

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(toyData)
    };

    fetch('http://localhost:3000/toys', options)
      .then(response => response.json())
      .then(newToy => {
        const card = createToyCard(newToy);
        cardContainer.appendChild(card);
      })
      .catch(error => console.error('Error adding toy:', error));
  }

  // Function to update a toy's likes
  function updateToyLikes(toyId, newLikes) {
    const options = {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ likes: newLikes })
    };

    fetch(`http://localhost:3000/toys/${toyId}`, options)
      .then(response => response.json())
      .then(updatedToy => {
        // Update the toy's likes in the DOM
        const toyCard = document.getElementById(updatedToy.id);
        if (toyCard) {
          const likesElement = toyCard.querySelector('p');
          likesElement.textContent = `Toy Likes: ${updatedToy.likes}`;
        }
      })
      .catch(error => console.error('Error updating toy likes:', error));
  }
});
