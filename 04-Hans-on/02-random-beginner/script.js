// common variables
// can use them inside init, update and resize functions
let _renderer, _mainScene, _mainCamera, _screenWidth, _screenHeight

// define variables
let _items = []

// initialization
function init() {
  _renderer.setClearColor(0x000000, 1)
  // prepare some 3D objects
  for (let i = 0; i < 50; i++) {
    const mesh = makeMesh()
    _items.push({
      mesh: mesh,
      noise: random(1, 3), // use for speed & position y
    })
    mesh.position.x = random(-_screenWidth * 0.4, _screenWidth * 1.5)
  }
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

    // reset when disappearing from screen
    if (mesh.position.x < -_screenWidth) {
      resetMesh(mesh)
    }
  }
}

// update something when window resized
function resize() {
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

  // randomly choose from three color
  mesh.material.color = new THREE.Color(randomArr([0xffffff, 0xdd3c03, 0x6b6a66]))
  // #### change sample ####
  // mesh.material.color = new THREE.Color(Math.random(), Math.random(), Math.random())
  // #######################

  if (Math.random() > 0.3) {
    mesh.scale.x = random(1, 3)
  } else {
    // very small
    mesh.scale.x = random(1, _screenWidth * 0.1)
  }
  mesh.scale.y = random(_screenHeight * 0.6, _screenHeight)

  mesh.position.x = random(_screenWidth * 1, _screenWidth * 2)
  mesh.position.y = 0

  // #### change sample ####
  // mesh.rotation.z = radian(random(-30, 30))
  // #######################
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
