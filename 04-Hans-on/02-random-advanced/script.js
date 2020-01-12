// common variables
let _renderer, _mainScene, _mainCamera, _screenWidth, _screenHeight

// define variables
let _items = []

// initialization
function init() {
  // make renderer
  _renderer = new THREE.WebGLRenderer({
    canvas: document.getElementsByClassName('main')[0],
    preserveDrawingBuffer: true,
  })
  _renderer.setClearColor(0x000000, 1) // background color
  _renderer.setPixelRatio(window.devicePixelRatio || 1)

  // make main scene
  _mainScene = new THREE.Scene()

  // make main camera
  _mainCamera = new THREE.PerspectiveCamera(40, 1, 0.1, 50000)

  // prepare some 3D objects
  _screenWidth = window.innerWidth
  _screenHeight = window.innerHeight

  for (let i = 0; i < 50; i++) {
    const mesh = makeMesh()
    _items.push({
      mesh: mesh,
      noise: random(1, 3),
    })
    mesh.position.x = random(-_screenWidth * 0.4, _screenWidth * 1.5)
  }

  window.addEventListener('resize', resize)
  resize()
  update()
}

// update every frame
function update() {
  // update some thing for animations
  for (let i = 0, len = _items.length; i < len; i++) {
    const item = _items[i]
    const noise = item.noise
    const mesh = item.mesh

    mesh.position.x -= noise

    // mesh.scale.y = _screenHeight;
    if (noise >= 2) {
      mesh.position.y = _screenHeight * 0.5 - mesh.scale.y * 0.5
    } else {
      mesh.position.y = -_screenHeight * 0.5 + mesh.scale.y * 0.5
    }

    if (mesh.position.x < -_screenWidth) {
      resetMesh(mesh)
    }
  }

  // rendering
  _renderer.render(_mainScene, _mainCamera)

  window.requestAnimationFrame(update)
}

// update something when window resized
function resize() {
  _screenWidth = window.innerWidth
  _screenHeight = window.innerHeight

  // camera settings for to be actual size
  _mainCamera.aspect = _screenWidth / _screenHeight
  _mainCamera.updateProjectionMatrix()
  _mainCamera.position.z = _screenHeight / Math.tan((_mainCamera.fov * Math.PI) / 360) / 2

  _renderer.setSize(_screenWidth, _screenHeight)

  // update something
}

// some util functions
function makeMesh() {
  const mesh = new THREE.Mesh(new THREE.PlaneBufferGeometry(1, 1), new THREE.MeshBasicMaterial())
  _mainScene.add(mesh)

  resetMesh(mesh)

  return mesh
}

function resetMesh(mesh) {
  mesh.material.color = new THREE.Color(randomArr([0xffffff, 0xdd3c03, 0x6b6a66]))

  if (Math.random() > 0.3) {
    mesh.scale.x = random(1, 3)
  } else {
    mesh.scale.x = random(1, _screenWidth * 0.1)
  }
  mesh.scale.y = random(_screenHeight * 0.6, _screenHeight)

  mesh.position.x = random(_screenWidth * 1, _screenWidth * 2)
  mesh.position.y = 0
}

function mix(x, y, a) {
  return x * (1 - a) + y * a
}

function random(min, max) {
  return Math.random() * (max - min) + min
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function radian(val) {
  return (val * Math.PI) / 180
}

function randomArr(arr) {
  return arr[randomInt(0, arr.length - 1)]
}

init()
