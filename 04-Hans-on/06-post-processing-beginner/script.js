// common variables
// can use them inside init, update and resize functions
let _renderer, _mainScene, _mainCamera, _uniforms, _screenWidth, _screenHeight

// define variables
const _mouse = { x: 0, y: 0 }

// initialization
function init() {
  // prepare some 3D objects
  const loader = new THREE.FontLoader()
  loader.load('helvetiker_regular.typeface.json', font => {
    const geometory = new THREE.TextGeometry('Awwwards', {
      font: font,
      size: 100,
      height: 30,
      curveSegments: 30,
      bevelEnabled: true,
      bevelThickness: 10,
      bevelSize: 1,
      bevelOffset: 3,
      bevelSegments: 10,
    })
    geometory.center()

    const material = [
      new THREE.MeshBasicMaterial({ color: 0xffffff }),
      new THREE.MeshNormalMaterial(),
    ]

    const textMesh = new THREE.Mesh(geometory, material)
    
    _mainScene.add(textMesh)

    for (let i = 0; i < 40; i++) {
      const size = Math.random() * 10
      const circle = new THREE.Mesh(
        new THREE.SphereGeometry(size, 32, 32),
        new THREE.MeshBasicMaterial({
          transparent: true,
          opacity: 1.0,
          color: new THREE.Color(0xffffff),
        }),
      )

      circle.position.x = Math.random() * _screenWidth - _screenWidth * 0.5
      circle.position.y = Math.random() * _screenHeight - _screenHeight * 0.5
      circle.position.z = (Math.random() - 0.5) * 1000
      if (circle.position.z < 50 && circle.position.z > -50) continue

      _mainScene.add(circle)
    }
  })

  window.addEventListener('mousemove', onMouseMove, false)
}

// update every frame
function update() {
  // update some thing for animations
  _uniforms.time.value += 0.01
  _mainScene.rotation.y = _uniforms.time.value

  _mainCamera.position.x += _mouse.x - _mainCamera.position.x
  _mainCamera.position.y += -_mouse.y - _mainCamera.position.y
  _mainCamera.lookAt(_mainScene.position)
}

// update something when window resized
function resize() {
  // update something
}

// some util functions
function onMouseMove(event) {
  _mouse.x = event.clientX - _screenWidth * 0.5
  _mouse.y = event.clientY - _screenHeight * 0.5
}
