

var _renderer, _mainScene, _mainCamera, _light, _container;

var _cnt = 0;

var _items = [];

var _interval = 10;
var _noiseCnt = 0;


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

  _container = new THREE.Object3D()
  _mainScene.add(_container);

  for(var i = 0; i < 20; i++) {
    var mesh = makeMesh(i)
    _items.push({
      mesh:mesh,
      key:i
    });
    _container.add(mesh);
  }

  window.addEventListener('resize', resize);
  resize();

  reset();
  update();
}



function makeMesh(key) {

  var seg = randomInt(1, 8);

  var mesh = new THREE.Mesh(
    new THREE.BoxBufferGeometry(1, 1, 1, seg, seg, seg),
    new THREE.MeshBasicMaterial({
      color:new THREE.Color(0xff0000),
      transparent:true,
      opacity:1
    })
  );

  return mesh;

}



function reset() {

  var color = new THREE.Color(Math.random(), Math.random(), Math.random());
  var gray = new THREE.Color(0x333333);

  var len = _items.length;
  for(var i = 0; i < len; i++) {
    var item = _items[i];
    var mesh = item.mesh;
    mesh.material.wireframe = (Math.random() > 0.7);

    if(Math.random() > 0.6) {
      if(Math.random() > 0.5) {
        mesh.material.color = gray;
      } else {
        mesh.material.color = new THREE.Color(0xffffff);
      }
    } else {
      mesh.material.color = color;
    }

  }

  _container.rotation.x = radian(random(-90, 90));
  _container.rotation.y = radian(random(-90, 90));
  _container.rotation.z = radian(random(-90, 90));

  _interval = random(8, 20);

  _noiseCnt = 30;

}







// 毎フレーム実行
window.requestAnimationFrame(update);
function update() {

  var sw = window.innerWidth;
  var sh = window.innerHeight;

  var radius = Math.min(sw, sh) * 0.5;
  var blockSize = radius * 0.1;

  var len = _items.length;
  for(var i = 0; i < len; i++) {
    var item = _items[i];
    var key = item.key;
    var mesh = item.mesh;

    var rad = radian(_cnt * 1 + key * _interval);
    mesh.position.x = Math.sin(rad) * radius;
    mesh.position.z = Math.cos(rad) * radius;

    if(_noiseCnt > 0) {
      mesh.scale.set(random(blockSize * 0.01, blockSize), random(blockSize * 0.01, radius), random(blockSize * 0.01, blockSize));
      mesh.position.y = random(-mesh.scale.y, mesh.scale.y);
      mesh.material.opacity = random(0, 1);
    } else {
      mesh.scale.set(blockSize, radius, blockSize);
      mesh.position.y = 0;
      mesh.material.opacity = 1;
    }

  }
  _noiseCnt--;

  if(_cnt % 180 == 0) {
    reset();
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
