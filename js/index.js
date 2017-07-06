var container, stats;
var camera, scene, renderer;
var mouseX = 0,
  mouseY = 0;
var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;
var lighthouse;

var mouse = new THREE.Vector2();
var raycaster = new THREE.Raycaster();

init();
animate();
lights();

// Init
function init() {
  container = document.createElement('div');
  document.body.appendChild(container);
  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 2000);
  camera.position.z = 250;

  scene = new THREE.Scene();

  lights();

  loadObj();

  keypoint();

  renderer = new THREE.WebGLRenderer({ alpha: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  container.appendChild(renderer.domElement);

  // Eventi DOM
  document.addEventListener('mousedown', keypointClick, false);
  document.addEventListener('mousemove', onDocumentMouseMove, false);
  window.addEventListener('resize', onWindowResize, false);
}

function keypoint() {
  var geometry = new THREE.SphereGeometry(5, 32, 32);
  var material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
  var sphere = new THREE.Mesh(geometry, material);
  /*var sphere2 = new THREE.Mesh(geometry, material);
  var sphere3 = new THREE.Mesh(geometry, material);*/
  sphere.name = 'keypoint_1';
  scene.add(sphere);
  /*scene.add(sphere2);
  scene.add(sphere3);*/

  var tl = new TimelineMax({repeat: -1});


  /*var geometry = new THREE.CircleGeometry( 5, 32 );
  var material = new THREE.MeshBasicMaterial( { color: 0x000000 } );
  var circle = new THREE.Mesh( geometry, material );
  circle.name = 'keypoint_1';
  scene.add( circle );*/

  /*tl
    .fromTo( sphere.scale, 1, {x:0, y:0, opacity: 0}, {x:1, y: 1, opacity: 1} ).add('start1')
    .fromTo( sphere.material, 1, {opacity: 1}, {opacity: 0.3}, 'start1-=1' )
    .fromTo( sphere2.scale, 1, {x:0, y:0, opacity: 0}, {x:1, y: 1, opacity: 1}, 'start1' ).add('start2')
    .fromTo( sphere2.material, 1, {opacity: 1}, {opacity: 0.3}, 'start2+=2' )*/
    /*.fromTo( sphere3.scale, 1, {x:0, y:0, opacity: 0}, {x:1, y: 1, opacity: 1} ).add('start3')
    .fromTo( sphere3.material, 1, {opacity: 1}, {opacity: 0.3}, 'start3-=1' )*/




}

// Lights
function lights() {
  var ambient = new THREE.AmbientLight(0xfdffde, 0.7);
  scene.add(ambient);

  var light;

  light = new THREE.DirectionalLight(0xfaf798, 0.5);
  light.position.set(150, 60, -100);
  //light.position.multiplyScalar(1.2);

  light.name = 'Luce DX';
  light.castShadow = true;

  light.shadow.mapSize.width = 1000;
  light.shadow.mapSize.height = 1000;

  var d = 40;

  light.shadow.camera.left = -d;
  light.shadow.camera.right = d;
  light.shadow.camera.top = d;
  light.shadow.camera.bottom = -d;

  light.shadow.camera.far = 100;

  scene.add(light);

  var lightHelper = new THREE.SpotLightHelper(light);
  scene.add(lightHelper);
  var shadowCameraHelper = new THREE.CameraHelper(light.shadow.camera);
  scene.add(shadowCameraHelper);

  var light2;

  light2 = new THREE.DirectionalLight(0x094356, 1.5);
  light2.position.set(-150, 60, -30);
  //light.position.multiplyScalar(1.2);

  light.name = 'Luce SX';
  light2.castShadow = true;

  light2.shadow.mapSize.width = 1000;
  light2.shadow.mapSize.height = 1000;

  var d = 40;

  light2.shadow.camera.left = -d;
  light2.shadow.camera.right = d;
  light2.shadow.camera.top = d;
  light2.shadow.camera.bottom = -d;

  light2.shadow.camera.far = 100;

  scene.add(light2);

  var lightHelper2 = new THREE.SpotLightHelper(light2);
  scene.add(lightHelper2);
  var shadowCameraHelper2 = new THREE.CameraHelper(light2.shadow.camera);
  scene.add(shadowCameraHelper2);
}

// Load Object into scene
function loadObj() {
  var onProgress = function(xhr) {
    if (xhr.lengthComputable) {
      var percentComplete = xhr.loaded / xhr.total * 100;
      console.log(Math.round(percentComplete, 2) + '% downloaded');
    }
  };
  var onError = function(xhr) {};
  THREE.Loader.Handlers.add(/\.dds$/i, new THREE.DDSLoader());
  var mtlLoader = new THREE.MTLLoader();

  mtlLoader.setPath('obj/');
  mtlLoader.load('lighthouse_3.mtl', function(materials) {
    materials.preload();
    var objLoader = new THREE.OBJLoader();
    objLoader.setMaterials(materials);
    objLoader.setPath('obj/');
    objLoader.load(
      'lighthouse_3.obj',
      function(object) {
        object.traverse(function(child) {
          if (child instanceof THREE.Mesh) {
            child.castShadow = true;
          }
        });

        object.name = 'lighthouse';
        object.position.y = 10;
        object.position.z = -100;
        object.scale.x = 0.05;
        object.scale.y = 0.05;
        object.scale.z = 0.05;
        object.rotateY(180);
        object.receiveShadow = true;
        object.castShadow = true;

        lighthouse = object;
        scene.add(object);
      },
      onProgress,
      onError
    );
  });
}

// Window resize
function onWindowResize() {
  windowHalfX = window.innerWidth / 2;
  windowHalfY = window.innerHeight / 2;
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

// Mouse move
function onDocumentMouseMove(event) {
  mouseX = (event.clientX - windowHalfX) / 4;
  mouseY = (event.clientY - windowHalfY) / 10;

  // Coordinates used for Raycaster
  mouse.x = event.clientX / window.innerWidth * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
}

// Animate
function animate() {
  requestAnimationFrame(animate);
  render();
}

// Render
function render() {
  camera.position.x += (mouseX - camera.position.x) * 0.08;
  camera.position.y += (-mouseY - camera.position.y) * 0.05;
  camera.lookAt(scene.position);
  renderer.render(scene, camera);
}


function keypointClick(event) {
  console.log('%cClick','color:orange');

  raycaster.setFromCamera(mouse, camera);
  let intersects = raycaster.intersectObjects(scene.children, true);
  if (intersects.length > 0) {
    console.log(intersects);
    var clickObj = intersects[0].object;
    if (intersects[0].object.name == 'keypoint_1') {

        var htmlKeypoint = document.getElementById(clickObj.name);

        if ( htmlKeypoint.classList.contains('open') ) {
          htmlKeypoint.classList.remove('open');
        } else {
          htmlKeypoint.classList.add('open');
        }

    }
  }
}
