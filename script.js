const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");

const cards = document.querySelectorAll(".card");

function filterCards() {

    const search = searchInput.value.toLowerCase();
    const category = categoryFilter.value;

    cards.forEach(card => {

        const name =
            card.dataset.name.toLowerCase();

        const categories =
            card.dataset.category.toLowerCase();

        const matchSearch =
            name.includes(search);

        const matchCategory =
            category === "all" ||
            categories.includes(category);

        if (matchSearch && matchCategory) {
            card.style.display = "block";
        } else {
            card.style.display = "none";
        }

    });
}

searchInput.addEventListener("input", filterCards);
categoryFilter.addEventListener("change", filterCards);