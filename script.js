// Three.jsのモジュールの読み込み
import * as THREE from "./build/three.module.js";

// 変数宣言
let camera, scene, renderer;

// 初期化関数の読み込み
init();

// 初期化関数
function init() {
  // cameraのインスタンス化
  camera = new THREE.PerspectiveCamera
  (
    // 第１引数：視野角
    40,
    // 第２引数：アスペクト比
    window.innerWidth / window.innerHeight,
    // 第３引数：開始距離
    1,
    // 第４引数：終了距離
    15000
  );

  // cameraの座標の指定
  camera.position.z = 250;

  // sceneのインスタンス化
  scene = new THREE.Scene();

  // geometry オブジェクト生成
  const size = 250;
  const geometry = new THREE.BoxGeometry(size, size, size);
  const material = new THREE.MeshPhongMaterial({
    // colorプロパティ  色  Three.jsではカラーコードは16進数で指定する
    color: 0xffffff,
    // specularプロパティ   鏡面反射
    specular: 0xffffff,
    // shininessプロパティ  輝度
    shininess: 50,
  });

  // for文を使用してgeometryを2500個作成する
  const boxes = 2500;
  for(let i =0; i < boxes; i++){
    // Mesh関数を使ってboxを作成
    const mesh = new THREE.Mesh(geometry, material);

    // meshの座標を決める
    // random関数で浮動小数点ありの0から1の値をランダムで出力
    mesh.position.x = 8000 * (2.0 * Math.random() - 1.0);
    mesh.position.y = 8000 * (2.0 * Math.random() - 1.0);
    mesh.position.z = 8000 * (2.0 * Math.random() - 1.0);

    // 回転度合いをランダムに決める
    // rotation 回転度合いを決めるプロパティ random関数を使用しPIをかける
    mesh.rotation.x = Math.random() * Math.PI;
    mesh.rotation.y = Math.random() * Math.PI;
    mesh.rotation.z =Math.random() * Math.PI;

    // meshを作成したらsceneにaddする
    scene.add(mesh);
  }

  // DirectionalLight 平行光源
  // 第１引数：色 0xffffff（白）, 第２引数：強さ 0.03
  const dirLight = new THREE.DirectionalLight(0xffffff, 0.03);
  scene.add(dirLight);

  // addLightを読み込む
  // 引数：h 色相, 引数：s 彩度
  // 引数：l 輝度, 引数：x, y, z 座標
  addLight(0.08, 0.3, 0.9, 0, 0, -1000);

  // addLight ポイント光源を追加
  // 引数：h 色相, 引数：s 彩度
  // 引数：l 輝度, 引数：x, y, z 座標
  function addLight(h, s, l, x, y, z){
    // 第１引数：色 0xffffff（白）, 第２引数：強さ 1.5, 第３引数：減衰量
    const light = new THREE.PointLight(0xffffff, 1.5, 2000);

    // lightにカラーを追加する
    light.color.setHSL(h, s, l);
    light.position.set(x, y, z);
    scene.add(light);
  }

  // WebGLRenderer カメラに映したものを描画する
  renderer = new THREE.WebGLRenderer();

  // rendererはサイズ指定が必要
  // window.innerWidth, window.innerHeightで全画面を指定
  renderer.setSize(window.innerWidth, window.innerHeight);

  // index.phpのbodyタグ内に表示させる
  document.body.appendChild(renderer.domElement);

  // render関数を使用してレンダリング
  // 引数にscene, camera
  renderer.render(scene, camera);
}