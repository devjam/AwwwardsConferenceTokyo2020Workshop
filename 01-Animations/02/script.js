var _renderer, _mainScene, _mainCamera, _container, _material, _mesh;

var _baseSpeed = 30
var _size = 100
var _speed = {
  x: Math.random() * 2 - 1,
  y: Math.random() * 2 - 1,
}

var _left = 0
var _right = 0
var _bottom = 0
var _top = 0

// 初期設定
init();
function init() {
  _renderer = new THREE.WebGLRenderer({
    canvas : document.getElementsByClassName('main')[0]
  });
  _renderer.setClearColor(0xe1e1e3, 1);
  _renderer.setPixelRatio(window.devicePixelRatio || 1);
  
  _mainScene = new THREE.Scene();
  _mainCamera = new THREE.PerspectiveCamera(80, 1, 0.1, 50000);

  _container = new THREE.Object3D();
  _mainScene.add(_container);

  _material = new THREE.MeshBasicMaterial({
    color: new THREE.Color(0x00e1e1).offsetHSL(Math.random(), 0, 0)
  });
  
  _mesh = new THREE.Mesh(new THREE.BoxBufferGeometry(_size, _size, 0), _material)
  _container.add(_mesh)

  window.addEventListener('resize', resize);
  resize();

  update();
}

function update() {
  _mesh.position.x += _speed.x * _baseSpeed
  _mesh.position.y += _speed.y * _baseSpeed

  if(_left > _mesh.position.x) {
    _mesh.position.x = _left
    _speed.x *= -1
  }
  if(_right < _mesh.position.x) {
    _mesh.position.x = _right
    _speed.x *= -1
  }
  if(_bottom > _mesh.position.y) {
    _mesh.position.y = _bottom
    _speed.y *= -1
  }
  if(_top < _mesh.position.y) {
    _mesh.position.y = _top
    _speed.y *= -1
  }

  _renderer.render(_mainScene, _mainCamera);

  requestAnimationFrame(update);
}

function resize() {
  var sw = window.innerWidth;
  var sh = window.innerHeight;

  _mainCamera.aspect = sw / sh;
  _mainCamera.updateProjectionMatrix();
  _mainCamera.position.z = (sh * 0.5) / Math.tan((_mainCamera.fov * 0.5) * Math.PI / 180);

  _renderer.setSize(sw, sh);

  _left = -sw * 0.5 + _size * 0.5
  _right = -_left
  _bottom = -sh * 0.5 + _size * 0.5
  _top = -_bottom
}


