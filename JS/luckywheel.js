function renderLuckyWheel(){
    document.querySelector("main").innerHTML = 
    `
    
    <body>
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

    </body>
    </html>
    
    `
    document.querySelector("#spinWheel").addEventListener("click", e => {

      const randomWheelItem = getRandomItem(wheelArray);
      console.log(randomWheelItem);
      spinWheel(randomWheelItem)
    })
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
  
      // Choose the slice you want to land on (0 to 7)
      
  
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
  
  switch (desiredSlice) {
    case 0:
        resetTimer()
        break;
    case 1:
        giveClue()
        break;
    case 2:
        addPoints(5)
        break;
    case 3:
        nothing()
        break;
    case 4:
        addPoints(20)
        break;
    case 5:
        giveClue()
        break;
    case 6:
        resetTimer()
        break;
    case 7:
        addPoints(10)
        break;
  }

  // Reset the wheel for the next spin
  wheel.style.transition = 'none';
  wheel.style.transform = 'rotate(0deg)';
  spinning = false;
  wheel.removeEventListener('transitionend', handleTransitionEnd);
 
}

