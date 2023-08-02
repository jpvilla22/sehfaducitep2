var progressManager, /*entryPanorama, moviePanorama, videoWall, */ renderer, SOUND_OVER, SOUND_CLICK;


const panoramaPBE = new PANOLENS.ImagePanorama( 'assets/01_exterior/02_exterior-360.jpg');
const panoramaPBI = new PANOLENS.VideoPanorama ('assets/02_pb-interior/01_planta-baja-mezcla.mp4', {
  autoplay: true,
  loop: true,
});
const panoramaPriSin = new PANOLENS.ImagePanorama('assets/03_primer-piso/pp_sin.jpg');
const panoramaPriCon = new PANOLENS.ImagePanorama('assets/03_primer-piso/pp_con.jpg');
const panoramaVes = new PANOLENS.ImagePanorama('assets/03_primer-piso/vestuario.jpg');

let imageContainer = document.querySelector('.image-container');

/* infospots PB Exterior */

let cartel = document.querySelector('#cartel');
let vallados = document.querySelector('#vallados');
let caballetes = document.querySelector('#caballetes');
let protecciones = document.querySelector('#protecciones');

var infospotCar = new PANOLENS.Infospot( 100, PANOLENS.DataImage.Info );
infospotCar.position.set( -1200,250,-250);
infospotCar.addHoverElement( cartel, -200 );
//infospotCar.addEventListener('click', onFocus);

var infospotVal = new PANOLENS.Infospot( 100, PANOLENS.DataImage.Info );
infospotVal.position.set( -1200,200,0);
infospotVal.addHoverElement( vallados, 200 );
//infospotCar.addEventListener('click', onFocus);

var infospotCab = new PANOLENS.Infospot( 100, PANOLENS.DataImage.Info );
infospotCab.position.set( -1200,0,450);
infospotCab.addHoverElement( caballetes, 200 );
//infospotCar.addEventListener('click', onFocus);

var cuestionarioUno = new PANOLENS.Infospot( 100, PANOLENS.DataImage.Info );
cuestionarioUno.position.set( -1200,400,200  );
cuestionarioUno.addHoverElement( protecciones, -200 );
//telespotPBI.addEventListener('click', telePBI);

var telespotPBI = new PANOLENS.Infospot( 60, PANOLENS.DataImage.Arrow );
telespotPBI.position.set( -1200,100,-450 );
//telespotPri.addHoverElement( mezcla, 200 );
//telespotPBI.addHoverText('Entrar');
telespotPBI.addEventListener('click', telePBI);

panoramaPBE.rotation.set(0,0,0);

panoramaPBE.add(infospotCar);
panoramaPBE.add(infospotVal);
panoramaPBE.add(infospotCab);
panoramaPBE.add(cuestionarioUno);

function cuestUno(){
  panoramaPBE.add(telespotPBI);
  cuestionarioUno.removeHoverElement();
  panoramaPBE.remove(cuestionarioUno);
  panoramaPBE.remove(infospotCab);
  panoramaPBE.remove(infospotCar);
  panoramaPBE.remove(infospotVal);
  telespotPBI.show();
  telespotPBI.focus(2000,  TWEEN.Easing.Exponential.Out);
  viewer.setCameraFov(30);
}

progressManager = generateProgressManager();

  function loadFont () {

   // Load bmfont
    /*PANOLENS.Utils.loadBMFont({
      font: 'asset/fnt/Lato-Regular-64.fnt',
      image: 'asset/fnt/lato.png'
    }, init);*/

  }

 // function init () {

    SOUND_OVER = new Audio( 'assets/audio/over.mp3' );
    SOUND_OVER.stop = function () {
      this.currentTime = 0;
      this.pause();
    };
    SOUND_CLICK = new Audio( 'assets/audio/click.mp3' );
    SOUND_CLICK.stop = function () {
      this.currentTime = 0;
      this.pause();
    };

    // Initialize Viewer
    //viewer = new PANOLENS.Viewer();
    
    const viewer = new PANOLENS.Viewer({
        container: imageContainer,
        autoRotate: false,
        autoRotateSpeed: 0,
        controlBar: true,
        rotate: 0,
        cameraFov: 60,
     
        });

    //css3dWidget = generateCSS3DVideoElement();
    //entryPanorama = getEntryPanorama();
    //moviePanorama = getMoviePanorama();
    //videoWall = getSpiralMovieWall();
    
    //entryPanorama.add( videoWall );

    viewer.add( panoramaPBE, panoramaPBI, panoramaPriCon, panoramaPriSin, panoramaVes);
    //viewer.add( entryPanorama, moviePanorama );
    viewer.getContainer().style.position = 'fixed';
    viewer.getContainer().style.top = 0;
    viewer.getContainer().style.background = 'transparent';
    //viewer.camera.rotation.set(0,90,0);
    viewer.getControl().rotateLeft(1.5);
    viewer.getControl().rotateUp(-0.2);
    viewer.getControl().update();

 // }

function generateProgressManager () {

    var manager = {}, animationEndEvents, launchElement, subtitleTextElement, maskElement, loadingElement, enterElement, ytElements, progressTextElement;

    animationEndEvents = [ 'animationend', 'webkitAnimationEnd' ];

    launchElement = document.getElementById( 'launch-page' );
    subtitleTextElement = document.getElementById( 'subtitle-text' );
    maskElement = document.getElementById( 'progress-container-mask' );
    loadingElement = document.getElementById( 'progress-indicator' );
    enterElement = document.getElementById( 'enter-button' );
    progressTextElement = document.getElementById( 'progress-text' );

    animationEndEvents.forEach( function( event ){

      subtitleTextElement.addEventListener( event, function(){
        loadingElement.classList.add( 'ready' );
        loadFont();
      } );

    } );

    manager.total = 0;
    manager.loaded = 0;

    manager.addTotal = function ( count ) {
      this.total += typeof count === 'number' ? count : 1;
    };

    manager.addLoaded = function ( count ) {
      this.loaded += typeof count === 'number' ? count : 1;
      this.checkProgress();
    };

    manager.checkProgress = function () {

      if ( this.total === this.loaded ) {

        maskElement.classList.add( 'ready' );
        
        ytElements = document.getElementsByClassName( 'yt-iframe' );
        for ( var i = 0; i < ytElements.length; i++ ) {
          ytElements[ i ].classList.add( 'ready' );
        }

      }

      progressTextElement.textContent = Math.round( this.loaded / this.total * 100 );

    };

    enterElement.addEventListener( 'mouseenter', function() {

      maskElement.classList.contains( 'ready' ) && SOUND_OVER && SOUND_OVER.play();

    }, true );

    enterElement.addEventListener( 'mouseleave', function() {

      maskElement.classList.contains( 'ready' ) && SOUND_OVER && SOUND_OVER.stop();

    }, true );

    enterElement.addEventListener( 'click', function(){

      if ( manager.total === manager.loaded && !launchElement.classList.contains( 'hide' ) ) {
        SOUND_CLICK.play();
        launchElement.classList.add( 'hide' );
        setTimeout(function(){
          viewer.setPanorama(panoramaPBE);
          
          }, 1500);
      }

    }, false );

    return manager;

  }

/* Planta Baja Exterior */


function telePBI() {
  telespotPBI.unlockHoverElement();
  //viewer.remove(panoramaPBE);
  
  viewer.setPanorama(panoramaPBI);
  viewer.getControl().rotateLeft(4);
  viewer.getControl().rotateUp(0);
  viewer.setCameraFov(100);
  viewer.getControl().update();
}

/* Planta Baja Interior */
const size = 100;
var infospotMat, cuestionarioDos;

/*Selector hotspots*/
let materiales = document.querySelector('#materiales');
let mezcla = document.querySelector('#mezcla');

/*Creación de hotspots*/
infospotMat = new PANOLENS.Infospot( 200, PANOLENS.DataImage.Info );
infospotMat.position.set( 800, 0, -1600  );
infospotMat.addHoverElement( materiales, 200 );
infospotMat.addEventListener('click', onFocus);

cuestionarioDos = new PANOLENS.Infospot( 200, PANOLENS.DataImage.Info );
cuestionarioDos.position.set( 1600, 0, 0  );
cuestionarioDos.addHoverElement( mezcla, 200 );

var telespotPri = new PANOLENS.Infospot( 250, PANOLENS.DataImage.Arrow );
telespotPri.position.set( 1600,0,800  );
//telespotPri.addHoverElement( mezcla, 200 );
telespotPri.addEventListener('click', telePri);
//telespotPri.addHoverText('Primer Piso', 60);

panoramaPBI.add(infospotMat);
panoramaPBI.add(cuestionarioDos);

// panoramaPBI.link(panoramaMezcla, telespotMez[0], /*directorio del icono*/)
// panoramaMezcla.link(panoramaPBI, telespotMez[1], /*directorio del icono*/)

function cuestDos(){
   // viewer.setPanorama(panoramaPBI);
    panoramaPBI.add(telespotPri);
    panoramaPBI.remove(infospotMat);
    panoramaPBI.remove(cuestionarioDos);    
    cuestionarioDos.removeHoverElement();
    telespotPri.focus(2000,  TWEEN.Easing.Exponential.Out);
    telespotPri.show();
    viewer.setCameraFov(50);
}

/* Primer Piso */

let hueco = document.querySelector('#hueco');

var tres = false;

var cuestionarioTres = new PANOLENS.Infospot(70, PANOLENS.DataImage.Info);
cuestionarioTres.position.set( -800, 0, 0);
cuestionarioTres.addHoverElement( hueco, 200 );

function telePri(){
  if (!tres) {
      telespotPri.unlockHoverElement();
      telespotVes.unlockHoverElement();
     viewer.setPanorama(panoramaPriSin);
     viewer.getControl().rotateLeft(4);
      viewer.getControl().rotateUp(0);
      viewer.setCameraFov(70);
      viewer.getControl().update();
  } if (tres) {
    telespotVes.unlockHoverElement();
    viewer.setPanorama(panoramaPriCon);
  }
}

var telespotVes = new PANOLENS.Infospot(50, PANOLENS.DataImage.Arrow);
telespotVes.position.set( -1600, 200, 800);
//telespotPri.addHoverElement( mezcla, 200 );
telespotVes.addEventListener('click', teleVes);
//telespotVes.addHoverText('Vestuarios');

panoramaPriSin.add(cuestionarioTres);
panoramaPriSin.add(telespotVes);

let vestuario = document.querySelector('#vestuario');

infospotVes = new PANOLENS.Infospot( size, PANOLENS.DataImage.Info );
infospotVes.position.set( 800, 0, -1600  );
infospotVes.addHoverElement( vestuario, 200 );
infospotVes.addEventListener('click', onFocus);

function teleVes(){
    telespotVes.unlockHoverElement();
    panoramaVes.add(telespotPri);
    panoramaVes.add(infospotVes);
    telespotPri.position.set(-800, 0, 800)
    viewer.setPanorama(panoramaVes);
}

function onFocus () {
  this.focus( 2000,  TWEEN.Easing.Exponential.Out);
}

function cuestTres() {
  viewer.setPanorama(panoramaPriCon);
  tres = true;
  cuestionarioTres.removeHoverElement();
  panoramaPriCon.add(telespotVes);
  cuestionarioCuatro.show();
}

var cuestionarioCuatro = new PANOLENS.Infospot(size, PANOLENS.DataImage.Info);
cuestionarioCuatro.position.set( -1600, 200, 1200);
cuestionarioCuatro.addHoverElement( extintor, -200 );

panoramaPriCon.add(cuestionarioCuatro);

function cuestCuatro() {
  cuestionarioCuatro.removeHoverElement();
  alert('nos vemos en el Piso dos!');
}
