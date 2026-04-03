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

    const gameWon = dice.every(die => die.isHeld) && dice.every(die => die.value === dice[0].value)
    const buttonText = gameWon ? "New Game" : "Roll Dice"

    const buttonRef = useRef(null)
    useEffect(() => {
        if (gameWon) {
            buttonRef.current.focus()
        }
    }, [gameWon])

    function rollDice() {
        if (!gameWon) {
            setDice((oldDice) => oldDice.map((die) => die.isHeld ? die : { ...die, value: Math.ceil(Math.random() * 6) }))
        } else {
            setDice(() => generateAllNewDice())
        }
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
                <div className="container h-100 w-120 md:mx-10 flex flex-col items-center">
                    <div className="box p-3 bg-white rounded-2xl shadow-[0_3px_6px_rgba(0,0,0,0.16)] grid grid-cols-5 grid-rows-2 justify-items-center gap-3">
                        {diceElements}
                    </div>
                    <button ref={buttonRef} className="w-32 h-12 font-medium bg-amber-500 hover:bg-amber-600 hover:scale-110 active:scale-95 active:bg-amber-700 transition duration-400 ease-in-out text-white text-xl py-2 px-4 rounded-xl mt-6"
                        onClick={rollDice} >{buttonText}</button>
                </div>
            </main>
        </>
    )
}