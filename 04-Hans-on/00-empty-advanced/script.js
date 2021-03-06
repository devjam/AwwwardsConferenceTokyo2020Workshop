// common variables
let _pp
let _renderer, _mainScene, _mainCamera, _uniforms, _screenWidth, _screenHeight

// define variables


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


  window.addEventListener('resize', resize)
  resize()
  update()
}

// update every frame
function update() {
  // update some thing for animations


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

function loadglsl(url) {
  return fetch(url)
    .then(response => {
      return response.text()
    })
    .then(source => {
      return source
    })
}

// some util functions


init()
