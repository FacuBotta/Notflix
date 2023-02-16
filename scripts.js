/* CAROUSEL */
const carouselContainer = document.querySelector(".carouselContainer");
const carouselfilm = document.querySelectorAll(".carouselfilm");
const carouselBtnLeft = document.getElementById("carouselBtnLeft");
const carouselBtnRigth = document.getElementById("carouselBtnRigth");
let carouselTitle = document.getElementById('carouselTitle');

carouselBtnRigth.addEventListener("click", () => {
    carouselContainer.scrollLeft += carouselContainer.offsetWidth;
});
carouselBtnLeft.addEventListener("click", () => {
    carouselContainer.scrollLeft -= carouselContainer.offsetWidth;
});

/* <<<< description >>>> */
let typeResult = document.getElementById("typeResult");
let titleSearchInput = document.getElementById("titleSearchInput");
let blockDescription = document.getElementById("blockDescription");
let flashDescription = document.getElementById("flashDescription")
let containerNav = document.getElementById("containerNav");
let searchContainer = document.getElementById('searchContainer');
let posterContainer = document.getElementById("posterContainer");
let titleDescription = document.getElementById("title");
let year = document.getElementById("year");
let country = document.getElementById("country");
let genre = document.getElementById("genre");
let runtime = document.getElementById("runtime");
let director = document.getElementById("director");
let rating = document.getElementById("rating");
let votes = document.getElementById("votes");
let actors = document.getElementById("actors");
let description = document.getElementById("description"); /* data.plot */

function titleSearch(title, type) {
    fetch(`http://www.omdbapi.com/?apikey=38c8d091&s="${title}"&type="${type}"&page=1`)
        .then(Response => Response.json())
        .then(data1 => {
            fetch(`http://www.omdbapi.com/?apikey=38c8d091&s="${title}"&type="${type}"&page=2`)
                .then(Response => Response.json())
                .then(data2 => {
                    let results = data1.Search.map(result => result);
                    for (let i = 0; i < 10; i++) {
                        results.push(data2.Search[i]);
                    };
                    let resultsList = searchContainer.appendChild(document.createElement("div"));
                    resultsList.setAttribute("class", "resultsList");
                    resultsList.addEventListener("mouseleave", () => { resultsList.hidden = true });
                    searchContainer.addEventListener("mouseover", () => { resultsList.hidden = false });
                    for (let i = 0; i < results.length; i++) {
                        let newItem = resultsList.appendChild(document.createElement("li"));
                        newItem.textContent = results[i].Title;

                        newItem.addEventListener("click", () => {
                            titleSearchInput.value = "";
                            resultsList.remove();
                            removeOldCarousel();
                            IdSearch(results[i].imdbID);
                            carouselMaker(results);
                        });
                    };
                })
                .catch(() => {
                    typeResult.textContent = "No Results";
                    titleSearchInput.value = "";
                });
        });
};

function IdSearch(id) {
    fetch(`http://www.omdbapi.com/?apikey=38c8d091&i=${id}`)
        .then(Response => Response.json())
        .then(data => {
            posterContainer.style.backgroundImage = `url(${data.Poster})`;
            titleDescription.textContent = data.Title;
            year.textContent = `Year: ${data.Year}`;
            country.textContent = `Country: ${data.Country}`;
            genre.textContent = `Genre: ${data.Genre}`;
            runtime.textContent = `Duration: ${data.Runtime}`;
            director.textContent = `Directors: ${data.Director}`;
            rating.textContent = `ImdbRating: ${data.imdbRating}`;
            votes.textContent = `ImdbVotes: ${data.imdbVotes}`;
            actors.textContent = `Actors: ${data.Actors}`;
            description.textContent = `Sinopsis: ${data.Plot}`;
            typeResult.textContent = data.Type;
        });
};

function randomStart(type) {
    let i = Math.floor(Math.random() * 10);
    let startMovies = ["blade runner", "ninja", "terminator", "dragon", "bad", "rock", "hard", "love", "horror", "dog", "killer"];
    fetch(`http://www.omdbapi.com/?apikey=38c8d091&s=${startMovies[i]}&type="${type}"`)
        .then(Response => Response.json())
        .then(data => {
            let results = data.Search.map(result => result);
            let j = Math.floor(Math.random() * results.length);
            IdSearch(results[j].imdbID);
            carouselMaker(results);
            titleSearchInput.value = "";
        });

};

function carouselMaker(results) {

    carouselTitle.textContent = 'Titles Relationes';
    let carousel = carouselContainer.appendChild(document.createElement('div'));
    carousel.setAttribute('class', 'carousel');
    carousel.setAttribute('id', 'carousel');

    for (let i = 0; i < results.length; i++) {
        let carouselFilm = carousel.appendChild(document.createElement('div'));
        carouselFilm.setAttribute('class', "carouselFilm");
        carouselFilm.setAttribute('id', "carouselFilm");

        let filmLink = carouselFilm.appendChild(document.createElement('a'));
        filmLink.setAttribute("href", `#blockDescription`);
        filmLink.setAttribute("class", `filmLinkClass${i}`);
        filmLink.addEventListener("click", () => {
            IdSearch(results[i].imdbID);
        });

        let imgCarousel = filmLink.appendChild(document.createElement('img'));
        imgCarousel.src = results[i].Poster;

        imgCarousel.addEventListener("mouseenter", (e) => {
            let flashDescriptionTitle = document.getElementById('flashDescriptionTitle');
            let flashDescriptionYear = document.getElementById('flashDescriptionYear');
            let flashDescriptionRuntime = document.getElementById('flashDescriptionRuntime');
            let flashDescriptionGenre = document.getElementById('flashDescriptionGenre');
            let flashDescriptionDescription = document.getElementById('flashDescriptionDescription');

            if (e.target.className = `filmLinkClass${i}`) {
                let x = e.clientX;
                let y = e.clientY;

                fetch(`http://www.omdbapi.com/?apikey=38c8d091&i=${results[i].imdbID}`)
                    .then(Response => Response.json())
                    .then(data => {
                        flashDescriptionTitle.textContent = data.Title;
                        flashDescriptionYear.textContent = data.Year;
                        flashDescriptionGenre.textContent = data.Genre;
                        flashDescriptionRuntime.textContent = data.Runtime;
                        flashDescriptionDescription.textContent = data.Plot;
                    });
                flashDescription.classList.add('active');
                flashDescription.style.top = (y - 350) + `px`;
                flashDescription.style.left = (x - 100) + `px`;
            };

            filmLink.addEventListener("mouseleave", () => {
                flashDescription.classList.remove('active');
            });
            flashDescription.addEventListener("mouseleave", () => {
                flashDescription.classList.remove('active');
            });
        });

    }
};

function removeOldCarousel() {
    carousel.remove();
};

/* <<<<<START>>>>> */
let types = ["series", "movie"]
let k = Math.floor(Math.random() * types.length);
let type = types[k];
randomStart(type);

/* <<<<<SEARCHS>>>>> */
let aMovies = document.getElementById("aMovies");
let aSeries = document.getElementById("aSeries");
aMovies.addEventListener('click', () => {
    type = "movie";
    titleSearchInput.placeholder = "Movies";
    removeOldCarousel();
    randomStart(type);
});

aSeries.addEventListener('click', () => {
    type = "series";
    titleSearchInput.placeholder = "Series";
    removeOldCarousel();
    randomStart(type);
});

titleSearchInput.addEventListener("change", () => {
    titleSearch(titleSearchInput.value, type);
});