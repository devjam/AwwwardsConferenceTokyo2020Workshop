

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
  _renderer.setClearColor(0xe1e1e3, 1); // 背景色
  _renderer.setPixelRatio(window.devicePixelRatio || 1);

  // メインシーン
  _mainScene = new THREE.Scene();

  // メインカメラ
  _mainCamera = new THREE.PerspectiveCamera(40, 1, 0.1, 50000);


  // 画像オブジェクト
  _img = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(1, 1),
    new THREE.MeshBasicMaterial({
      map:new THREE.TextureLoader().load('./tex.jpg')
    })
  )
  _mainScene.add(_img)


  // にぎやかし
  for(var i = 0; i < 3; i++) {
    _items.push({
      mesh:makeMesh(new THREE.BoxBufferGeometry(1, 1, 1), THREE.AdditiveBlending),
      noise:random(-1, 1)
    });
    _items.push({
      mesh:makeMesh(new THREE.SphereBufferGeometry(0.5, 4, 4), THREE.SubtractiveBlending),
      noise:random(-1, 1)
    });
    _items.push({
      mesh:makeMesh(new THREE.ConeBufferGeometry(0.5, 1, 32), THREE.MultiplyBlending),
      noise:random(-1, 1)
    });
    _items.push({
      mesh:makeMesh(new THREE.CylinderBufferGeometry(0.5, 0.5, 1, 32), THREE.MultiplyBlending),
      noise:random(-1, 1)
    });
  }

  window.addEventListener('resize', resize);
  resize();


  update();
}



function makeMesh(geo, blending) {

  var mesh = new THREE.Mesh(
    geo,
    new THREE.MeshBasicMaterial({
      color:Math.random(),
      blending:blending,
      transparent:true,
      opacity:1,
      depthTest:false
    })
  );
  _mainScene.add(mesh);

  resetMesh(mesh);
  mesh.position.y = random(-window.innerHeight * 0.75, window.innerHeight * 0.5);


  return mesh;

}



function resetMesh(mesh) {

  var sw = window.innerWidth;
  var sh = window.innerHeight;

  mesh.position.x = random(-sw * 0.4, sw * 0.4);
  mesh.position.y = random(-window.innerHeight * 4, -window.innerHeight * 1);

  mesh.material.color = new THREE.Color(random(0, 1), random(0, 1), random(0, 1))

  mesh.rotation.x = radian(random(0, 360));
  mesh.rotation.y = radian(random(0, 360));
  mesh.rotation.z = radian(random(0, 360));

  var itemSize = Math.min(sw, sh) * random(0.1, 0.25);
  mesh.scale.set(itemSize, itemSize, itemSize);

}


// 毎フレーム実行
window.requestAnimationFrame(update);
function update() {

  var sh = window.innerHeight;

  // にぎやかし移動
  var len = _items.length;
  for(var i = 0; i < len; i++) {
    var item = _items[i];
    var noise = item.noise;
    var mesh = item.mesh;
    mesh.position.y += 2;

    mesh.rotation.x += 0.011 * noise;
    mesh.rotation.y += 0.015 * noise;
    mesh.rotation.z += 0.012 * noise;

    if(mesh.position.y >= sh) {
      resetMesh(mesh);
    }
  }

  _img.rotation.x = radian(Math.sin(_cnt * 0.012) * 7);
  _img.rotation.y = radian(Math.sin(_cnt * -0.015) * 6);
  _img.rotation.z = radian(Math.sin(_cnt * 0.009) * 5);

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

  // 画像のサイズ
  var size = Math.min(sw, sh) * 0.75;
  _img.scale.set(size, size, 1);

  _renderer.setSize(sw, sh);

}



function mix(x, y, a) {
  return x * (1 - a) + y * a;
}



function random(min, max) {
  return Math.random() * (max - min) + min;
}



function radian(val) {
  return val * Math.PI / 180;
}
