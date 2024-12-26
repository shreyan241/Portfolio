const typewriter = document.querySelector('.typewriter');
const words = ["a Data Science Grad.", "a Machine Learning Engineer.", "an AI Researcher.", "a Statistical Analyst.", "a Data Storyteller."];
let i = 0;
let j = 0;
let currentWord = '';
let isDeleting = false;
let isMakingMistake = false;
let isCorrectingMistake = false;

// Common typing mistakes map
const mistakeMap = {
    'a': 's', 's': 'a', 'e': 'r', 'r': 'e', 'i': 'o', 'o': 'i',
    'n': 'm', 'm': 'n', 't': 'y', 'y': 't'
};

function type() {
    if (isMakingMistake) {
        // Pause briefly with the mistake visible before correcting
        isMakingMistake = false;
        isCorrectingMistake = true;
    } else if (isCorrectingMistake) {
        // Fix the mistake by backspacing
        currentWord = currentWord.slice(0, currentWord.lastIndexOf('<')); // Remove the mistake span
        isCorrectingMistake = false;
    } else if (isDeleting) {
        if (currentWord.includes('<span')) {
            currentWord = currentWord.slice(0, currentWord.lastIndexOf('<'));
        } else {
            currentWord = words[i].substring(0, j--);
        }
    } else {
        // 10% chance to make a mistake when typing
        if (!isDeleting && Math.random() < 0.1 && j > 0) {
            const correctChar = words[i][j - 1];
            const mistakeChar = mistakeMap[correctChar.toLowerCase()] || correctChar;
            if (mistakeChar !== correctChar) {
                currentWord = words[i].substring(0, j - 1) + `<span class="mistake">${mistakeChar}</span>`;
                isMakingMistake = true;
                j--;
            } else {
                currentWord = words[i].substring(0, j++);
            }
        } else {
            currentWord = words[i].substring(0, j++);
        }
    }
    
    typewriter.innerHTML = currentWord; // Changed to innerHTML to render HTML

    let nextStep;
    if (!isDeleting && j === words[i].length) {
        isDeleting = true;
        nextStep = 1000; // Pause at end of word
    } else if (isDeleting && j === 0) {
        isDeleting = false;
        i = (i + 1) % words.length;
        nextStep = 500; // Pause before next word
    } else {
        if (isMakingMistake) {
            nextStep = 200; // Pause with mistake visible
        } else if (isCorrectingMistake) {
            nextStep = 200; // Slower deletion of mistake
        } else {
            nextStep = isDeleting ? 50 : 150; // Normal typing/deleting speed
        }
    }

    setTimeout(type, nextStep);
}

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(type, 500);
});
