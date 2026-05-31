import { useEffect, useState } from "react";

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Small QWERTY-neighbor map used to pick a believable "fat-finger" typo for a
// given letter. Bidirectional-ish; letters with no entry simply skip the typo.
const QWERTY_NEIGHBORS: Record<string, string> = {
  a: "s",
  s: "a",
  d: "f",
  f: "d",
  g: "h",
  h: "g",
  j: "k",
  k: "l",
  l: "k",
  q: "w",
  w: "q",
  e: "r",
  r: "e",
  t: "y",
  y: "t",
  u: "i",
  i: "o",
  o: "p",
  p: "o",
  z: "x",
  x: "z",
  c: "v",
  v: "c",
  b: "n",
  n: "m",
  m: "n",
};

// Probability of mis-typing any given (non-first) character.
const MISTAKE_RATE = 0.05;

function mistakeFor(ch: string): string | null {
  const lower = ch.toLowerCase();
  const neighbor = QWERTY_NEIGHBORS[lower];
  if (!neighbor) return null;
  return ch === lower ? neighbor : neighbor.toUpperCase();
}

export type TypewriterState = {
  /** The currently visible text (including a trailing typo char, if any). */
  text: string;
  /** Index of the errant trailing character within `text`, or null. */
  mistakeIndex: number | null;
};

export function useTypewriter(words: string[]): TypewriterState {
  // Key on the words' content, not the array identity, so callers passing a
  // fresh array each render (e.g. [...phrases]) don't restart the effect on
  // every keystroke (which would otherwise leave it stuck on the first char).
  const wordsKey = words.join("\u0001");
  const [text, setText] = useState(words[0] ?? "");
  const [mistakeIndex, setMistakeIndex] = useState<number | null>(null);

  useEffect(() => {
    const list = wordsKey.split("\u0001");

    if (prefersReducedMotion()) {
      setText(list[0] ?? "");
      setMistakeIndex(null);
      return;
    }

    let wordIndex = 0;
    let charIndex = 0; // number of *correct* characters currently shown
    let deleting = false;
    let pendingMistake: string | null = null; // wrong trailing char awaiting backspace
    let timer: ReturnType<typeof setTimeout>;

    const tick = () => {
      const word = list[wordIndex];

      // A wrong character is currently on screen: backspace it, pause briefly,
      // then resume typing the correct character next tick.
      if (pendingMistake !== null) {
        pendingMistake = null;
        setText(word.slice(0, charIndex));
        setMistakeIndex(null);
        timer = setTimeout(tick, 150);
        return;
      }

      if (deleting) {
        charIndex -= 1;
        setText(word.slice(0, charIndex));
        setMistakeIndex(null);
        let delay = 45;
        if (charIndex === 0) {
          deleting = false;
          wordIndex = (wordIndex + 1) % list.length;
          delay = 400;
        }
        timer = setTimeout(tick, delay);
        return;
      }

      // Typing forward. Occasionally fat-finger the next character: show a
      // QWERTY neighbor instead, then correct it on the following ticks.
      if (
        charIndex > 0 &&
        charIndex < word.length &&
        Math.random() < MISTAKE_RATE
      ) {
        const wrong = mistakeFor(word[charIndex]);
        if (wrong) {
          pendingMistake = wrong;
          setText(word.slice(0, charIndex) + wrong);
          setMistakeIndex(charIndex);
          timer = setTimeout(tick, 250 + Math.random() * 200);
          return;
        }
      }

      charIndex += 1;
      setText(word.slice(0, charIndex));
      setMistakeIndex(null);
      let delay = 95;
      if (charIndex === word.length) {
        deleting = true;
        delay = 1400;
      }
      timer = setTimeout(tick, delay);
    };

    timer = setTimeout(tick, 600);
    return () => clearTimeout(timer);
  }, [wordsKey]);

  return { text, mistakeIndex };
}
