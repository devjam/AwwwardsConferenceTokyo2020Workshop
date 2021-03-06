// common variables
let _renderer, _mainScene, _mainCamera, _screenWidth, _screenHeight

// define variables
let _cnt = 0
let _img
let _items = []

// initialization
function init() {
  // make renderer
  _renderer = new THREE.WebGLRenderer({
    canvas: document.getElementsByClassName('main')[0]
  })
  _renderer.setClearColor(0xe1e1e3, 1) // background color
  // #### change sample ####
  // _renderer.setClearColor(0x000000, 1)
  // #######################
  _renderer.setPixelRatio(window.devicePixelRatio || 1)

  // make main scene
  _mainScene = new THREE.Scene()

  // make main camera
  _mainCamera = new THREE.PerspectiveCamera(40, 1, 0.1, 50000)

  // prepare some 3D objects
  _screenWidth = window.innerWidth
  _screenHeight = window.innerHeight

  // image object
  _img = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(1, 1),
    new THREE.MeshBasicMaterial({
      map: new THREE.TextureLoader().load('./tex.jpg')
      // #### change sample ####
      // map: new THREE.TextureLoader().load('./tex2.jpg')
      // #######################
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
  // #### change sample ####
  // for (let i = 0; i < 3; i++) {
  //   _items.push({
  //     mesh: makeMesh(new THREE.TorusBufferGeometry(0.75, 0.1, 8, 3), THREE.AdditiveBlending),
  //     noise: random(-1, 1),
  //   })
  //   _items.push({
  //     mesh: makeMesh(new THREE.TorusBufferGeometry(0.75, 0.1, 8, 6), THREE.AdditiveBlending),
  //     noise: random(-1, 1),
  //   })
  //   _items.push({
  //     mesh: makeMesh(new THREE.TorusBufferGeometry(0.75, 0.1, 8, 9), THREE.AdditiveBlending),
  //     noise: random(-1, 1),
  //   })
  //   _items.push({
  //     mesh: makeMesh(new THREE.TorusBufferGeometry(0.75, 0.1, 8, 12), THREE.AdditiveBlending),
  //     noise: random(-1, 1),
  //   })
  // }
  // #######################

  window.addEventListener('resize', resize)
  resize()
  update()
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
  // #### change sample ####
  // color = new THREE.Color(0xff0000)
  // color.offsetHSL(0, 0, random(0, 0.1))
  // mesh.material.color = color
  // #######################

  mesh.rotation.x = radian(random(0, 360))
  mesh.rotation.y = radian(random(0, 360))
  mesh.rotation.z = radian(random(0, 360))

  let itemSize = Math.min(_screenWidth, _screenHeight) * random(0.1, 0.25)
  // #### change sample ####
  // if(Math.random() > 0.8) {
  //   itemSize *= 3
  // }
  // #######################

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


init()
