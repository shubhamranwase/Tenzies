import { useState, useRef, useEffect } from "react"
import Die from "./Die"
import Confetti from "react-confetti-boom"

export default function MainContent() {

    function generateAllNewDice() {
        return Array(10).fill(0).map((_, index) => {
            const randomNumber = ({
                value: Math.ceil(Math.random() * 6),
                isHeld: false,
                id: index
            })
            return randomNumber
        })
    }

    const [dice, setDice] = useState(() => generateAllNewDice())
    const [gameStarted, setGameStarted] = useState(false)
    const [rollCount, setRollCount] = useState(0)

    const gameWon = dice.every(die => die.isHeld) && dice.every(die => die.value === dice[0].value)

    const buttonText = gameWon ? ("Game Won") : (gameStarted ? "Roll Dice" : "Start Game")

    function count() {
        setRollCount(prevCount => prevCount + 1)
    }

    const buttonRef = useRef(null)
    useEffect(() => {
        if (gameWon) {
            buttonRef.current.focus()
        }
    }, [gameWon])

    const [seconds, setSeconds] = useState(0)
    const [minutes, setMinutes] = useState(0)

    useEffect(() => {
        if (gameStarted && !gameWon) {
            const timer = setInterval(() => {
                setSeconds(prevSeconds => {
                    if (prevSeconds === 59) {
                        setMinutes(prevMinutes => prevMinutes + 1)
                        return 0
                    }
                    return prevSeconds + 1
                })
            }, 1000)
            return () => clearInterval(timer)
        }
    }, [gameStarted, gameWon])

    function rollDice() {
        setGameStarted(true)
        if (gameStarted) {
            count()
        }
        if (!gameWon) {
            setDice((oldDice) => oldDice.map((die) => die.isHeld ? die : { ...die, value: Math.ceil(Math.random() * 6) }))
        } else {
            setDice(() => generateAllNewDice())
            setSeconds(0)
            setMinutes(0)
        }
    }

    function Reset() {
        setDice(() => generateAllNewDice())
        setSeconds(0)
        setMinutes(0)
        setGameStarted(false)
        setRollCount(0)
    }

    function hold(id) {
        setDice(oldDice => oldDice.map((die) => die.id === id ? { ...die, isHeld: !die.isHeld } : die
        ))
    }

    const diceElements = dice.map((diceObj, index) => <Die key={index} value={diceObj.value} isHeld={diceObj.isHeld} id={index} hold={hold} />)

    return (
        <>
            {gameWon && <Confetti mode="fall" particleCount={50} colors={['#ff577f', '#ff884b']} />}
            <main className="flex flex-col justify-center items-center">
                <p className="instructions text-white font-light text-xl w-80 h-30 text-center p-3">Roll until all dice are the same. Click each die to freeze it at its current value between rolls.</p>
                <p className="timer rounded-xl bg-amber-300 w-fit h-10 px-4 text-2xl flex items-center justify-center">{minutes < 10 ? `0${minutes}` : minutes}:{seconds < 10 ? `0${seconds}` : seconds}</p>
                <div className="container h-100 w-full mx-3 mt-6 flex flex-col items-center">
                    <div className="box p-3 bg-white rounded-2xl shadow-[0_3px_6px_rgba(0,0,0,0.16)] grid grid-cols-5 grid-rows-2 justify-items-center gap-3">
                        {diceElements}
                    </div>
                    <div className="buttons flex items-center justify-center gap-3">
                        {gameStarted && <p className="counter w-fit h-12 font-medium bg-amber-500 transition duration-400 ease-in-out text-white text-2xl py-2 px-4 rounded-xl mt-6">{rollCount}</p>}
                        <button ref={buttonRef} className="w-fit h-12 font-medium bg-amber-500 hover:bg-[rgb(255,140,0)] hover:scale-110 active:scale-95 active:bg-amber-600 transition duration-400 ease-in-out text-white text-2xl py-2 px-4 rounded-xl mt-6 cursor-pointer"
                            onClick={rollDice} >{buttonText}</button>
                        {gameStarted && <button className="w-fit h-12 font-medium bg-[rgb(255,68,68)] hover:bg-red-500 hover:scale-110 active:scale-95 active:bg-red-700 transition duration-400 ease-in-out text-white text-2xl py-2 px-4 rounded-xl mt-6 cursor-pointer"
                            onClick={Reset} >Reset</button>}
                    </div>
                </div>
            </main>
        </>
    )
}