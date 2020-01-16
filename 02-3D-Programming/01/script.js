let _renderer, _mainScene, _mainCamera, _screenWidth, _screenHeight

let _light, _material
let _mesh = []
let _now = 0
let _cnt = 0
let _noise = 0

// initialization
function init() {

  // make material
  // can be reused
  _material = new THREE.MeshPhongMaterial({
    color: 0xffffff, // color when light hits
    side: THREE.DoubleSide,
  })

  // box geometry and mesh
  const geoA = new THREE.BoxBufferGeometry(1, 1, 1, 8, 8, 8)
  const meshA = new THREE.Mesh(geoA, _material)
  _mesh.push(meshA)

  // Torus gerometry and mesh
  const geoB = new THREE.TorusBufferGeometry(0.75, 0.2, 8, 20)
  const meshB = new THREE.Mesh(geoB, _material)
  _mesh.push(meshB)

  // octahedron geometry and mesh
  const geoC = new THREE.OctahedronBufferGeometry(0.75, 0)
  const meshC = new THREE.Mesh(geoC, _material)
  _mesh.push(meshC)

  // make main scene
  _mainScene = new THREE.Scene()

  // add mesh to the scene
  _mainScene.add(meshA)
  _mainScene.add(meshB)
  _mainScene.add(meshC)

  // make light
  _light = new THREE.PointLight(
    0xffffff, // light color
    0.5, // light strength
  )
  _mainScene.add(_light)

  // make main camera
  _mainCamera = new THREE.PerspectiveCamera(80, 1, 0.1, 50000)

  // make renderer
  _renderer = new THREE.WebGLRenderer({
    canvas: document.getElementsByClassName('main')[0],
    preserveDrawingBuffer: true,
  })
  _renderer.setClearColor(0xe1e1e3, 1) // background color
  _renderer.setPixelRatio(window.devicePixelRatio || 1)

  change()

  window.addEventListener('resize', resize)
  resize()
  update()
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
  const size = Math.min(_screenWidth, _screenHeight) * 0.25
  _mesh[0].scale.set(size, size, size)
  _mesh[1].scale.set(size, size, size)
  _mesh[2].scale.set(size, size, size)
}


// update every frame
function update() {
  // update some thing for animations
  _noise += (0 - _noise) * 0.6

  // when _noise > 0
  // randomize color
  const color = new THREE.Color(0xffffff)
  _material.color = color.lerp(new THREE.Color(Math.random(), Math.random(), Math.random()), _noise * 30)

  if (_noise >= 0.0001) {
    // alternate between true and false
    if (_cnt % 4 == 0) {
      _material.wireframe = !_material.wireframe
    }
  } else {
    _material.wireframe = false
  }

  // udpate camera position and look at container
  const radian = new Date().getTime() * 0.002 * mix(1, 1.001, _noise)
  const radius = Math.min(_screenWidth, _screenHeight) * 0.5
  _mainCamera.position.x = Math.sin(radian) * radius
  _mainCamera.position.z = Math.cos(radian) * radius
  _mainCamera.lookAt(new THREE.Vector3(0, 0, 0))

  // update light position
  _light.position.copy(_mainCamera.position)
  _light.position.y += _screenHeight * 0.25

  // change 3D object
  if (_cnt % 120 == 0) {
    change()
  }

  _cnt++

  // rendering
  _renderer.render(_mainScene, _mainCamera)

  window.requestAnimationFrame(update)
}


// change mesh
function change() {

  // show only one
  for (let i = 0, len = _mesh.length; i < len; i++) {
    _mesh[i].visible = (i == _now)
  }
  _now++
  if (_now >= _mesh.length) {
    _now = 0
  }

  // angle randomly
  _mesh[0].rotation.set(
    Math.random() * 360 * (Math.PI / 180),
    Math.random() * 360 * (Math.PI / 180),
    Math.random() * 360 * (Math.PI / 180)
  )
  _mesh[1].rotation.set(
    Math.random() * 360 * (Math.PI / 180),
    Math.random() * 360 * (Math.PI / 180),
    Math.random() * 360 * (Math.PI / 180)
  )
  _mesh[2].rotation.set(
    Math.random() * 360 * (Math.PI / 180),
    Math.random() * 360 * (Math.PI / 180),
    Math.random() * 360 * (Math.PI / 180)
  )

  // parameter for replacing effect
  _noise = 1
}

function mix(x, y, a) {
  return x * (1 - a) + y * a
}

init()
