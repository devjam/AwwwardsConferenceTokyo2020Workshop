let _renderer, _mainScene, _mainCamera, _container, _material

const _mesh = []
const _randomSeed = (Math.random() * 1000000) | 0
const _size = 100

let _current = 0

const _params = {
  frame: 1000,
  fps: 12,
  
  rotationSpeed: 0.1,
  scaleSpeed: 0.05,
  colorSpeed: 0.005,

  showAll: true,
  useRandom: false,
  usePosition: true,
  useRotation: false,
  useScale: false,
  useColor: false,
}

const gui = new dat.GUI()

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
    blending: THREE.NormalBlending,
    transparent: true,
    opacity: 0.5,
  })

  const geo = new THREE.BoxBufferGeometry(_size, _size, 0)
  for (var i = 0; i < _params.frame; i++) {
    var mesh = new THREE.Mesh(geo, _material)
    _container.add(mesh)
    _mesh.push(mesh)
  }

  _params.frame = 2
  // dat.gui
  gui.add(_params, 'frame', 1, 1000, 1)
  gui.add(_params, 'fps', 1, 100, 1)

  gui.add(_params, 'showAll')
  gui.add(_params, 'useRandom')
  gui.add(_params, 'usePosition')

  gui.add(_params, 'useRotation')
  gui.add(_params, 'rotationSpeed', 0.01, 0.5, 0.01)

  gui.add(_params, 'useScale')
  gui.add(_params, 'scaleSpeed', 0.005, 0.5, 0.01)

  gui.add(_params, 'useColor')
  gui.add(_params, 'colorSpeed', 0.001, 0.01, 0.001)

  window.addEventListener('resize', resize)
  resize()

  update()
}

function update() {
  if (_params.useColor) _material.color = _material.color.offsetHSL(_params.colorSpeed, 0, 0)

  const w = window.innerWidth - _size * 2
  const start = -w * 0.5
  const step = w / (_params.frame - 1 ? _params.frame - 1 : 1)

  const r = new Random(_randomSeed)
  for (let i = 0; i < _mesh.length; i++) {
    const mesh = _mesh[i]
    if (_params.usePosition) mesh.position.x = start + i * step
    else mesh.position.x = 0

    if (_params.useRandom) {
      if(i == 0 || i == _params.frame - 1) {
        mesh.position.x = _params.usePosition ? start + i * step : 0
        mesh.position.y = 0
      } else {
        mesh.position.x = _params.usePosition ? start + i * step : (r.nextInt(0, 1000) / 1000) * w + start
        mesh.position.y = (r.nextInt(0, 1000) / 1000) * w + start
      }
    } else {
      mesh.position.y = 0
    }

    if (_params.useRotation) mesh.rotation.z = _params.rotationSpeed * i
    else mesh.rotation.z = 0

    if (_params.useScale)
      mesh.scale.set(Math.cos(i * _params.scaleSpeed) * 0.5 + 1, Math.sin(i * _params.scaleSpeed) * 0.5 + 1, 1)
    else
      mesh.scale.set(1,1,1) 

    if (i < _params.frame && (_params.showAll || _current == i)) mesh.visible = true
    else mesh.visible = false
  }

  _current++
  _current %= _params.frame

  _renderer.render(_mainScene, _mainCamera)

  setTimeout(function() {
    requestAnimationFrame(update)
  }, 1000 / _params.fps)
}

function resize() {
  var sw = window.innerWidth
  var sh = window.innerHeight

  _mainCamera.aspect = sw / sh
  _mainCamera.updateProjectionMatrix()
  _mainCamera.position.z = (sh * 0.5) / Math.tan((_mainCamera.fov * 0.5 * Math.PI) / 180)

  _renderer.setSize(sw, sh)
}
