/** Elemento HTML global */
let HTMLMain;
/** Listas de la aplicación */
let FightersList = new Array();
let InitiativeList = new Array();
let LifeList = new Array();
/** Control de turnos */
const TurnControl = {
  turno: 0,
  fighterName: "",
  mode: 0 //0:Preparando, 1:Iniciado
};
function updateTurn(){
  if(TurnControl.mode===0) TurnControl.fighterName = InitiativeList[0].sFullName();
};
/** Otras variables globales */
const AppTestMode = false;
const WidthResponsive = 750;
let lastwindowwidth = 0;
let fighterPanelClosed = false;
/** Otras funciones generales */
function toggleFightersPanel(){
  fighterPanelClosed = !fighterPanelClosed;
  showFighters();
};
/******** clase FIGHTER **********/
class fighter {
  constructor( sName, 
               iInit_bon, 
               iInit_value,
               bPje,
               iNumRep,
               iPG
               ) {
    this.sName = sName;
    this.iInit_bon = iInit_bon;
    this.iInit_value = iInit_value;
    this.bPje = bPje;
    this.iNumRep = iNumRep;
    this.iPG = iPG;
    this.iLife = iPG;
    this.iDesEmpInit = (bPje?1000:Math.floor(Math.random()*1000));
  }
  // variables compuestas
  sFullName(){
    if (this.bPje) return this.sName;
    return `${this.sName} ${this.iNumRep}`;
  };
  sInitiative(){
    if (AppTestMode) return `${this.iInit_value}.${this.iInit_bon}.${this.iDesEmpInit}`;
    return `${this.iInit_value}`;
  };
  // metodos de ordenación
  sortByInit(fA, fB) {
    if(fA.iInit_value > fB.iInit_value) return -1;
    if(fA.iInit_value === fB.iInit_value) {
      if(fA.iInit_bon > fB.iInit_bon) return -1;
      if(fA.iInit_bon === fB.iInit_bon) {
        if(fA.iDesEmpInit > fB.iDesEmpInit) return -1;
        return 1;
      }
      return 1;
    }
    return 1;
  }
  sortByName(fA, fB) {
    if (fA.sFullName() < fB.sFullName()) return -1;
    return 1;
  }
  // elemento HTML para COMBATIENTES 
  showInFighters(parent) {
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
    divN.innerHTML = this.sFullName();
    const divI = document.createElement("div");
    divI.classList.add(`fighter-init`);
    divI.innerHTML = this.sInitiative();
    const divA = document.createElement("div");
    divA.classList.add(`fighter-adds`);
    divA.innerHTML = "+";
    divF.appendChild(divN);
    divF.appendChild(divI);
    divF.appendChild(divA);
    parent.appendChild(divF);
  }
  // elemento HTML para TURNO DE INICIATIVA...
  showInInitiative(parent) {
    /*
      <div class="init-fighter init-active">
        <div class="init-value">22</div>
        <div class="init-name">Personaje 1</div>
      </div>
    */
    const divF = document.createElement("div");
    divF.classList.add(`init-fighter`);
    if (TurnControl.fighterName === this.sFullName()) {
      divF.classList.add("init-active");
    }
    const divI = document.createElement("div");
    divI.classList.add(`init-value`);
    divI.innerHTML = this.sInitiative();
    const divN = document.createElement("div");
    divN.classList.add(`init-name`);
    divN.innerHTML = this.sFullName();
    divF.appendChild(divI);
    divF.appendChild(divN);
    parent.appendChild(divF);
  }
  // elemento HTML para CONTROL DE DAÑOS
  showInLife(parent) {
    /*
      <div class="life-fighter life-100">
        <div class="life-name">Bandido 1</div>
        <div class="life-value">12</div>
        <div class="life-total">15</div>
        <button class="life-btn" id="btn-life-up">+</button>
        <button class="life-btn" id="btn-life-dn">-</button>
      </div>
      .life-100 { color: black; background-color: var(--colorLife100);}
      .life-90 { color: white; background-color: var(--colorLife090);}
      .life-70 { color: white; background-color: var(--colorLife070);}
      .life-45 { color: white; background-color: var(--colorLife045);}
      .life-25 { color: white; background-color: var(--colorLife025);}
      .life-5 { color: white; background-color: var(--colorLife005);}
      .life-0 { color: white; background-color: var(--colorLife000);}      
    */
    if(this.bPje) return;
    const divF = document.createElement("div");
    divF.classList.add(`life-fighter`);
    if (this.iLife === this.iPG) divF.classList.add("life-100");
    else if (this.iLife / this.iPG > 0.85) divF.classList.add("life-90");
    else if (this.iLife / this.iPG > 0.55) divF.classList.add("life-70");
    else if (this.iLife / this.iPG > 0.35) divF.classList.add("life-45");
    else if (this.iLife / this.iPG > 0.1) divF.classList.add("life-25");
    else if (this.iLife / this.iPG > 0) divF.classList.add("life-5");
    else divF.classList.add("life-0");
    const divN = document.createElement("div");
    divN.classList.add(`life-name`);
    divN.innerHTML = this.sFullName();
    const divL = document.createElement("div");
    divL.classList.add(`life-value`);
    divL.innerHTML = `${this.iLife}`;
    const divT = document.createElement("div");
    divT.classList.add(`life-total`);
    divT.innerHTML = `${this.iPG}`;
    const btUp = document.createElement("button");
    btUp.classList.add(`life-btn`);
    btUp.innerHTML = "+";
    const btDn = document.createElement("button");
    btDn.classList.add(`life-btn`);
    btDn.innerHTML = "-";
    divF.appendChild(divN);
    divF.appendChild(divL);
    divF.appendChild(divT);
    divF.appendChild(btUp);
    divF.appendChild(btDn);
    parent.appendChild(divF);   
  }
};

/******** Gestión de combatientes ****************/
function getLastFighterByName(sTestName) {
  let fighterNum = 0;
  FightersList.forEach(element => {
    if(element.sName === sTestName) {
      fighterNum = (element.iNumRep>fighterNum ? element.iNumRep : fighterNum);
    }
  });
  fighterNum++;
  return fighterNum;
};
function existsFighterByName(sTestName) {
  let retvalue = false;
  FightersList.forEach(element => {
    if(element.bPje && element.sName === sTestName) {
      retvalue = true;
    }
  });
  return retvalue;
};
function addFighter(bJugador, sNombre, sBonoInic, sIniciativa, bTiradaAuto, sPG){
  if(sNombre === "") return;
  if (sBonoInic === "") sBonoInic = "0";
  const iBono = parseInt(sBonoInic);
  if (sIniciativa === "") sIniciativa = "0";
  let iInit = parseInt(sIniciativa);
  if (sPG === "") sPG = "0";
  let iPG = parseInt(sPG);
  if (bTiradaAuto) iInit = Math.floor(Math.random()*20)+1+iBono;
  if (existsFighterByName(sNombre)) return;
  const newFighter = new fighter(sNombre, iBono, iInit, bJugador, getLastFighterByName(sNombre), iPG);
  FightersList.push(newFighter);
  InitiativeList.push(newFighter);
  InitiativeList.sort(newFighter.sortByInit);
  LifeList.push(newFighter);
  LifeList.sort(newFighter.sortByName);
  updateTurn();
  showFighters();
  showInitiative();
  showLife();
};

/******* Actualizar listas ****************/
function showFighters(){
  const HTMLFightersList = document.getElementById("fighters-list");
  HTMLFightersList.innerHTML = "";
  if(fighterPanelClosed) {
    HTMLFightersList.parentElement.classList.add("panel-cerrado");
    return;
  } else {
    HTMLFightersList.parentElement.classList.remove("panel-cerrado");
  }
  FightersList.forEach(oFighter => { 
    oFighter.showInFighters(HTMLFightersList); 
  });
};
function showInitiative(){
  const HTMLInitiativeList = document.getElementById("initiative-list");
  HTMLInitiativeList.innerHTML = "";
  const hF = 32;
  let heightInitPanel = 0;
  if(window.innerWidth >= WidthResponsive) {
    heightInitPanel = Math.min(InitiativeList.length * hF, 200);
    if(InitiativeList.length > 18) {
      heightInitPanel = Math.ceil(InitiativeList.length/3) * hF;
    } 
  }
  else heightInitPanel = InitiativeList.length * hF;
  HTMLInitiativeList.style.height = `${heightInitPanel}px`;
  
  InitiativeList.forEach(oFighter => { oFighter.showInInitiative(HTMLInitiativeList) });
};
function showLife(){
  const HTMLLifeList = document.getElementById("life-list");
  HTMLLifeList.innerHTML = "";
  LifeList.forEach(oFighter => { oFighter.showInLife(HTMLLifeList) });
};
function checkwindowWidthChange(){
  if (lastwindowwidth+5>WidthResponsive && window.innerWidth<WidthResponsive ||
    lastwindowwidth-5<WidthResponsive && window.innerWidth>WidthResponsive) {
      lastwindowwidth = window.innerWidth;
      showInitiative();
    }
}

/******* Elementos de ayuda para FORMULARIOS **********/
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
function changeCheckBox(checkBox, checkBoxSec, valideElements, invalideElements){
  valideElements.forEach(element => {
    element.disabled = !checkBox.checked;
  });
  invalideElements.forEach(element => {
    element.disabled = checkBox.checked;
  });
  if (checkBoxSec!=undefined) checkBoxSec.checked = !checkBox.checked;
};

/******* FORMULARIOS ******************/
function formNewFighter(){
  const divOpac = document.createElement("div");
  divOpac.classList.add("form-exterior");
  const divForm = document.createElement("div");
  divForm.classList.add("form-dialogo");

  const pTit = document.createElement("p");
  pTit.classList.add("form-titulo");
  pTit.innerHTML = "Nuevo combatiente";

  const iName = formTextInput("Nombre","id-nombre-combatiente");
  const iBono = formTextInput("Bonificador de iniciativa","id-bono-iniciativa",true);
  const iInit = formTextInput("Tirada de iniciativa","id-tira-iniciativa",true);
  const iPtGP = formTextInput("Puntos de golpe (PG)","id-puntos-golpe",true);
  iInit[2].disabled = true;

  const divC = document.createElement("div");
  divC.classList.add("form-button-group");
  const iChbx = document.createElement("input");
  iChbx.classList.add("form-input-checkbox");
  iChbx.setAttribute("type","checkbox");
  iChbx.setAttribute("id","chbxJugador");
  const lbChbx = document.createElement("label");
  lbChbx.setAttribute("for","chbxJugador");
  lbChbx.classList.add("form-label-checkbox");
  lbChbx.innerHTML = "Jugador";
  divC.appendChild(iChbx);
  divC.appendChild(lbChbx);
  
  const divTA = document.createElement("div");
  divTA.classList.add("form-button-group");
  const iChbxTA = document.createElement("input");
  iChbxTA.classList.add("form-input-checkbox");
  iChbxTA.setAttribute("type","checkbox");
  iChbxTA.setAttribute("id","chbxTiradaAuto");
  iChbxTA.checked = true;
  const lbChbxTA = document.createElement("label");
  lbChbxTA.setAttribute("for","chbxTiradaAuto");
  lbChbxTA.classList.add("form-label-checkbox");
  lbChbxTA.innerHTML = "Tirada automática";
  divTA.appendChild(iChbxTA);
  divTA.appendChild(lbChbxTA);
  
  iChbx.addEventListener("click", ()=>{ changeCheckBox(iChbx, iChbxTA, [iInit[2]], [iPtGP[2]])} );
  lbChbx.addEventListener("click", ()=>{ changeCheckBox(iChbx, iChbxTA, [iInit[2]], [iPtGP[2]])} );
  iChbxTA.addEventListener("click", ()=>{ changeCheckBox(iChbxTA, undefined, [], [iInit[2]])} );
  lbChbxTA.addEventListener("click", ()=>{ changeCheckBox(iChbxTA, undefined, [], [iInit[2]])} );

  const divB = document.createElement("div");
  divB.classList.add("form-button-group");
  const bAdd = document.createElement("button");
  bAdd.classList.add("btn","form-button");
  bAdd.innerHTML = "AÑADIR";
  bAdd.addEventListener("click", ()=>{
    addFighter(iChbx.checked, iName[2].value, iBono[2].value, iInit[2].value, iChbxTA.checked, iPtGP[2].value);
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
  divForm.appendChild(iPtGP[0]);
  divForm.appendChild(divC);
  divForm.appendChild(divTA);
  divForm.appendChild(divB);

  divOpac.appendChild(divForm);
  HTMLMain.appendChild(divOpac);
};

// --- MAIN ENTRY ---------------------------------------------------

window.addEventListener("load", ()=>{
  HTMLMain = document.querySelector("main");
  window.addEventListener("resize", checkwindowWidthChange);
  const btnAddFighter = document.getElementById("btn-add-fighter");
  btnAddFighter.addEventListener("click", formNewFighter);
})