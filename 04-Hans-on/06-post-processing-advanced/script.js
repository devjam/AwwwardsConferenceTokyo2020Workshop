// common variables
let _pp
let _renderer, _mainScene, _mainCamera, _uniforms, _screenWidth, _screenHeight

// define variables
const _mouse = { x: 0, y: 0 }

// initialization
function init() {
  // make renderer
  _renderer = new THREE.WebGLRenderer({
    canvas: document.getElementsByClassName('main')[0],
    preserveDrawingBuffer: true,
  })
  _renderer.setClearColor(0xe1e1e3, 1) // background color
  _renderer.setPixelRatio(window.devicePixelRatio || 1)

  // make main scene
  _mainScene = new THREE.Scene()

  // make main camera
  _mainCamera = new THREE.PerspectiveCamera(40, 1, 0.1, 50000)

  // for glsl
  _uniforms = {
    time: {
      value: 0,
    },
  }

  ;(async () => {
    const [f1, f2] = await Promise.all([
      loadglsl('./fs1.frag'),
      loadglsl('./fs2.frag'),
    ])

    _pp = new PostProcessing(_renderer, [{
      fragmentShader: f1,
      uniforms: _uniforms,
    }, {
      fragmentShader: f2,
      uniforms: _uniforms,
    }])
  })()

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

  window.addEventListener('resize', resize)
  resize()
  update()
}

// update every frame
function update() {
  // update some thing for animations
  _uniforms.time.value += 0.01
  _mainScene.rotation.y = _uniforms.time.value

  _mainCamera.position.x += _mouse.x - _mainCamera.position.x
  _mainCamera.position.y += -_mouse.y - _mainCamera.position.y
  _mainCamera.lookAt(_mainScene.position)

  // rendering
  if(_pp) _pp.render(_mainScene, _mainCamera)

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
}

// some util functions
function loadglsl(url) {
  return fetch(url)
    .then(response => {
      return response.text()
    })
    .then(source => {
      return source
    })
}

function onMouseMove(event) {
  _mouse.x = event.clientX - _screenWidth * 0.5
  _mouse.y = event.clientY - _screenHeight * 0.5
}

init()
