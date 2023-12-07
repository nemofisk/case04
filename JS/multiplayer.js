function chooseCatagoryMultiplayer(event) {
    genreArray = [
        "Crime",
        "Drama",
        "History",
        "Action",
        "Romance",
        "Adventure",
        "Fantasy",
        "Sci-Fi",
        "Thriller",
        "Animation",
        "Comedy",
        "Horror",
    ];



    document.querySelector("main").innerHTML = `
    <header id="menu">

        <div class="profile">
            <div id="profilePic"></div>
            <p>TheMovieStar</p>
        </div>
    </header>
    

    <div>Choose a category!</div>
    <div id="catergoryMenu"></div>
    <button id="Mixed">Mixed Catagories</button>
    <button id="Continue">Continue</button>
    <div> i dont want to choose a category</div>
        

    </div>`
    let genresCategorty = document.querySelector("#catergoryMenu");

    for (let i = 0; i < genreArray.length; i++) {
        let div = document.createElement("div");
        div.classList.add("SelectedCatagorys");
        div.textContent = genreArray[i];
        genresCategorty.appendChild(div)
        div.addEventListener("click", chooseGenre)
        document.getElementById("Mixed").addEventListener("click", mixedCatagories);
    }

    let SelectedGarnres = [];

    function mixedCatagories(event) {
        let ContinueButton = document.getElementById("Continue");
        let MixedCatagoryButton = document.getElementById("Mixed");
        MixedCatagoryButton.classList.toggle("MixedChosen");
        let disabledCatagorys = document.querySelectorAll(".SelectedCatagorys");

        if (MixedCatagoryButton.classList.contains("MixedChosen")) {

            disabledCatagorys.forEach(catagory => {
                catagory.removeEventListener("click", chooseGenre);
            })

            SelectedGarnres = [
                "Crime",
                "Drama",
                "History",
                "Action",
                "Romance",
                "Adventure",
                "Fantasy",
                "Sci-Fi",
                "Thriller",
                "Animation",
                "Comedy",
                "Horror",
            ]
        } else {
            SelectedGarnres = [];
            disabledCatagorys.forEach(catagory => {
                catagory.addEventListener("click", chooseGenre);
            })
        }
        ContinueButton.addEventListener("click", event => {
            ContinueFunction(SelectedGarnres);
        });
    }

    function chooseGenre(event) {
        SelectedGarnres.push(event.target.innerHTML);
    }

    function ContinueFunction(array) {
        inviteFriends(array);
    }
}





