import "createjs-libs"

const files = [
  "bass1.mp3",
  "bass2.mp3",
  "bass3.mp3",
  "bass4.mp3",
  "bd.mp3",
  "chord.mp3",
  "halfbd.mp3",
  "hh.mp3",
  "sunrise.mp3",
  "sweep.mp3",
  "trance.mp3",
  "wood.mp3",
] as const

export function preload(cb: () => void) {
  const audioLoadQueue = new createjs.LoadQueue()
  audioLoadQueue.installPlugin(createjs.Sound)
  audioLoadQueue.on("complete", cb)

  files.forEach((file) => {
    audioLoadQueue.loadFile({ src: `./audio/${file}`, id: file })
  })
}

export function play(file: typeof files[number]) {
  createjs.Sound.play(file)
}
