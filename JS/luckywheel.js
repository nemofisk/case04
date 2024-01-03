function renderLuckyWheel() {
  document.querySelector("header").innerHTML =
    `
        <div id="hamburgerMenu">
        <div></div>
        <div></div>
        <div></div>
        </div>

        ${displayCurtains("curtainsProfile", "curtainsLightProfile")}
    `
  document.getElementById("hamburgerMenu").addEventListener("click", DisplaySidebar);
  document.querySelector("main").innerHTML =
    `
    <div class="profile">
        <div id="profilePic"></div>
        <img src="images/Frame 263.png" alt="Logo">
    </div>
    
    <h1 id="lucky">Lucky Wheel!</h1>
    <img id="pin" src="../images/pin.png">
    
    <div class="wheel" id="wheel">
    <!-- Create 8 slices -->
    <div class="slice" data-index="0">0</div>
    <div class="slice" data-index="1">1</div>
    <div class="slice" data-index="2">2</div>
    <div class="slice" data-index="3">3</div>
    <div class="slice" data-index="4">4</div>
    <div class="slice" data-index="5">5</div>
    <div class="slice" data-index="6">6</div>
    <div class="slice" data-index="7">7</div>
  </div>
  <button id="spinWheel">Spin</button>

    <div class="wheel-container">
        
       
    </div>
    
    
   
    
    `
  fetch("PHP/api.php", {
    method: "POST",
    headers: { "Content-type": "application/json" },
    body: JSON.stringify({ username: window.localStorage.getItem("username"), action: "profile", subAction: "getLastSpun" })
  }).then(r => r.json()).then(resource => {
    let day = new Date()
    if (day.getDate() > parseInt(resource.message || day.getDate() === 1)) {
      if (day.getDate() === 1) {
        fetch("PHP/api.php", {
          method: "POST",
          headers: { "Content-type": "application/json" },
          body: JSON.stringify({ username: window.localStorage.getItem("username"), action: "profile", subAction: "resetMonth" })
        }).then(r => r.json()).then(resource => console.log(resource))
      }
      document.getElementById("spinWheel").style.backgroundColor = "#FFF8BA"
      document.querySelector("#spinWheel").style.color = "#323059";
      document.getElementById("spinWheel").addEventListener("click", e => {
        const randomWheelItem = getRandomItem(wheelArray);
        console.log(randomWheelItem);
        spinWheel(randomWheelItem)
      })

    } else {
      console.log("wait until tommorow");
      let p = document.createElement("p");
      p.setAttribute("id", "noMoreSpin")
      p.textContent = "Come back tomorrow to spin the wheel"
      p.style.color = "#FF6868"
      document.querySelector("main").appendChild(p)
    }
  });
  document.querySelector("footer").innerHTML = ``;
}

const wheelArray = [
  "10 points",
  "reset time",
  "no win",
  "clue",
  "5 points",
  "no win",
  "no win",
  "clue",
  "no win",
  "no win",
  "reset time",
  "10 points",
  "reset time",
  "no win",
  "10 points",
  "clue",
  "20 points",
  "5 points",
  "clue",
  "clue",
  "10 points",
  "no win",
  "5 points",
  "no win",
  "no win",
  "no win",
  "no win",
  "5 points",
  "no win",
  "no win",
  "5 points",
  "reset time",
  "5 points",
  "5 points",
  "no win",
  "clue",
  "no win",
  "no win",
  "no win",
  "no win",
  "10 points",
  "no win",
  "5 points",
  "5 points",
  "no win",
  "no win",
  "reset time",
  "10 points",
  "no win",
  "no win",
  "no win",
  "no win",
  "reset time",
  "no win",
  "clue",
  "no win",
  "reset time",
  "no win",
  "5 points",
  "5 points",
  "5 points",
  "no win",
  "no win",
  "5 points",
  "no win",
  "20 points",
  "no win",
  "no win",
  "5 points",
  "10 points",
  "20 points",
  "20 points",
  "reset time",
  "clue",
  "20 points",
  "no win",
  "5 points",
  "reset time",
  "5 points",
  "10 points",
  "no win",
  "5 points",
  "no win",
  "5 points",
  "10 points",
  "clue",
  "clue",
  "no win",
  "no win",
  "no win",
  "no win",
  "no win",
  "no win",
  "5 points",
  "10 points",
  "no win",
  "5 points",
  "no win",
  "no win",
  "reset time"
];

function getRandomItem(wheelArray) {
  const randomIndex = Math.floor(Math.random() * wheelArray.length);
  return wheelArray[randomIndex];
}



let spinning = false;

function spinWheel(indicateSlice) {

  if (!spinning) {
    let desiredSlice;

    switch (indicateSlice) {
      case "reset time":
        desiredSlice = 0;
        break;
      case "clue":
        desiredSlice = 1;
        break;
      case "5 points":
        desiredSlice = 2;
        break;
      case "no win":
        desiredSlice = 3;
        break;
      case "20 points":
        desiredSlice = 4;
        break;
      case "clue":
        desiredSlice = 5;
        break;
      case 6:
        resetTimer()
        break;
      case "10 points":
        desiredSlice = 7;
        break;
    }
    spinning = true;

    fetch("PHP/api.php", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({ username: window.localStorage.getItem("username"), action: "profile", subAction: "saveSpinDate" })
    }).then(r => r.json()).then(resource => {
      console.log(resource);
    });

    // Apply the spin animation
    const wheel = document.getElementById('wheel');
    wheel.style.transition = 'transform 3s ease-out';
    wheel.style.transform = `rotate(${(360 / 8) * desiredSlice + 720}deg)`;



    // Listen for the end of the animation
    wheel.addEventListener('transitionend', chosenSlice => {
      handleTransitionEnd(desiredSlice)

    });
  }
}


function handleTransitionEnd(desiredSlice) {
  // Get the current rotation degree after the spin
  const wheel = document.getElementById('wheel');

  const computedStyle = window.getComputedStyle(wheel);
  const transform = computedStyle.getPropertyValue('transform');
  const matrix = new DOMMatrix(transform);
  const rotation = (matrix.a * 180) / Math.PI;

  // Determine which slice it landed on
  const numSlices = 8;
  const sliceWidth = 360 / numSlices;
  const landedSlice = Math.floor((rotation % 360 + 360) % 360 / sliceWidth);

  // Display information about the landed slice
  let message;

  switch (desiredSlice) {
    case 0:
      resetTimer()
      message = "A Timer Reset!"
      break;
    case 1:
      giveClue()
      message = "A Clue!"
      break;
    case 2:
      addPoints(5)
      message = "5 points!"
      break;
    case 3:
      nothing()
      message = "Nothing"
      break;
    case 4:
      addPoints(20)
      message = "20 points!"
      break;
    case 5:
      giveClue()
      message = "A Clue!"
      break;
    case 6:
      resetTimer()
      message = "Timer Reset"
      break;
    case 7:
      addPoints(10)
      message = "20 points!"
      break;
  }
  popUpFunction("wheel", message)

  // Reset the wheel for the next spin
  wheel.style.transition = 'none';
  wheel.style.transform = 'rotate(0deg)';
  spinning = false;
  wheel.removeEventListener('transitionend', handleTransitionEnd);

}

