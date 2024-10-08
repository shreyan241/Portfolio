const typewriter = document.querySelector('.typewriter');
const words = ["a Data Science Grad.", "a Machine Learning Engineer.", "an AI Researcher.", "a Statistical Analyst.", "a Data Storyteller."];
let i = 0;
let j = 0;
let currentWord = '';
let isDeleting = false;

function type() {
    if (isDeleting) {
        currentWord = words[i].substring(0, j--);
    } else {
        currentWord = words[i].substring(0, j++);
    }
    
    typewriter.textContent = currentWord;

    if (!isDeleting && j === words[i].length) {
        setTimeout(() => isDeleting = true, 1000);
    } else if (isDeleting && j === 0) {
        i = (i + 1) % words.length;
        isDeleting = false;
    }

    setTimeout(type, isDeleting ? 50 : 150);
}

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(type, 500);
});
