// initialization
function _init() {
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

  _screenWidth = window.innerWidth
  _screenHeight = window.innerHeight

  init()

  window.addEventListener('resize', _resize)
  _resize()
  _update()
}

// update every frame
function _update() {
  update()

  // rendering
  _renderer.render(_mainScene, _mainCamera)

  window.requestAnimationFrame(_update)
}

// update something when window resized
function _resize() {
  _screenWidth = window.innerWidth
  _screenHeight = window.innerHeight

  // camera settings for to be actual size
  _mainCamera.aspect = _screenWidth / _screenHeight
  _mainCamera.updateProjectionMatrix()
  _mainCamera.position.z = (_screenHeight * 0.5) / Math.tan((_mainCamera.fov * 0.5) * Math.PI / 180)

  _renderer.setSize(_screenWidth, _screenHeight)

  resize()
}

_init()
