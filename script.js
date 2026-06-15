document.querySelectorAll(".card").forEach(card => {
    card.addEventListener("mouseenter", () => {
        card.style.transition = "0.3s";
    });
});