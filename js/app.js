let HTMLMain;
let FightersList = new Array();
let InitiativeList = new Array();
let LifeList = new Array();


class fighter {
  constructor( sName, 
               iInit_bon, 
               iInit_value,
               bPje,
               iNumRep
               ) {
    this.sName = sName;
    this.iInit_bon = iInit_bon;
    this.iInit_value = iInit_value;
    this.bPje = bPje;
    this.iNumRep = iNumRep;
  }
  showInFighters(parent) {
    // devuelve in elemento html que introducir en la lista de combatientes
    /*
        <div class="fighter">
          <div class="fighter-name">Bandido 1</div>
          <div class="fighter-init">17</div>
          <div class="fighter-adds">+</div>
        </div> 
     */
    const divF = document.createElement("div");
    divF.classList.add(`fighter`);
    const divN = document.createElement("div");
    divN.classList.add(`fighter-name`);
    divN.innerHTML = this.sName;
    const divI = document.createElement("div");
    divI.classList.add(`fighter-init`);
    divI.innerHTML = this.iInit_value.toString();
    const divA = document.createElement("div");
    divA.classList.add(`fighter-adds`);
    divA.innerHTML = "+";
    divF.appendChild(divN);
    divF.appendChild(divI);
    divF.appendChild(divA);
    parent.appendChild(divF);
  }
  showInInitiative(parent) {
    // devuelve in elemento html que introducir en la lista de iniciativas
  }
  showInLife(parent) {
    // devuelve in elemento html que introducir en la lista de control de daños
  }
}

function showFighters(){
  const HTMLFightersList = document.getElementById("fighters-list");
  HTMLFightersList.innerHTML = "";
  console.log(FightersList.length);
  FightersList.forEach(oFighter => { 
    console.log(oFighter.sName);
    oFighter.showInFighters(HTMLFightersList); 
  });
};
function showInitiative(){
  const HTMLInitiativeList = document.getElementById("initiative-list");
  HTMLInitiativeList.innerHTML = "";
  InitiativeList.forEach(oFighter => { oFighter.showInInitiative(HTMLInitiativeList) });
};
function showLife(){
  const HTMLLifeList = document.getElementById("life-list");
  HTMLLifeList.innerHTML = "";
  LifeList.forEach(oFighter => { oFighter.showInLife(HTMLLifeList) });
};

function formTextInput(Caption, ID, bOnlyNumbers = false){
  const div = document.createElement("div");
  div.classList.add("form-line-group");
  const pText = document.createElement("p");
  pText.classList.add("form-textinput-text");
  pText.innerHTML = Caption;
  const iText = document.createElement("input");
  iText.classList.add("form-textinput-input");
  iText.setAttribute("id",ID);
  if(bOnlyNumbers) iText.setAttribute("type","number");
  div.appendChild(pText);
  div.appendChild(iText);
  return [div,pText,iText];
};

function changeCheckBox(checkBox, elements){
  elements.forEach(element => {
    element.disabled = !checkBox.checked;
  });
};
function addFighter(bJugador, sNombre, sBonoInic, sIniciativa){
  console.log("Dentro");
  if(sNombre === "") return;
  console.log("Pasado prueba nombre");
  if (sBonoInic === "") sBonoInic = "0";
  const iBono = parseInt(sBonoInic);
  if (sIniciativa === "") sIniciativa = "0";
  const iInit = parseInt(sIniciativa);
  console.log(`
    Jugador: ${bJugador},
    Nombre: ${sNombre},
    Bono: ${sBonoInic},
    Init: ${sIniciativa}
  `);
  const newFighter = new fighter(sNombre, iBono, iInit, bJugador);
  FightersList.push(newFighter);
  showFighters();
};
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
  const divOpac = document.createElement("div");
  divOpac.classList.add("form-exterior");
  const divForm = document.createElement("div");
  divForm.classList.add("form-dialogo");

  const pTit = document.createElement("p");
  pTit.classList.add("form-titulo");
  pTit.innerHTML = "Nuevo combatiente";

  const iName = formTextInput("Nombre","id-nombre-combatiente");
  const iBono = formTextInput("Bonif. Inic.","id-bono-iniciativa",true);
  const iInit = formTextInput("Tirada Inic.","id-tira-iniciativa",true);
  iInit[2].disabled = true;

  const divC = document.createElement("div");
  divC.classList.add("form-button-group");
  const iChbx = document.createElement("input");
  iChbx.classList.add("form-input-checkbox");
  iChbx.setAttribute("type","checkbox");
  iChbx.setAttribute("id","chbxJugador");
  iChbx.addEventListener("click", ()=>{ changeCheckBox(iChbx, [iInit[2]])} );
  const lbChbx = document.createElement("label");
  lbChbx.setAttribute("for","chbxJugador");
  lbChbx.classList.add("form-label-checkbox");
  lbChbx.addEventListener("click", ()=>{ changeCheckBox(iChbx, [iInit[2]])} );
  lbChbx.innerHTML = "Jugador";
  divC.appendChild(iChbx);
  divC.appendChild(lbChbx);

  const divB = document.createElement("div");
  divB.classList.add("form-button-group");
  const bAdd = document.createElement("button");
  bAdd.classList.add("btn","form-button");
  bAdd.innerHTML = "AÑADIR";
  bAdd.addEventListener("click", ()=>{
    addFighter(iChbx.checked, iName[2].value, iBono[2].value, iInit[2].value);
  });
  const bCls = document.createElement("button");
  bCls.classList.add("btn","form-button");
  bCls.innerHTML = "CERRAR";
  bCls.addEventListener("click", ()=>{
    divOpac.remove();
  });
  divB.appendChild(bAdd);
  divB.appendChild(bCls);

  divForm.appendChild(pTit);
  divForm.appendChild(iName[0]);
  divForm.appendChild(iBono[0]);
  divForm.appendChild(iInit[0]);
  divForm.appendChild(divC);
  divForm.appendChild(divB);

  divOpac.appendChild(divForm);
  HTMLMain.appendChild(divOpac);
};

// --- MAIN ENTRY ---------------------------------------------------

window.addEventListener("load", ()=>{
  HTMLMain = document.querySelector("main");
  const btnAddFighter = document.getElementById("btn-add-fighter");
  btnAddFighter.addEventListener("click", formNewFighter);
})