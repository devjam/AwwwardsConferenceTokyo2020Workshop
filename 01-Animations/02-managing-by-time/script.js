let _renderer, _mainScene, _mainCamera, _container, _material, _mesh

const _size = 100
// https://greensock.com/docs/v3/Eases
let _ease = 'none'
// _ease = 'power1.in'
// _ease = 'power1.out'
// _ease = 'power1.inOut'

// CustomEase requires a plugin.
const _duration = 1.0

const _pos = {
  x: 0,
  y: 0,
}
let _offsetX = 0
let _offsetY = 0

function click(e) {
  gsap.to(_pos, { duration: _duration, ease: _ease, x: e.x + _offsetX, y: -e.y + _offsetY })
  // gsap.to(_mesh.position, { duration: _duration, ease: _ease, x: e.x + _offsetX, y: -e.y + _offsetY})
}

function update() {
  _mesh.position.x = _pos.x
  _mesh.position.y = _pos.y

  _renderer.render(_mainScene, _mainCamera)

  requestAnimationFrame(update)
}

function resize() {
  const sw = window.innerWidth
  const sh = window.innerHeight

  _mainCamera.aspect = sw / sh
  _mainCamera.updateProjectionMatrix()
  _mainCamera.position.z = (sh * 0.5) / Math.tan((_mainCamera.fov * 0.5 * Math.PI) / 180)

  _renderer.setSize(sw, sh)

  _offsetX = -sw * 0.5
  _offsetY = sh * 0.5
}

function init() {
  _renderer = new THREE.WebGLRenderer({
    canvas: document.getElementsByClassName('main')[0],
  })
  _renderer.setClearColor(0xe1e1e3, 1)
  _renderer.setPixelRatio(window.devicePixelRatio || 1)

  _mainScene = new THREE.Scene()
  _mainCamera = new THREE.PerspectiveCamera(80, 1, 0.1, 50000)

  _container = new THREE.Object3D()
  _mainScene.add(_container)

  _material = new THREE.MeshBasicMaterial({
    color: new THREE.Color(0x00e1e1).offsetHSL(Math.random(), 0, 0),
  })

  _mesh = new THREE.Mesh(new THREE.BoxBufferGeometry(_size, _size, 0), _material)
  _container.add(_mesh)

  window.addEventListener('resize', resize)
  resize()

  window.addEventListener('click', click)

  update()
}

init()