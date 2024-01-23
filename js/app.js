let HTMLMain;

class fighter {
  constructor( sName, 
               iInit_bon, 
               iInit_value,
               bPje
               ) {
    this.sName = sName;
    this.iInit_bon = iInit_bon;
    this.iInit_value = iInit_value;
    this.bPje = bPje;
  }
  static showInFighters() {
    // devuelve in elemento html que introducir en la lista de combatientes
  }
  static showInInitiative() {
    // devuelve in elemento html que introducir en la lista de iniciativas
  }
  static showInLife() {
    // devuelve in elemento html que introducir en la lista de control de daños
  }
}

function add_fighter() {
  // evento disparado por el botón nuevo del apartado combatientes
  formNewFighter();
}

function formNewFighter(){
  // muestra un formulario donde introducir la información del nuevo combatiente
  /*
    El formulario tendrá dos modos:
     · Personajes (defecto)
     · Criatura

    PERSONAJE
    El modo personaje te deja escribir un nombre, un bono y un valor de iniciativa
    nombre -> sName
    bonif. de inic. -> sInit_bon
    iniciativa -> sInit_value
    sPje = true

    CRIATURA
    El modo criatura te deja escribir un nombre y un bono de iniciativa
    nombre -> sName # (# es un contador numérico que empieza en 1)
    bonif. de inic. -> sInit_bon
    sInit_value = random (1-20) + bono
    sPje = false

    El formulario no se cierra al introducir un combatiente. 
    Sí actualizará las distintas zonas con el combatiente nuevo.
    El formulario dispondrá de un botón 'Cerrar' para cerrar el formulario
    quando de hayan introducido todos los combatientes.
  */
  const p = document.createElement("p");
  p.innerHTML = "Esto es una prova";
  HTMLMain.appendChild(p);
};

window.addEventListener("load", ()=>{
  HTMLMain = document.querySelector("main");
  const btnAddFighter = document.getElementById("btn-add-fighter");
  btnAddFighter.addEventListener("click", add_fighter);
})