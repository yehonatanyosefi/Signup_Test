import { useEffect, useState, useRef } from "react"

export const AnimateWord = ({ word }) => {
  const [animatedWord, setAnimatedWord] = useState(word)
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
  const lowercaseLetters = "abcdefghijklmnopqrstuvwxyz"
  const intervalRef = useRef()

  useEffect(() => {
    clearInterval(intervalRef.current)

    let iteration = 0
    intervalRef.current = setInterval(() => {
      setAnimatedWord((prevWord) =>
        prevWord
          .split("")
          .map((letter, index) => {
               if (index < iteration) return word[index]
               if (letter === letter.toUpperCase()) return letters[Math.floor(Math.random() * 26)]
               return lowercaseLetters[Math.floor(Math.random() * 26)]
          })
          .join("")
      )

      if (iteration >= word.length) {
        clearInterval(intervalRef.current)
      }

      iteration += 1 / 3
    }, 30)

    return () => {
      clearInterval(intervalRef.current)
    }
  }, [word])

  return animatedWord
}