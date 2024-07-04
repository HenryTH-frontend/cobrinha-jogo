const canvas = document.querySelector("canvas")
const ctx = canvas.getContext("2d")

// Definir tamanho do canvas com base no dispositivo
const setCanvasSize = () => {
    if (window.innerWidth <= 768) {
        // Dispositivos móveis
        canvas.width = 330
        canvas.height = 330
    } else {
        // Desktop
        canvas.width = 450
        canvas.height = 450
    }
}

// Chama a função para definir o tamanho do canvas ao carregar a página
setCanvasSize()

const score = document.querySelector(".score-value")
const finalScore = document.querySelector(".final-score > span")
const menu = document.querySelector(".menu-screen")
const buttonPlay = document.querySelector(".btn-play")
const buttonUp = document.querySelector(".btn-up")
const buttonDown = document.querySelector(".btn-down")
const buttonRight = document.querySelector(".btn-right")
const buttonLeft = document.querySelector(".btn-left")

const audio = new Audio('../assets/audio.mp3')

const size = 30

const initialPosition = { x: Math.floor(canvas.width / 2 / size) * size, y: Math.floor(canvas.height / 2 / size) * size } 

let snake = [initialPosition]

const incrementScore = () => {
    score.innerText = parseInt(score.innerText) + 10
}

const randomNumber = (min, max) => {
    return Math.round(Math.random() * (max - min) + min)
}

const randomPosition = () => {
    const number = randomNumber(0, canvas.width - size)
    return Math.round(number / size) * size
}

const randomColor = () => {
    const red = randomNumber(0, 255)
    const green = randomNumber(0, 255)
    const blue = randomNumber(0, 255)

    return `rgb(${red}, ${green}, ${blue})`
}

const food = {
    x: randomPosition(),
    y: randomPosition(),
    color: randomColor()
}

let direction, loopId

const drawFood = () => {
    const { x, y, color } = food

    ctx.shadowColor = color
    ctx.shadowBlur = 8
    ctx.fillStyle = color
    ctx.fillRect(x, y, size, size)
    ctx.shadowBlur = 0
}

const drawSnake = () => {
    ctx.fillStyle = "#ddd"

    snake.forEach((position, index) => {
        if (index === snake.length - 1) {
            ctx.fillStyle = "white"
        }

        ctx.fillRect(position.x, position.y, size, size)
    })
}

const moveSnake = () => {
    if (!direction) return

    const head = snake[snake.length - 1]

    if (direction === "right") {
        snake.push({ x: head.x + size, y: head.y })
    }

    if (direction === "left") {
        snake.push({ x: head.x - size, y: head.y })
    }

    if (direction === "down") {
        snake.push({ x: head.x, y: head.y + size })
    }

    if (direction === "up") {
        snake.push({ x: head.x, y: head.y - size })
    }

    snake.shift()
}

const drawGrid = () => {
    ctx.lineWidth = 1
    ctx.strokeStyle = "#191919"

    for (let i = size; i < canvas.width; i += size) {
        ctx.beginPath()
        ctx.lineTo(i, 0)
        ctx.lineTo(i, canvas.height)
        ctx.stroke()

        ctx.beginPath()
        ctx.lineTo(0, i)
        ctx.lineTo(canvas.width, i)
        ctx.stroke()
    }
}

const chackEat = () => {
    const head = snake[snake.length - 1]

    if (head.x === food.x && head.y === food.y) {
        incrementScore()
        snake.push(head)
        audio.play()

        let x = randomPosition()
        let y = randomPosition()

        while (snake.find((position) => position.x === x && position.y === y)) {
            x = randomPosition()
            y = randomPosition()
        }

        food.x = x
        food.y = y
        food.color = randomColor()
    }
}

const checkCollision = () => {
    const head = snake[snake.length - 1]
    const canvasLimit = canvas.width - size
    const neckIndex = snake.length - 2

    const wallCollision = 
        head.x < 0 || head.x > canvasLimit || head.y < 0 || head.y > canvasLimit

    const selfCollision = snake.find((position, index) => {
        return index < neckIndex && position.x === head.x && position.y === head.y
    })

    if (wallCollision || selfCollision) {
        gameOver()
    }
}

const gameOver = () => {
    direction = undefined

    menu.style.display = "flex"
    finalScore.innerText = score.innerText
    canvas.style.filter = "blur(3px)"
    clearTimeout(loopId)
}

const gameLoop = () => {
    clearTimeout(loopId)

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    drawGrid()
    drawFood()
    moveSnake()
    drawSnake()
    chackEat()
    checkCollision()

    loopId = setTimeout(() => {
        gameLoop()
    }, 250)
}

gameLoop()

document.addEventListener("keydown", (event) => {
    const key = event.key

    if (key === "ArrowRight" && direction !== "left") {
        direction = "right"
    }

    if (key === "ArrowLeft" && direction !== "right") {
        direction = "left"
    }

    if (key === "ArrowDown" && direction !== "up") {
        direction = "down"
    }

    if (key === "ArrowUp" && direction !== "down") {
        direction = "up"
    }
})
buttonUp.addEventListener("click", () => {
    direction = "up"
})
buttonDown.addEventListener("click", () => {
    direction = "down"
})
buttonLeft.addEventListener("click", () => {
    direction = "left"
})
buttonRight.addEventListener("click", () => {
    direction = "right"
})

buttonPlay.addEventListener("click", () => {
    score.innerText = "00"
    menu.style.display = "none"
    canvas.style.filter = "none"

    snake = [initialPosition] // Reinicializa a posição da cobra
    direction = undefined // Reinicia a direção
    gameLoop() // Inicia o loop do jogo novamente
})

// Adicionar um evento para redimensionar o canvas se a janela for redimensionada
window.addEventListener('resize', setCanvasSize)
//JavaScript