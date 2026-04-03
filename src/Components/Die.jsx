export default function Die(props) {

    const backgroundColor = props.isHeld ? "bg-green-400" : "bg-amber-200"

    return (
        <>
            <button className={`die ${backgroundColor} bg-amber-200 flex justify-center items-center rounded-2xl shadow-[0_3px_6px_rgba(0,0,0,0.16)] h-20 w-fulln aspect-square active:scale-95 active:bg-gray-300 hover:scale-105 transition duration-400 ease-in-out text-3xl font-bold  text-gray-700 cursor-pointer`}
                onClick={() => props.hold(props.id)}>
                {props.value}
            </button>
        </>
    )
}