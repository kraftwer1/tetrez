import * as THREE from "three"
import { MeshLambertMaterial } from "three"
import { config } from "./config"
import { forEachBlock } from "./field"
import { Queue } from "./Queue"

const geometryCache = new THREE.BoxGeometry(1, 1, 1)
const materialCache: Record<string, MeshLambertMaterial> = {}

let scene: THREE.Scene
let camera: THREE.OrthographicCamera
let renderer: THREE.WebGLRenderer
let group: THREE.Group

let xRotationQueue: Queue<number>
let yRotationQueue: Queue<number>

let rotationStep: number

// Keep references to the lastly rendered meshs blocks
// so they can be garbage collected later
const lastMeshes: THREE.Mesh[] = []

function render() {
  const nextXRotationTarget = xRotationQueue.getCurrent()
  const nextYRotationTarget = yRotationQueue.getCurrent()

  if (nextXRotationTarget) {
    if (Math.abs(group.rotation.x - nextXRotationTarget) < 0.01) {
      xRotationQueue.pop()
    } else if (group.rotation.x > nextXRotationTarget) {
      group.rotation.x -= rotationStep
    } else {
      group.rotation.x += rotationStep
    }
  }

  if (nextYRotationTarget) {
    if (Math.abs(group.rotation.y - nextYRotationTarget) < 0.01) {
      yRotationQueue.pop()
    } else if (group.rotation.y > nextYRotationTarget) {
      group.rotation.y -= rotationStep
    } else {
      group.rotation.y += rotationStep
    }
  }

  renderer.render(scene, camera)
  requestAnimationFrame(render)
}

export function paint() {
  // Garbage collection (remove all existing meshes from scene)
  for (let i = lastMeshes.length - 1; i >= 0; --i) {
    group.remove(lastMeshes[i])
    lastMeshes.splice(lastMeshes.indexOf(lastMeshes[i]), 1)
  }

  forEachBlock((block, rowIndex, blockIndex) => {
    if (!block.occupation) return

    if (!materialCache[block.color]) {
      materialCache[block.color] = new THREE.MeshLambertMaterial({
        color: block.color,
      })
    }

    const mesh = new THREE.Mesh(geometryCache, materialCache[block.color])
    mesh.translateX(-config.dimension.x / 2 - 0.5 + blockIndex)
    mesh.translateY(config.dimension.y / 2 - 0.5 - rowIndex)

    group.add(mesh)
    lastMeshes.push(mesh)
  })
}

export function isFrontSideBack() {
  const currentRelativeRotation = group.rotation.y % (Math.PI * 2)

  return (
    currentRelativeRotation >= Math.PI / 2 &&
    currentRelativeRotation < Math.PI * 1.5
  )
}

export function rotateView(rotation: { x?: number; y?: number }) {
  const lastXRotation = xRotationQueue.getLastPopped() || 0
  const lastYRotation = yRotationQueue.getLastPopped() || 0

  if (rotation.x) {
    xRotationQueue.push(lastXRotation + rotation.x)
  }

  if (rotation.y) {
    yRotationQueue.push(lastYRotation + rotation.y)
  }
}

export function initView() {
  const aspectRatio = innerWidth / innerHeight

  scene = new THREE.Scene()
  camera = new THREE.OrthographicCamera()

  camera.right = (aspectRatio * config.dimension.y) / 2
  camera.left = -camera.right
  camera.top = config.dimension.y / 2
  camera.bottom = -camera.top

  camera.position.z = config.dimension.y

  // Horizontal positioning
  camera.position.x = -1

  camera.updateProjectionMatrix()

  renderer = new THREE.WebGLRenderer({
    canvas: document.getElementById("canvas")!,
    antialias: true,
  })

  renderer.setSize(innerWidth, innerHeight)
  renderer.setClearColor(0x000000)
  renderer.setPixelRatio(devicePixelRatio || 1)

  group = new THREE.Group()
  scene.add(group)

  const ambientLight = new THREE.AmbientLight(0xffffff)
  scene.add(ambientLight)

  // Light from above
  const directionalLight = new THREE.DirectionalLight(0xffffff)
  directionalLight.position.y = config.dimension.y
  scene.add(directionalLight)

  xRotationQueue = new Queue()
  yRotationQueue = new Queue()
  rotationStep = (Math.PI * 2) / 2500

  // Initial render
  render()
}
