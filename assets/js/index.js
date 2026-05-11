

/* =========================
ROLE TEXT ANIMATION
========================= */

const roleText = document.querySelector(".animated-role-text");

if(roleText){

const words = [
  "Innovating Education",
  "Empowering Students",
  "Building Future Leaders",
  "Technology Meets Learning"
];

let wordIndex = 0;
let charIndex = 0;
let deleting = false;

function typeEffect(){

  const currentWord = words[wordIndex];

  if(!deleting){

    roleText.textContent =
    currentWord.substring(0,charIndex++);

    if(charIndex > currentWord.length){

      deleting = true;

      setTimeout(typeEffect,1500);

      return;
    }

  }else{

    roleText.textContent =
    currentWord.substring(0,charIndex--);

    if(charIndex < 0){

      deleting = false;

      wordIndex = (wordIndex + 1) % words.length;
    }
  }

  setTimeout(typeEffect,deleting ? 60 : 100);
}

typeEffect();

}

/* =========================
SCROLL ANIMATION
========================= */

const cards = document.querySelectorAll(".card");

window.addEventListener("scroll",()=>{

  cards.forEach(card=>{

    const cardTop = card.getBoundingClientRect().top;

    if(cardTop < window.innerHeight - 100){

      card.classList.add("show");

    }

  });

});

/* =========================
SEARCH FUNCTION
========================= */

const searchInput = document.querySelector("#searchInput");

if(searchInput){

searchInput.addEventListener("keyup",()=>{

  const filter =
  searchInput.value.toLowerCase();

  const cards =
  document.querySelectorAll(".card");

  cards.forEach(card=>{

    const text =
    card.textContent.toLowerCase();

    card.style.display =
    text.includes(filter)
    ? "block"
    : "none";

  });

});

}

/* =========================
GPA CALCULATOR
========================= */

const gpaBtn =
document.querySelector("#calculateBtn");

if(gpaBtn){

gpaBtn.addEventListener("click",(e)=>{

  e.preventDefault();

  const unit =
  document.querySelector("#unit").value;

  const grade =
  document.querySelector("#grade").value;

  let point = 0;

  if(grade === "A") point = 5;
  else if(grade === "B") point = 4;
  else if(grade === "C") point = 3;
  else if(grade === "D") point = 2;
  else point = 0;

  const gpa = point * unit;

  document.querySelector("#gpaResult")
  .innerHTML =
  "Calculated Point: " + gpa;

});

}

/* =========================
NOTES FUNCTION
========================= */

const addNoteBtn =
document.querySelector("#addNote");

if(addNoteBtn){

addNoteBtn.addEventListener("click",()=>{

  const noteText =
  document.querySelector("#noteText").value;

  if(noteText.trim() === "") return;

  const note =
  document.createElement("div");

  note.classList.add("note");

  note.innerHTML = `
    <p>${noteText}</p>
  `;

  document.querySelector(".saved-notes")
  .appendChild(note);

  document.querySelector("#noteText").value = "";

});

}
