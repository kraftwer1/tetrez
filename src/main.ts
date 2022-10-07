import { config } from "./config"
import { preload } from "./audio"
import { initController } from "./controller"

function initGame() {
  screenEl.addEventListener("transitionend", function onTransitionEnd() {
    screenEl.style.display = "none"
    playEl.style.display = "none"

    screenEl.removeEventListener("transitionend", onTransitionEnd)
  })

  screenEl.classList.add("transparent")

  // This starts the actual game
  initController()

  // Make sure the game can be started only once
  screenEl.removeEventListener("click", initGame)
}

const screenEl = document.getElementById("screen")!
const loadingEl = document.getElementById("loading")!
const playEl = document.getElementById("play")!
const gameOverEl = document.getElementById("gameOver")!

// Game can be restarted on game over
gameOverEl.addEventListener("click", () => {
  location.reload()
})

preload(() => {
  screenEl.addEventListener("click", initGame)

  loadingEl.style.display = "none"
  playEl.style.display = "block"

  if (config.debugMode) {
    // This setTimeout() is necessary because of a bug in macOS Safari,
    // where the canvas sometimes does not have a height of 100% because the
    // window.innerHeight variable isn't initialized, yet
    setTimeout(function () {
      screenEl.click()
    }, 100)
  }
})
