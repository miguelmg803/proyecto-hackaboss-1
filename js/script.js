'use strict'

//Definimos las referencias iniciales que vayamos a utilizar
const letterContainer = document.getElementById("letter-container");
const optionsContainer = document.getElementById("options-container");
const userInputSection = document.getElementById("user-input-section");
const newGameContainer = document.getElementById("new-game-container");
const newGameButton = document.getElementById("new-game-button");
const canvas = document.getElementById("canvas");
const resultText = document.getElementById("result-text");

//Objeto opciones donde dentro de el tiene 3 propiedades que son las listas con las opciones en un array
let options = {
  frutas: [
    "Manzana",
    "Fresas",
    "Mandarina",
    "Piña",
    "Pomelo",
    "Sandia",
  ],
  animales: [
    "Leon",
    "Jirafa",
    "Tigre",
    "Rinoceronte",
    "Murcielago",
    "Canguro"],
  paises: [
    "India",
    "Hungria",
    "Alemania",
    "Suiza",
    "Zimbawe",
    "España",
  ],
};

//Definimos los contadores que luego utilizaremos
let winCount = 0;
let loseCount = 0;

let chosenWord = "";

//Mostramos las opciones a elegir

const displayOptions = () => {
  optionsContainer.innerHTML += `<h3>Selecciona una Tematica  </h3>`;
  let buttonCon = document.createElement("div");
  for (let value in options) {
    buttonCon.innerHTML += `<button class="options" onclick="generateWord('${value}')">${value}</button>`;
  }
  optionsContainer.appendChild(buttonCon);
};


//Creamos una funcion para desactivar todos los botones
const blocker = () => {
  let optionsButtons = document.querySelectorAll(".options");
  let letterButtons = document.querySelectorAll(".letters");

  optionsButtons.forEach((button) => {
    button.disabled = true;
  });

  letterButtons.forEach((button) => {
    button.disabled = true;
  });
  newGameContainer.classList.remove("hide");
};

//Creamos una funcion donde elegiremos la palabra aleatoria del array que hayamos elegido
const generateWord = (optionValue) => {
  let optionsButtons = document.querySelectorAll(".options");

  //si el valor de optionValue es igual le añadimos una clase "active" para resaltarla
  optionsButtons.forEach((button) => {
    if (button.innerText.toLowerCase() === optionValue) {
      button.classList.add("active");
    }
    button.disabled = true;
  });

  letterContainer.classList.remove("hide");
  let btnDis = document.querySelectorAll(".letters")
  btnDis.forEach((button) => {
    button.disabled = true;
  });

  userInputSection.innerText = "";


  let optionArray = options[optionValue];
  //Escogemos una palabra aleatoria dentro del array elegido
  chosenWord = optionArray[Math.floor(Math.random() * optionArray.length)];
  chosenWord = chosenWord.toUpperCase();

  let btnEnab = document.querySelectorAll(".letters")
  btnEnab.forEach((button) => {
    button.disabled = false;
  });

  //Remplazamos cada letra con un guion bajo y un spam
  let displayItem = chosenWord.replace(/./g, '<span class="dashes">_</span>');

  userInputSection.innerHTML = displayItem;

  console.log(chosenWord);
};

//Declaramos la funciona inicial la cual se llamara cuando el usuario carge la pagina o haga una nueva partida
const initializer = () => {
  winCount = 0;
  loseCount = 0;

  //Borramos todo el contenido y escondemos las letras y el boton de nueva partida
  userInputSection.innerHTML = "";
  optionsContainer.innerHTML = "";
  letterContainer.classList.add("hide");
  newGameContainer.classList.add("hide");
  letterContainer.innerHTML = "";


  //Creamos todos los botones con sus letras
  for (let i = 65; i < 91; i++) {

    let button = document.createElement("button");
    button.classList.add("letters");

    //Covertimos el numero en string para que nos de la letra.
    button.innerText = String.fromCharCode(i);

    //Hacemos lo mismo pero para añadir la ñ
    if (i == 79) {
      button.classList.add("letters");
      button.innerText = String.fromCharCode(209);
    }

    letterContainer.append(button);

    clickBtn(button)
  }

  //Desactivamos las letras hasta que no hayamos elegido una opcion
  let btnDis = document.querySelectorAll(".letters")
  btnDis.forEach((button) => {
    button.disabled = true;
  });

  //Hacemos la funciona clickBtn para crear un enventlistener que gestione la letra que hemos seleccionado
  function clickBtn(btn) {

    btn.addEventListener("click", () => {
      let charArray = chosenWord.split("");
      console.log(charArray);
      let dashes = document.getElementsByClassName("dashes");
      //Si el array contiene la letra que hayamos seleccionado, remplazamos el guion por la letra,si no sumamos un fallo y lo dibujamos.
      if (charArray.includes(btn.innerText)) {
        charArray.forEach((char, index) => {
            
          if (char === btn.innerText) {
            
            dashes[index].innerText = char;
            
            winCount += 1;
            //Si la variable equivale al tamaño de la letra dariamos la partida como ganada
            if (winCount == charArray.length) {
              resultText.innerHTML = `<h2 class='win-msg'>Has Ganado!!</h2><p>La palabra era: <span>${chosenWord}</span></p>`;
                //Definimos beat, para poder ejecutarlo y reproducir un audio
                let beat = new Audio('audio/win.mp3');
                beat.play();

              blocker();
            }
          }
        });
      } else {
        
        loseCount += 1;

        //Dibujamos el muñeco dependiendo de el numero que haya en la variable loseCount
        drawMan(loseCount);
        
        if (loseCount == 6) {
          resultText.innerHTML = `<h2 class='lose-msg'>Has Perdido!!</h2><p>La palabra era: <span>${chosenWord}</span></p>`;
          let lose = new Audio('audio/lose.mp3');
          lose.play();
          blocker();
        }
      }

      btn.disabled = true;
    });
    }

  displayOptions();
  
  let { initialDrawing } = canvasCreator();
  
  initialDrawing();
};

//Canvas
const canvasCreator = () => {
  let context = canvas.getContext("2d");
  context.beginPath();
  context.strokeStyle = "#000";
  context.lineWidth = 2;

  //For drawing lines
  const drawLine = (fromX, fromY, toX, toY) => {
    context.moveTo(fromX, fromY);
    context.lineTo(toX, toY);
    context.stroke();
  };

  const head = () => {
    context.beginPath();
    context.arc(70, 30, 10, 0, Math.PI * 2, true);
    context.stroke();
  };

  const body = () => {
    drawLine(70, 40, 70, 80);
  };

  const leftArm = () => {
    drawLine(70, 50, 50, 70);
  };

  const rightArm = () => {
    drawLine(70, 50, 90, 70);
  };

  const leftLeg = () => {
    drawLine(70, 80, 50, 110);
  };

  const rightLeg = () => {
    drawLine(70, 80, 90, 110);
  };

  //initial frame
  const initialDrawing = () => {
    //clear canvas
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    //bottom line
    drawLine(10, 130, 130, 130);
    //left line
    drawLine(10, 10, 10, 131);
    //top line
    drawLine(10, 10, 70, 10);
    //small top line
    drawLine(70, 10, 70, 20);
  };

  return { initialDrawing, head, body, leftArm, rightArm, leftLeg, rightLeg };
};

//draw the man
const drawMan = (count) => {
  let { head, body, leftArm, rightArm, leftLeg, rightLeg } = canvasCreator();
  switch (count) {
    case 1:
      head();
      break;
    case 2:
      body();
      break;
    case 3:
      leftArm();
      break;
    case 4:
      rightArm();
      break;
    case 5:
      leftLeg();
      break;
    case 6:
      rightLeg();
      break;
    default:
      break;
  }
};

//New Game
newGameButton.addEventListener("click", initializer);
window.onload = initializer;
