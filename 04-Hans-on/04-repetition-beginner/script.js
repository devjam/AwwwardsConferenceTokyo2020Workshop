// common variables
// can use them inside init, update and resize functions
let _renderer, _mainScene, _mainCamera, _screenWidth, _screenHeight

// define variables
let _container
let _items = []
let _interval = 10
let _cnt = 0
let _noiseCnt = 0

// initialization
function init() {
  _renderer.setClearColor(0x000000, 1)
  // prepare some 3D objects
  _container = new THREE.Object3D()
  _mainScene.add(_container)

  for (let i = 0; i < 20; i++) {
    const mesh = makeMesh(i)
    _items.push({
      mesh: mesh,
      key: i,
    })
    _container.add(mesh)
  }
}

// update every frame
function update() {
  // update some thing for animations
  const radius = Math.min(_screenWidth, _screenHeight) * 0.5
  const blockSize = radius * 0.1

  for (let i = 0, len = _items.length; i < len; i++) {
    const item = _items[i]
    const key = item.key
    const mesh = item.mesh

    const rad = radian(_cnt + key * _interval)
    mesh.position.x = Math.sin(rad) * radius
    mesh.position.z = Math.cos(rad) * radius

    if (_noiseCnt > 0) {
      // random position & size & opacity
      mesh.scale.set(
        random(blockSize * 0.01, blockSize),
        random(blockSize * 0.01, radius),
        random(blockSize * 0.01, blockSize),
      )
      mesh.position.y = random(-mesh.scale.y, mesh.scale.y)
      mesh.material.opacity = random(0, 1)
    } else {
      mesh.scale.set(blockSize, radius, blockSize)
      mesh.position.y = 0
      mesh.material.opacity = 1
    }
  }
  _noiseCnt--

  if (_cnt % 90 == 0) {
    reset()
  }
  _cnt++
}

// update something when window resized
function resize() {
  // update something
}

// some util functions
function makeMesh(key) {
  const seg = randomInt(1, 8)

  const mesh = new THREE.Mesh(
    new THREE.BoxBufferGeometry(1, 1, 1, seg, seg, seg),
    new THREE.MeshBasicMaterial({
      color: new THREE.Color(0xff0000),
      transparent: true,
      opacity: 1,
    }),
  )

  return mesh
}

function reset() {
  const color = new THREE.Color(Math.random(), Math.random(), Math.random());
  const gray = new THREE.Color(0x333333)
  const white = new THREE.Color(0xffffff)

  for (let i = 0, len = _items.length; i < len; i++) {
    const mesh = _items[i].mesh
    mesh.material.wireframe = Math.random() > 0.7

    if (Math.random() > 0.6) {
      if (Math.random() > 0.5) {
        mesh.material.color = gray
      } else {
        mesh.material.color = white
      }
    } else {
      mesh.material.color = color
    }
  }

  _container.rotation.x = radian(random(-90, 90))
  _container.rotation.y = radian(random(-90, 90))
  _container.rotation.z = radian(random(-90, 90))

  _interval = random(8, 20)

  _noiseCnt = 15
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
