

var _renderer, _mainScene, _mainCamera, _light, _container, _material;

var _now = 0;
var _cnt = 0;
var _noise = 0;
var _changeCnt = 0;

var _img;
var _items = [];


// 初期設定
init();
function init() {

  // レンダラー
  _renderer = new THREE.WebGLRenderer({
    canvas : document.getElementsByClassName('main')[0]
  });
  _renderer.setClearColor(0x000000, 1); // 背景色
  _renderer.setPixelRatio(window.devicePixelRatio || 1);

  // メインシーン
  _mainScene = new THREE.Scene();

  // メインカメラ
  _mainCamera = new THREE.PerspectiveCamera(40, 1, 0.1, 50000);

  for(var i = 0; i < 50; i++) {
    var mesh = makeMesh()
    _items.push({
      mesh:mesh,
      noise:random(1, 3)
    });
    mesh.position.x = random(-window.innerWidth * 0.4, window.innerWidth * 1.5);
  }

  window.addEventListener('resize', resize);
  resize();


  update();
}



function makeMesh(geo, blending) {

  var mesh = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(1, 1),
    new THREE.MeshBasicMaterial({
      color:Math.random()
    })
  );
  _mainScene.add(mesh);

  resetMesh(mesh);

  return mesh;

}



function resetMesh(mesh) {

  var sw = window.innerWidth;
  var sh = window.innerHeight;

  mesh.material.color = new THREE.Color(randomArr([
    0xffffff,
    0xdd3c03,
    0x6b6a66
  ]))

  if(Math.random() > 0.3) {
    mesh.scale.x = random(1, 3);
  } else {
    mesh.scale.x = random(1, sw * 0.1);
  }
  mesh.scale.y = random(sh * 0.6, sh);

  mesh.position.x = random(sw * 1, sw * 2);
  mesh.position.y = 0;
}



// 毎フレーム実行
window.requestAnimationFrame(update);
function update() {

  var sw = window.innerWidth;
  var sh = window.innerHeight;

  var len = _items.length;
  for(var i = 0; i < len; i++) {
    var item = _items[i];
    var noise = item.noise;
    var mesh = item.mesh;

    mesh.position.x -= noise;

    // mesh.scale.y = sh;
    if(noise >= 2) {
      mesh.position.y = sh * 0.5 - mesh.scale.y * 0.5;
    } else {
      mesh.position.y = -sh * 0.5 + mesh.scale.y * 0.5
    }


    if(mesh.position.x < -sw) {
      resetMesh(mesh);
    }
  }

  // レンダリング
  if(_cnt % 2 == 0) {
    _renderer.render(_mainScene, _mainCamera);
  }

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
