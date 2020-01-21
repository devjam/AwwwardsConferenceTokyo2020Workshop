let _renderer, _mainScene, _mainCamera, _container, _material, _mesh

const _baseSpeed = 3
const _size = 100
const _speed = {
  x: Math.random() * 2 - 1,
  y: Math.random() * 2 - 1,
}

const _step = 0.05
let _count = 0

let _left = 0
let _right = 0
let _bottom = 0
let _top = 0

const _useLines = false
let _lineX
let _lineY


function update() {
  _mesh.position.x += _speed.x * _baseSpeed
  _mesh.position.y += _speed.y * _baseSpeed

  // _mesh.position.x = Math.cos(0 * (Math.PI / 180)) * 200
  // _mesh.position.y = Math.sin(0 * (Math.PI / 180)) * 200

  // _mesh.position.x = Math.cos(_count) * 200
  // _mesh.position.y = Math.sin(_count) * 200

  // _speed.x = Math.cos(_count)
  // _speed.y = Math.sin(_count)

  // _speed.x += (Math.random() - 0.5) * 2
  // _speed.y += (Math.random() - 0.5) * 2
 
  // if(_speed.x < -5) _speed.x = -5
  // if(_speed.x > 5) _speed.x = 5
  // if(_speed.y < -5) _speed.y = -5
  // if(_speed.y > 5) _speed.y = 5

  // _count += _step

  if (_left > _mesh.position.x) {
    _mesh.position.x = _left
    _speed.x *= -1
  }
  if (_right < _mesh.position.x) {
    _mesh.position.x = _right
    _speed.x *= -1
  }
  if (_bottom > _mesh.position.y) {
    _mesh.position.y = _bottom
    _speed.y *= -1
  }
  if (_top < _mesh.position.y) {
    _mesh.position.y = _top
    _speed.y *= -1
  }

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

  _left = -sw * 0.5 + _size * 0.5
  _right = -_left
  _bottom = -sh * 0.5 + _size * 0.5
  _top = -_bottom


  if(_useLines) {
    _lineX.geometry.vertices[0].x = _left
    _lineX.geometry.vertices[1].x = _right
    _lineY.geometry.vertices[0].y = _top
    _lineY.geometry.vertices[1].y = _bottom
  }
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

  if(_useLines) {
    const material = new THREE.LineBasicMaterial({ color: 0x000000 })
    let geometry = new THREE.Geometry()
    geometry.vertices.push(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, 0))
    _lineX = new THREE.Line(geometry, material)
    _container.add(_lineX)
    geometry = new THREE.Geometry()
    geometry.vertices.push(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, 0))
    _lineY = new THREE.Line(geometry, material)
    _container.add(_lineY)
  }

  window.addEventListener('resize', resize)
  resize()

  update()
}

init()