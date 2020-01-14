// common variables
let _renderer, _mainScene, _mainCamera, _screenWidth, _screenHeight

// define variables
let _isFirstTime = true
let _items = []
let _mouse = new THREE.Vector2(0, 0)
let _mouseBuf = new THREE.Vector2(0, 0)

// initialization
function init() {
  // make renderer
  _renderer = new THREE.WebGLRenderer({
    canvas: document.getElementsByClassName('main')[0],
    preserveDrawingBuffer: true, // keep the drawing
  })
  _renderer.setClearColor(0xffffff, 1) // background color
  _renderer.setPixelRatio(window.devicePixelRatio || 1)
  _renderer.autoClear = false // do not erase

  // make main scene
  _mainScene = new THREE.Scene()

  // make main camera
  _mainCamera = new THREE.PerspectiveCamera(40, 1, 0.1, 50000)

  // prepare some 3D objects
  for (let i = 0; i < 3; i++) {
    const mesh = makeMesh(i)
    _items.push(mesh)
  }

  window.addEventListener('mousemove', e => {
    _mouse.set(e.pageX, e.pageY)
  })

  window.addEventListener('resize', resize)
  resize()
  update()
}

// update every frame
function update() {
  // update some thing for animations
  const moveDist = _mouseBuf.distanceTo(_mouse)

  for (let i = 0, len = _items.length; i < len; i++) {
    const mesh = _items[i]
    showMesh(mesh)
    mesh.visible = moveDist > 1 // Do not display when mouse is not moving
  }

  _mouseBuf.copy(_mouse)

  // Fill background only at first
  if (_isFirstTime) {
    _isFirstTime = false
    _renderer.clear()
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
  _mainCamera.position.z = (_screenHeight * 0.5) / Math.tan((_mainCamera.fov * 0.5) * Math.PI / 180)

  _renderer.setSize(_screenWidth, _screenHeight)

  // update something

}

// some util functions
function makeMesh(key) {
  let geo
  switch (key % 3) {
    case 0:
      geo = new THREE.SphereBufferGeometry(0.5, 8, 8)
      break
    case 1:
      geo = new THREE.BoxBufferGeometry(1, 1, 1)
      break
    case 2:
      geo = new THREE.ConeBufferGeometry(0.5, 1, 32)
      break
    default:
      geo = new THREE.SphereBufferGeometry(0.5, 8, 8)
  }

  const mesh = new THREE.Mesh(
    geo,
    new THREE.MeshBasicMaterial({
      color: new THREE.Color(),
      transparent: true,
      opacity: 1,
      blending: THREE.MultiplyBlending,
    }),
  )
  _mainScene.add(mesh)

  return mesh
}

function showMesh(mesh) {
  mesh.position.x = _mouse.x - _screenWidth * 0.5
  mesh.position.y = -_mouse.y + _screenHeight * 0.5

  const offsetRange = Math.min(_screenWidth, _screenHeight) * 0.01
  mesh.position.x += random(-offsetRange, offsetRange)
  mesh.position.y += random(-offsetRange, offsetRange)

  const color = new THREE.Color(Math.random(), Math.random(), Math.random())
  mesh.material.color = color

  let scale
  if (Math.random() > 0.2) {
    scale = random(0.1, 0.5)
  } else {
    scale = random(1, Math.min(_screenWidth, _screenHeight) * 0.05)
  }
  mesh.scale.set(scale, scale, scale)

  mesh.rotation.x = radian(random(0, 360))
  mesh.rotation.y = radian(random(0, 360))
  mesh.rotation.z = radian(random(0, 360))

  mesh.material.opacity = random(0.1, 1)
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
