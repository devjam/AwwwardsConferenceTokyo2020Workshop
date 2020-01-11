

var _renderer, _mainScene, _mainCamera;

var _now = 0;
var _cnt = 0;
var _noise = 0;
var _changeCnt = 0;

var _items = [];

var _mouse = new THREE.Vector2(0, 0);
var _mouseBuf = new THREE.Vector2(0, 0);


// 初期設定
init();
function init() {

  // レンダラー
  _renderer = new THREE.WebGLRenderer({
    canvas : document.getElementsByClassName('main')[0],
    preserveDrawingBuffer : true
  });
  _renderer.setClearColor(0xffffff, 1); // 背景色
  _renderer.autoClear = false;

  // メインシーン
  _mainScene = new THREE.Scene();

  // メインカメラ
  _mainCamera = new THREE.PerspectiveCamera(40, 1, 0.1, 50000);

  for(var i = 0; i < 3; i++) {
    var mesh = makeMesh(i)
    _items.push(mesh);
  }

  window.addEventListener('resize', resize);
  resize();

  window.addEventListener('mousemove', eMouseMove);

  update();
}



function eMouseMove(e) {

  var x = e.pageX;
  var y = e.pageY;

  _mouse.set(x, y);

}



function makeMesh(key) {

  var geo;
  switch (key % 3) {
    case 0:
      geo = new THREE.SphereBufferGeometry(0.5, 8, 8);
      break;
    case 1:
      geo = new THREE.BoxBufferGeometry(1, 1, 1);
      break;
    case 2:
      geo = new THREE.ConeBufferGeometry(0.5, 1, 32);
      break;
    default:
      geo = new THREE.SphereBufferGeometry(0.5, 8, 8);
  }

  var mesh = new THREE.Mesh(
    geo,
    new THREE.MeshBasicMaterial({
      color:new THREE.Color(),
      transparent:true,
      opacity:1,
      blending:THREE.MultiplyBlending
    })
  );
  _mainScene.add(mesh);

  return mesh;

}



function showMesh(mesh) {

  var sw = window.innerWidth;
  var sh = window.innerHeight;

  mesh.position.x = _mouse.x - sw * 0.5;
  mesh.position.y = -_mouse.y + sh * 0.5;

  var offsetRange = Math.min(sw, sh) * 0.01;
  mesh.position.x += random(-offsetRange, offsetRange);
  mesh.position.y += random(-offsetRange, offsetRange);

  var color = new THREE.Color(Math.random(), Math.random(), Math.random());
  mesh.material.color = color

  var scale;
  if(Math.random() > 0.2) {
    scale = random(0.1, 0.5);
  } else {
    scale = random(1, Math.min(sw, sh) * 0.05);
  }
  mesh.scale.set(scale, scale, scale);

  mesh.rotation.x = radian(random(0, 360));
  mesh.rotation.y = radian(random(0, 360));
  mesh.rotation.z = radian(random(0, 360));

  mesh.material.opacity = random(0.1, 1);

}



// 毎フレーム実行
window.requestAnimationFrame(update);
function update() {

  var sw = window.innerWidth;
  var sh = window.innerHeight;

  var moveDist = _mouseBuf.distanceTo(_mouse);

  var len = _items.length;
  for(var i = 0; i < len; i++) {
    var mesh = _items[i];
    showMesh(mesh);
    mesh.visible = (moveDist > 1);
  }

  if(_cnt == 0) {
    _renderer.clear();
  }

  _mouseBuf.copy(_mouse);

  // レンダリング
  _renderer.render(_mainScene, _mainCamera);

  _cnt++;
  window.requestAnimationFrame(update);
}





function resize() {

  var sw = window.innerWidth;
  var sh = window.innerHeight;

  // カメラ設定
  // ピクセル等倍になるように
  _mainCamera.aspect = sw / sh;
  _mainCamera.updateProjectionMatrix()
  _mainCamera.position.z = sh / Math.tan(_mainCamera.fov * Math.PI / 360) / 2;

  _renderer.setSize(sw, sh);

}



function mix(x, y, a) {
  return x * (1 - a) + y * a;
}



function random(min, max) {
  return Math.random() * (max - min) + min;
}



function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}



function radian(val) {
  return val * Math.PI / 180;
}



function randomArr(arr) {
  return arr[randomInt(0, arr.length - 1)]
}
