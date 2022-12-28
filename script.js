// Three.jsのモジュールの読み込み
import * as THREE from "./build/three.module.js";
// FlyControlsオブジェクトの読み込み マウスカーソル操作が可能
import { FlyControls } from "./jsm/controls/FlyControls.js";

// Lensflareオブジェクトの読み込み
import { Lensflare, LensflareElement } from "./jsm/objects/Lensflare.js";

// 変数宣言
let camera, scene, renderer;
let controls;

// Clock 現在の経過時間を表示するオブジェクト
const clock = new THREE.Clock();

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

  // textureLoader TextureLoaderを使ってレンズフレアの追加
  const textureLoader = new THREE.TextureLoader();
  // テクスチャの読み込み
  const textureFlare = textureLoader.load("./textures/LensFlare.png");

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

    const lensflare = new Lensflare();
    lensflare.addElement(
      new LensflareElement(textureFlare, 700, 0, light.color)
    );
    scene.add(lensflare);
  }

  // WebGLRenderer カメラに映したものを描画する
  renderer = new THREE.WebGLRenderer();

  // rendererはサイズ指定が必要
  // window.innerWidth, window.innerHeightで全画面を指定
  renderer.setSize(window.innerWidth, window.innerHeight);

  // outputEncodingをsRGBEncodingに変更
  renderer.outputEncoding = THREE.sRGBEncoding;

  // index.phpのbodyタグ内に表示させる
  document.body.appendChild(renderer.domElement);

  // マウス操作を行う
  controls = new FlyControls(camera, renderer.domElement);

  // movementSpeed マウスクリック時のスピード速度
  controls.movementSpeed = 2500;

  // rollSpeed カーソルの位置の速度変更
  controls.rollSpeed = Math.PI / 20;

  // animate関数の呼び出し
  animate();
}

// animate関数
function animate(){
  // requestAnimationFrame フレーム単位で画像を更新する animate関数を毎フレームごとに読み込む
  requestAnimationFrame(animate);

  // getDelta 経過した時間を取得
  const delta = clock.getDelta();

  // update関数にdeltaを入れる
  controls.update(delta);

  // render関数を使用してレンダリング
  // 引数にscene, camera
  renderer.render(scene, camera);
}