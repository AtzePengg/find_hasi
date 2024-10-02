'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"

const forestBackgrounds = [
  'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1500&q=80',
  'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?auto=format&fit=crop&w=1500&q=80',
  'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=1500&q=80',
  'https://images.unsplash.com/photo-1425913397330-cf8af2ff40a1?auto=format&fit=crop&w=1500&q=80',
  'https://images.unsplash.com/photo-1440342359743-84fcb8c21f21?auto=format&fit=crop&w=1500&q=80'
]

export function HiddenRabbit() {
  const [gameStarted, setGameStarted] = useState(false)
  const [gameWon, setGameWon] = useState(false)
  const [startTime, setStartTime] = useState<number | null>(null)
  const [endTime, setEndTime] = useState<number | null>(null)
  const [rabbitPosition, setRabbitPosition] = useState({ x: 0, y: 0 })
  const [backgroundIndex, setBackgroundIndex] = useState(0)
  const [difficulty, setDifficulty] = useState(1)
  const [gaveUp, setGaveUp] = useState(false)
  const imageRef = useRef<HTMLDivElement>(null)

  const startGame = () => {
    setGameStarted(true)
    setGameWon(false)
    setGaveUp(false)
    setStartTime(Date.now())
    setEndTime(null)
    setBackgroundIndex((prevIndex) => (prevIndex + 1) % forestBackgrounds.length)
    setRabbitPosition({
      x: Math.random() * 0.9 + 0.05,
      y: Math.random() * 0.9 + 0.05,
    })
  }

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!gameStarted || gameWon || gaveUp) return

    const rect = imageRef.current?.getBoundingClientRect()
    if (!rect) return

    const x = (e.clientX - rect.left) / rect.width
    const y = (e.clientY - rect.top) / rect.height

    const clickRadius = 0.03 / difficulty
    if (Math.abs(x - rabbitPosition.x) < clickRadius && Math.abs(y - rabbitPosition.y) < clickRadius) {
      setGameWon(true)
      setEndTime(Date.now())
    }
  }

  const handleGiveUp = () => {
    setGaveUp(true)
    setEndTime(Date.now())
  }

  const getTimeTaken = () => {
    if (startTime && endTime) {
      return ((endTime - startTime) / 1000).toFixed(2)
    }
    return null
  }

  useEffect(() => {
    startGame()
  }, [])

  return (
    <Card className="w-full max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">Find the Hidden Rabbit</h1>
      <div className="mb-4">
        <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700 mb-1">
          Difficulty: {difficulty}
        </label>
        <Slider
          id="difficulty"
          min={1}
          max={5}
          step={1}
          value={[difficulty]}
          onValueChange={(value) => setDifficulty(value[0])}
        />
      </div>
      <div 
        ref={imageRef} 
        className="relative w-full h-[600px] bg-cover bg-center cursor-pointer" 
        style={{backgroundImage: `url(${forestBackgrounds[backgroundIndex]})`}}
        onClick={handleClick}
      >
        {gameStarted && (gameWon || gaveUp) && (
          <div
            className="absolute bg-contain bg-no-repeat"
            style={{
              left: `${rabbitPosition.x * 100}%`,
              top: `${rabbitPosition.y * 100}%`,
              transform: 'translate(-50%, -50%)',
              backgroundImage: 'url(https://openmoji.org/data/color/svg/1F407.svg)',
              width: '48px',
              height: '48px',
              opacity: 1,
              transition: 'all 0.3s ease-in-out',
              boxShadow: '0 0 0 4px red',
              borderRadius: '50%',
            }}
          />
        )}
        {gameStarted && !gameWon && !gaveUp && (
          <div
            className="absolute bg-contain bg-no-repeat"
            style={{
              left: `${rabbitPosition.x * 100}%`,
              top: `${rabbitPosition.y * 100}%`,
              transform: 'translate(-50%, -50%)',
              backgroundImage: 'url(https://openmoji.org/data/color/svg/1F407.svg)',
              width: `${24 / difficulty}px`,
              height: `${24 / difficulty}px`,
              opacity: 0.3,
            }}
          />
        )}
      </div>
      {(gameWon || gaveUp) && (
        <div className="text-center my-4">
          {gameWon ? (
            <p className="text-xl font-semibold">You found the rabbit! 🎉</p>
          ) : (
            <p className="text-xl font-semibold">Better luck next time!</p>
          )}
          <p>Time taken: {getTimeTaken()} seconds</p>
        </div>
      )}
      <div className="flex justify-between mt-4">
        <Button onClick={startGame} className="flex-1 mr-2">
          {gameStarted && !gameWon && !gaveUp ? "Restart Game" : "Start New Game"}
        </Button>
        {gameStarted && !gameWon && !gaveUp && (
          <Button onClick={handleGiveUp} variant="outline" className="flex-1 ml-2">
            I Give Up
          </Button>
        )}
      </div>
    </Card>
  )
}