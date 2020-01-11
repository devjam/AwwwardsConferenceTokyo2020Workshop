// common variables
let _renderer, _mainScene, _mainCamera, _screenWidth, _screenHeight

// define variables


// initialization
function init() {
  // make renderer
  _renderer = new THREE.WebGLRenderer({
    canvas: document.getElementsByClassName('main')[0],
  })
  _renderer.setClearColor(0xe1e1e3, 1) // background color
  _renderer.setPixelRatio(window.devicePixelRatio || 1)

  // make main scene
  _mainScene = new THREE.Scene()

  // make main camera
  _mainCamera = new THREE.PerspectiveCamera(40, 1, 0.1, 50000)

  // prepare some 3D objects
  

  window.addEventListener('resize', resize)
  resize()
  update()
}

// update every frame
function update() {
  // update some thing for animations

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
  _mainCamera.position.z = _screenHeight / Math.tan((_mainCamera.fov * Math.PI) / 360) / 2

  _renderer.setSize(_screenWidth, _screenHeight)

  // update something

}

// some util functions


init()
