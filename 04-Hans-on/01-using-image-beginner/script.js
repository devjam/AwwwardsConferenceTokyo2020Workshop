// common variables
// can use them inside init, update and resize functions
let _renderer, _mainScene, _mainCamera, _screenWidth, _screenHeight

// define variables
let _cnt = 0
let _img
let _items = []

// initialization
function init() {
  // prepare some 3D objects
  // image object
  _img = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(1, 1),
    new THREE.MeshBasicMaterial({
      map: new THREE.TextureLoader().load('./tex.jpg'),
    }),
  )
  _mainScene.add(_img)

  // colorful objects
  // noise is used to create variation
  for (let i = 0; i < 3; i++) {
    _items.push({
      mesh: makeMesh(new THREE.BoxBufferGeometry(1, 1, 1), THREE.AdditiveBlending),
      noise: random(-1, 1),
    })
    _items.push({
      mesh: makeMesh(new THREE.SphereBufferGeometry(0.5, 4, 4), THREE.SubtractiveBlending),
      noise: random(-1, 1),
    })
    _items.push({
      mesh: makeMesh(new THREE.ConeBufferGeometry(0.5, 1, 32), THREE.MultiplyBlending),
      noise: random(-1, 1),
    })
    _items.push({
      mesh: makeMesh(new THREE.CylinderBufferGeometry(0.5, 0.5, 1, 32), THREE.MultiplyBlending),
      noise: random(-1, 1),
    })
  }
}

// update every frame
function update() {
  // update some thing for animations

  // update colorful objcects position
  for (let i = 0, len = _items.length; i < len; i++) {
    const item = _items[i]
    const noise = item.noise
    const mesh = item.mesh
    mesh.position.y += 2

    mesh.rotation.x += 0.011 * noise
    mesh.rotation.y += 0.015 * noise
    mesh.rotation.z += 0.012 * noise

    if (mesh.position.y >= _screenHeight) {
      resetMesh(mesh)
    }
  }

  // update image object rotation
  _img.rotation.x = radian(Math.sin(_cnt * 0.012) * 7)
  _img.rotation.y = radian(Math.sin(_cnt * -0.015) * 6)
  _img.rotation.z = radian(Math.sin(_cnt * 0.009) * 5)
  _cnt++
}

// update something when window resized
function resize() {
  // update something
  // update image size
  const size = Math.min(_screenWidth, _screenHeight) * 0.75
  _img.scale.set(size, size, 1)
}

// some util functions
function makeMesh(geo, blending) {
  const mesh = new THREE.Mesh(
    geo,
    new THREE.MeshBasicMaterial({
      color: Math.random(),
      blending: blending,
      transparent: true,
      opacity: 1,
      depthTest: false,
    }),
  )
  _mainScene.add(mesh)

  resetMesh(mesh)
  mesh.position.y = random(-_screenHeight * 0.75, _screenHeight * 0.5)

  return mesh
}

function resetMesh(mesh) {
  mesh.position.x = random(-_screenWidth * 0.4, _screenWidth * 0.4)
  mesh.position.y = random(-_screenHeight * 4, -_screenHeight * 1)

  mesh.material.color = new THREE.Color(random(0, 1), random(0, 1), random(0, 1))

  mesh.rotation.x = radian(random(0, 360))
  mesh.rotation.y = radian(random(0, 360))
  mesh.rotation.z = radian(random(0, 360))

  const itemSize = Math.min(_screenWidth, _screenHeight) * random(0.1, 0.25)
  mesh.scale.set(itemSize, itemSize, itemSize)
}

function mix(x, y, a) {
  return x * (1 - a) + y * a
}

function random(min, max) {
  return Math.random() * (max - min) + min
}

function radian(val) {
  return (val * Math.PI) / 180
}
