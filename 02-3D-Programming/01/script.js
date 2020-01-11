

var _renderer, _mainScene, _mainCamera, _light, _container, _material;
var _mesh = [];
var _now = 0;
var _cnt = 0;
var _noise = 0;
var _changeCnt = 0;


// 初期設定
init();
function init() {

  // レンダラー
  _renderer = new THREE.WebGLRenderer({
    canvas : document.getElementsByClassName('main')[0]
  });
  _renderer.setClearColor(0xe1e1e3, 1); // 背景色
  _renderer.setPixelRatio(window.devicePixelRatio || 1);

  // メインシーン
  _mainScene = new THREE.Scene();

  // メインカメラ
  _mainCamera = new THREE.PerspectiveCamera(80, 1, 0.1, 50000);

  // ライト
  _light = new THREE.PointLight(
    0xffffff, // ライトの色 明るい色
    0.5 // 強さ
  );
  _mainScene.add(_light);


  // 3Dオブジェクト入れるコンテナ
  _container = new THREE.Object3D()
  _mainScene.add(_container);

  // 材質 使い回す
  var mat = new THREE.MeshPhongMaterial({
    color: 0xffffff, // ライトあたるところ
    // emissive:0x00ff00, // 暗いとこと
    // specular:0xffff00, // 特にライトあたるところ
    side:THREE.DoubleSide
  });
  _material = mat;


  // 3Dオブジェクト Box作成
  // 形状
  var geoA = new THREE.BoxBufferGeometry(1, 1, 1, 8, 8, 8);

  // 3Dオブジェクト
  var meshA = new THREE.Mesh(geoA, mat);
  _container.add(meshA);
  _mesh.push(meshA);


  // 3Dオブジェクト Sphere作成
  // 形状
  var geoB = new THREE.TorusBufferGeometry(0.75, 0.2, 8, 20);

  // 3Dオブジェクト
  var meshB = new THREE.Mesh(geoB, mat);
  _container.add(meshB);
  _mesh.push(meshB);


  // 3Dオブジェクト 八面体作成
  // 形状
  var geoC = new THREE.OctahedronBufferGeometry(0.75, 0);

  // 3Dオブジェクト
  var meshC = new THREE.Mesh(geoC, mat);
  _container.add(meshC);
  _mesh.push(meshC);


  _change();



  window.addEventListener('resize', resize);
  resize();


  update();
}

// 毎フレーム実行
window.requestAnimationFrame(update);
function update() {

  _noise += (0 - _noise) * 0.6;

  s = Math.min(window.innerWidth, window.innerHeight) * 0.25;
  _container.scale.set(s, s, s);

  var colorA = new THREE.Color(0xffffff)
  _material.color = colorA.lerp(new THREE.Color(0x000000), _noise * 30);

  for(var i = 0; i < _mesh.length; i++) {
    _mesh[i].material.wireframe = (_cnt % 2 == 0)
  }

  if(_noise >= 0.0001) {
    if(_cnt % 2 == 0) {
      _material.wireframe = !_material.wireframe;
    }
  } else {
    _material.wireframe = false;
  }


  // // カメラはコンテナのまわりを回る
  var radian = new Date().getTime() * 0.002 * mix(1, 1.001, _noise);
  var radius = Math.min(window.innerWidth, window.innerHeight) * 0.5;
  _mainCamera.position.x = Math.sin(radian) * radius;
  _mainCamera.position.z = Math.cos(radian) * radius;
  _mainCamera.lookAt(_container.position);

  // ライトの位置
  _light.position.copy(_mainCamera.position);
  _light.position.y += window.innerHeight * 0.25;


  // 一定間隔でオブジェクト切り替え
  if(_cnt % 120 == 0) {
    _change();
  }


  // レンダリング
  _renderer.render(_mainScene, _mainCamera);

  _cnt++;
  window.requestAnimationFrame(update);
}


function _change() {

  for(var i = 0; i < _mesh.length; i++) {
    _mesh[i].visible = (i == _now);
  }

  _container.rotation.x = Math.random() * 360 * (Math.PI / 180);
  _container.rotation.y = Math.random() * 360 * (Math.PI / 180);
  _container.rotation.z = Math.random() * 360 * (Math.PI / 180);

  // 切り替え時のノイズ的なパラメータ
  _noise = 1;

  // _material.wireframe = (_changeCnt % 2 == 0);

  _now++;
  if(_now >= _mesh.length) {
    _now = 0;
  }

  _changeCnt++;

}


function resize() {

  var sw = window.innerWidth;
  var sh = window.innerHeight;

  // カメラ設定
  // ピクセル等倍になるように
  _mainCamera.aspect = sw / sh;
  _mainCamera.updateProjectionMatrix();
  _mainCamera.position.z = (sh * 0.5) / Math.tan((_mainCamera.fov * 0.5) * Math.PI / 180);

  _renderer.setSize(sw, sh);

}


function mix(x, y, a) {
  return x * (1 - a) + y * a;
}
