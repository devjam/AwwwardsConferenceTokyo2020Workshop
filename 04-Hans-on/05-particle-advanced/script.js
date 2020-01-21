// common variables
let _renderer, _mainScene, _mainCamera, _screenWidth, _screenHeight

// define variables
const _mouse = { x: 80, y: -300 }
const _particles = []

const _distance = 100
const _amount = {
  x: 100,
  y: 100,
}

let _cnt = 0

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
  _mainScene.fog = new THREE.Fog(0x000000, 100, 5000)

  // make main camera
  _mainCamera = new THREE.PerspectiveCamera(40, 1, 0.1, 50000)

  // prepare some 3D objects
  const geometry = new THREE.CircleGeometry(3, 32)
  const material = new THREE.MeshBasicMaterial({
    color: new THREE.Color(0xffffff),
  })

  const centerX = _amount.x * _distance * 0.5
  const centerY = _amount.y * _distance * 0.5
  let i = 0
  for (let ix = 0; ix < _amount.x; ix++) {
    for (let iy = 0; iy < _amount.y; iy++) {
      const particle = (_particles[i++] = new THREE.Mesh(geometry, material))
      particle.position.x = ix * _distance - centerX
      particle.position.z = iy * _distance - centerY
      _mainScene.add(particle)
    }
  }

  window.addEventListener('mousemove', onMouseMove, false)

  window.addEventListener('resize', resize)
  resize()
  update()
}

// update every frame
function update() {
  // update some thing for animations
  _mainCamera.position.x += (_mouse.x - _mainCamera.position.x) * 0.05
  _mainCamera.position.y += (-_mouse.y - _mainCamera.position.y) * 0.05
  _mainCamera.lookAt(_mainScene.position)

  let i = 0
  for (let ix = 0; ix < _amount.x; ix++) {
    for (let iy = 0; iy < _amount.y; iy++) {
      const particle = _particles[i++]
      particle.position.y =
        Math.sin(ix * 0.3 + _cnt * 0.1) * 50 + Math.sin(iy * 0.3 + _cnt * 0.1) * 50
      particle.scale.x = particle.scale.y =
        Math.sin((ix * 0.3 + _cnt * 0.1) * 0.5) + Math.sin((iy * 0.3 + _cnt * 0.1) * 0.5)
    }
  }

  _cnt++

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
function onMouseMove(event) {
  _mouse.x = event.clientX - _screenWidth * 0.5
  _mouse.y = event.clientY - _screenHeight * 0.5
}

init()
