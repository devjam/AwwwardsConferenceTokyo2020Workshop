var _renderer, _mainScene, _mainCamera, _container, _material
var _mesh = []
var _current = 0
var _randomSeed = (Math.random() * 1000000) | 0

var _frame = 1000
var _fps = 100 //_frame;
var _size = 100

var _scaleSpeed = 0.05
var _colorSpeed = 0.005
var _rotationSpeed = 0.1

var _showAll = 0
var _useRandom = 0
var _usePosition = 1
var _useRotation = 1
var _useScale = 1
var _useColor = 1


class Random {
  constructor(seed = 88675123) {
    this.x = 123456789
    this.y = 362436069
    this.z = 521288629
    this.w = seed
  }

  // XorShift
  next() {
    let t

    t = this.x ^ (this.x << 11)
    this.x = this.y
    this.y = this.z
    this.z = this.w
    return (this.w = this.w ^ (this.w >>> 19) ^ (t ^ (t >>> 8)))
  }

  // min以上max以下の乱数を生成する
  nextInt(min, max) {
    const r = Math.abs(this.next())
    return min + (r % (max + 1 - min))
  }
}

// 初期設定
init()
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

  var geo = new THREE.BoxBufferGeometry(_size, _size, 0)
  for (var i = 0; i < _frame; i++) {
    var mesh = new THREE.Mesh(geo, _material)
    _container.add(mesh)
    _mesh.push(mesh)
  }

  window.addEventListener('resize', resize)
  resize()

  update()
}

function update() {
  if (_useColor) _material.color = _material.color.offsetHSL(_colorSpeed, 0, 0)

  var w = window.innerWidth - _size * 2
  var start = -w * 0.5
  var step = w / (_frame - 1 ? _frame - 1 : 1)
  var r = new Random(_randomSeed)
  for (var i = 0; i < _mesh.length; i++) {
    var mesh = _mesh[i]
    if (_usePosition) mesh.position.x = start + i * step
    else mesh.position.x = 0

    if (_useRandom)
      mesh.position.set(
        (r.nextInt(0, 1000) / 1000) * w + start,
        (r.nextInt(0, 1000) / 1000) * w + start,
        0,
      )

    if (_useRotation) mesh.rotation.z = _rotationSpeed * i

    if (_useScale)
      mesh.scale.set(Math.cos(i * _scaleSpeed) * 0.5 + 1, Math.sin(i * _scaleSpeed) * 0.5 + 1, 1)

    if (_showAll || _current == i) mesh.visible = true
    else mesh.visible = false
  }

  _current++
  _current %= _frame

  _renderer.render(_mainScene, _mainCamera)

  setTimeout(function() {
    requestAnimationFrame(update)
  }, 1000 / _fps)
}

function resize() {
  var sw = window.innerWidth
  var sh = window.innerHeight

  _mainCamera.aspect = sw / sh
  _mainCamera.updateProjectionMatrix()
  _mainCamera.position.z = (sh * 0.5) / Math.tan((_mainCamera.fov * 0.5 * Math.PI) / 180)

  _renderer.setSize(sw, sh)
}
