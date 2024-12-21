document.addEventListener("DOMContentLoaded", () => {
    const drawPile = document.getElementById("draw-pile");
    const playerArea = document.getElementById("player-area");

    // Draw a card from the draw pile
    drawPile.addEventListener("click", async () => {
        const gameId = drawPile.dataset.gameId;

        try {
            const response = await fetch(`/games/${gameId}/draw`, {
                method: "POST",
            });

            if (!response.ok) {
                throw new Error("Failed to draw a card");
            }

            const { newCard } = await response.json();
            addCardToPlayerArea(newCard);
        } catch (error) {
            console.error("Error drawing card:", error);
        }
    });

    // Play a card
    playerArea.addEventListener("click", (event) => {
        const card = event.target.closest(".card");
        if (card) {
            const cardValue = card.dataset.cardValue;
            const cardSuit = card.dataset.cardSuit;
            const position = { x: 0, y: 0 }; // Replace with actual position logic

            playCard(gameId, { value: cardValue, suit: cardSuit }, position);
        }
    });

    // Function to add a card to the player's area
    function addCardToPlayerArea(card) {
        const cardElement = document.createElement("div");
        cardElement.className = `card value-${card.value}`;
        cardElement.dataset.cardValue = card.value;
        cardElement.dataset.cardSuit = card.suit;
        cardElement.innerHTML = `<span>${card.value}</span>`;
        playerArea.appendChild(cardElement);
    }

    // Function to play a card
    async function playCard(gameId, card, position) {
        try {
            const response = await fetch(`/games/${gameId}/play`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ cardId: `${card.suit}${card.value}`, position }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to play card");
            }

            const gameState = await response.json();
            updateGameBoard(gameState);
        } catch (error) {
            console.error("Error playing card:", error);
        }
    }

    // Function to update the game board with the new game state
    function updateGameBoard(gameState) {
        // Update the player area
        const playerArea = document.getElementById("player-area");
        playerArea.innerHTML = ""; // Clear existing cards

        gameState.player.cards.forEach(card => {
            const cardElement = document.createElement("div");
            cardElement.className = `card value-${card.value}`;
            cardElement.dataset.cardValue = card.value;
            cardElement.dataset.cardSuit = card.suit;
            cardElement.innerHTML = `<span>${card.value}</span>`;
            playerArea.appendChild(cardElement);
        });

        // Update the opponent area
        const opponentArea = document.getElementById("opponent-area");
        opponentArea.innerHTML = ""; // Clear existing opponent cards

        gameState.players.forEach(player => {
            const playerElement = document.createElement("div");
            playerElement.className = "player";
            playerElement.innerHTML = `<h4>${player.username} (${player.color})</h4>`;
            const handElement = document.createElement("div");
            handElement.className = "hand";

            player.cards.forEach(card => {
                const cardElement = document.createElement("div");
                cardElement.className = `card value-${card.value}`;
                cardElement.dataset.cardValue = card.value;
                cardElement.dataset.cardSuit = card.suit;
                cardElement.innerHTML = `<span>${card.value}</span>`;
                handElement.appendChild(cardElement);
            });

            playerElement.appendChild(handElement);
            opponentArea.appendChild(playerElement);
        });
    }
});