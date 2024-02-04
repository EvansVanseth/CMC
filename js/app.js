/** Elemento HTML global */
let HTMLMain;
/** Listas de la aplicación */
let FightersList = new Array();
let InitiativeList = new Array();
let LifeList = new Array();
let LoadList = new Array();
/** Control de turnos */
let TurnControl = {
  turno: 0,
  fighterPos: 99999999,
  fighterName: "",
  mode: 0 //0:Preparando, 1:Iniciado
};
let htmlNumTurno = null;
let htmlBtnTurno = null;
let htmlStatsData = null;
function clearCombat(){
  if (!confirm(`Esta acción vaciará el combate entero y se reiniciará todo.
  
  ¿Quieres hacerlo igualmente?`)) return;
  FightersList.splice(0, FightersList.length);
  InitiativeList.splice(0, InitiativeList.length);
  LifeList.splice(0, LifeList.length);
  FightersList.length = 0;
  InitiativeList.length = 0;
  LifeList.length = 0;
  TurnControl.turno = 0;
  TurnControl.fighterPos = 999999999;
  TurnControl.fighterName = "";
  TurnControl.mode = 0;
  htmlBtnTurno.innerHTML = "INICIAR";
  showFighters();
  showLife();
  updateTurn();
  saveLocal();
};
function saveLocal(){
  localStorage.setItem("cmc-turn-cont", JSON.stringify(TurnControl));
  localStorage.setItem("cmc-figh-list", JSON.stringify(FightersList));
  localStorage.setItem("cmc-init-list", JSON.stringify(InitiativeList));
  localStorage.setItem("cmc-life-list", JSON.stringify(LifeList));
}
function loadLocal(){
  if(localStorage.getItem("cmc-turn-cont")!=null)
    TurnControl = JSON.parse(localStorage.getItem("cmc-turn-cont"));
  if(localStorage.getItem("cmc-figh-list")!=null)
    LoadList = JSON.parse(localStorage.getItem("cmc-figh-list"));
  LoadList.forEach(element => {
    const newFighter = new fighter("A", "0", "0", false, 0, 0);
    newFighter.sName = element.sName;
    newFighter.iInit_bon = element.iInit_bon;
    newFighter.iInit_value = element.iInit_value;
    newFighter.iBono_control = element.iBono_control;
    newFighter.iInit_control = element.iInit_control;
    newFighter.bPje = element.bPje;
    newFighter.iNumRep = element.iNumRep;
    newFighter.iPG = element.iPG;
    newFighter.iLife = element.iLife;
    newFighter.iDesEmpInit = element.iDesEmpInit;
    newFighter.iControlInit = element.iControlInit;
    element.states.forEach(eleState => {
      const newState = new state(eleState.iIcon,
                               eleState.sName,
                               eleState.sDesc,
                               eleState.bInca,
                               eleState.iTurnos,
                               newFighter.sFullName());
      newFighter.states.push(newState);
    });
    
    FightersList.push(newFighter);
    InitiativeList.push(newFighter);
    LifeList.push(newFighter);
  })
  InitiativeList.sort(fighter.sortByInit);
  LifeList.sort(fighter.sortByName);
  showFighters();
  showLife();
  showInitiative();
}
function updateTurn(){
  if(TurnControl.mode===0) {
    TurnControl.fighterName = "";
    TurnControl.fighterPos = 999999999;
    htmlNumTurno.innerHTML = "Prep.";
  } else {
    htmlNumTurno.innerHTML = `${TurnControl.turno}`;
  }
  showInitiative();
};
function nextFighter(){
  let fighterFind = "";
  console.log(FightersList.length);
  if(FightersList.length<1) return;
  if(TurnControl.mode===0) {
    if(!confirm(`¿Todo listo? ¿Empezamos?`)) return;
    TurnControl.mode = 1;
    htmlBtnTurno.innerHTML = "SIGUIENTE";
    TurnControl.fighterPos = InitiativeList[0].iControlInit;
    TurnControl.fighterName = InitiativeList[0].sFullName();
  } else {
    htmlBtnTurno.innerHTML = "SIGUIENTE";
    do {
      if(TurnControl.fighterPos<80000000 || 
        TurnControl.fighterName === InitiativeList[InitiativeList.length-1].sFullName()) {
        TurnControl.fighterPos = InitiativeList[0].iControlInit + 1;
        TurnControl.fighterName = "";
        TurnControl.turno++;
      } else {
        TurnControl.fighterPos--;
        fighterFind = getFighterByInit(TurnControl.fighterPos);
      }
    } while (fighterFind==="");
    TurnControl.fighterName = fighterFind;
  }
  updateTurn();
  saveLocal();
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
/******** clase ESTADO Alterado **********/
class state {
  constructor( iIcon,
               sName,
               sDesc,
               bInca,
               iTurnos,
               fighterName) {
    this.iIcon = iIcon;
    this.sName = sName;
    this.sDesc = sDesc;
    this.bInca = bInca;
    this.iTurnos = iTurnos;
    this.fighterName = fighterName;
  }
  showStateInEdit(divOpac){
    const divS = document.createElement("div");
    divS.classList.add("state-frame");

    const pName = document.createElement("p");
    pName.classList.add("state-name");
    pName.innerHTML = `${this.sName} ${(this.bInca?'[X] ':' ')}`;
    const pTurn = document.createElement("p");
    pTurn.classList.add("state-turn");
    pTurn.innerHTML = `${this.iTurnos}`;
    const divE = document.createElement("div");
    divE.classList.add("state-edit");
    divE.addEventListener("click", ()=>{
      divOpac.remove();
      const oFighter = getFighterByName(this.fighterName);
      formEditState(oFighter, this);
    })
    const divD = document.createElement("div");
    divD.classList.add("state-delete");
    divD.addEventListener("click", ()=>{
      divOpac.remove();
      const oFighter = getFighterByName(this.fighterName);
      oFighter.states = oFighter.states.filter(e => e!==this);
      formEditFighter(oFighter);
    })
    const pDesc = document.createElement("p");
    pDesc.classList.add("state-desc");
    pDesc.innerHTML = `${this.sDesc}`;    
    
    divS.appendChild(pName);
    divS.appendChild(pTurn);
    divS.appendChild(divE);
    divS.appendChild(divD);
    divS.appendChild(pDesc);

    return divS;
  };
  showStateInInit(){
    const divS = document.createElement("div");
    divS.classList.add("state-init-frame");

    const pName = document.createElement("p");
    pName.classList.add("state-name");
    pName.innerHTML = `${this.sName} ${(this.bInca?'[X] ':' ')}`;
    
    const pTurn = document.createElement("p");
    pTurn.classList.add("state-turn");
    pTurn.innerHTML = `${this.iTurnos}`;
    
    const pDesc = document.createElement("p");
    pDesc.classList.add("state-desc");
    pDesc.innerHTML = `${this.sDesc}`;    
    
    divS.appendChild(pName);
    divS.appendChild(pTurn);
    divS.appendChild(pDesc);

    return divS;
  };
};
/******** clase FIGHTER **********/
class fighter {
  constructor( sName, 
               sBono, 
               sInit,
               bPje,
               iNumRep,
               iPG
               ) {
    this.sName = sName;
    this.iInit_bon = 0;
    this.iInit_value = 0;
    this.iBono_control = 0;
    this.iInit_control = 0;
    this.bPje = bPje;
    this.iNumRep = iNumRep;
    this.iPG = iPG;
    this.iLife = iPG;
    this.iDesEmpInit = (bPje?999:Math.floor(Math.random()*1000));
    this.iControlInit = 0;
    this.states = new Array();
    this.setBono(sBono);
    this.setInit(sInit);
    this.UpdateControlInit();
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
  UpdateControlInit(){
    this.iControlInit = (this.iInit_control * 1000000) +
                        (this.iBono_control * 1000) + 
                        (this.iDesEmpInit);
  };
  //actualizaciones de iniciativa
  setBono(sBono){
    if(sBono==="") sBono="0";
    this.iInit_bon = parseInt(sBono);
    if(this.iInit_bon>899) this.iInit_bon=899;
    this.iBono_control = parseInt(sBono) + 100;
    if(this.iBono_control>999) this.iBono_control=999;
    this.UpdateControlInit();
  };
  setInit(sInit){
    if(sInit==="") sInit="0";
    this.iInit_value = parseInt(sInit);
    if(this.iInit_value>899) this.iInit_value=899;
    this.iInit_control = parseInt(sInit) + 100;
    if(this.iInit_control>999) this.iInit_control=999;
    this.UpdateControlInit();
  };
  // metodos de ordenación
  static sortByInit(fA, fB) {
    if(fA.iControlInit > fB.iControlInit) return -1;
    return 1;
  }
  static sortByName(fA, fB) {
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
    divA.addEventListener("click", ()=>{
      formEditFighter(this);
    })
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
      console.log(htmlStatsData);
      if(htmlStatsData!==null) {
        this.states.forEach(stateIn => {
          htmlStatsData.appendChild(stateIn.showStateInInit());
        })
      }
    }
    if (this.iLife <= 0) {
      divF.classList.add("init-dead");
    }
    divF.addEventListener("click", () => {
      formEditFighter(this);
    })
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
    if (this.iLife > this.iPG) divF.classList.add("life-100");
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
    btUp.addEventListener("click", ()=>{
      formHealFighter(this);
    })
    const btDn = document.createElement("button");
    btDn.classList.add(`life-btn`);
    btDn.innerHTML = "-";
    btDn.addEventListener("click", ()=>{
      formDealFighter(this);
    })
    divF.appendChild(divN);
    divF.appendChild(divL);
    divF.appendChild(divT);
    divF.appendChild(btUp);
    divF.appendChild(btDn);
    parent.appendChild(divF);   
  }
};

/******** Gestión de combatientes ****************/
function getFighterByInit(iInitValue) {
  let fighterName = "";
  FightersList.forEach(element => {
    if(element.iControlInit === iInitValue && 
       element.iLife > 0 // No selecciona si no está vivo
                         // No selecciona si tiene algún estado alterado que no lo deja actuar
       ) {
      fighterName = element.sFullName();
    }
  });
  return fighterName;
};
function getFighterByName(sTestName) {
  let oFighter;
  FightersList.forEach(element => {
    if(element.sFullName() === sTestName) {
      oFighter = element;
    }
  });
  return oFighter;
};
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
function posInitFighterByName(sTestName) {
  for(let i=0; i<InitiativeList.length;i++) {
    if (InitiativeList[i].sFullName()===sTestName) {
      return i;
    }
  }
  return -1;
};
function posCombFighterByName(sTestName) {
  for(let i=0; i<FightersList.length;i++) {
    if (FightersList[i].sFullName()===sTestName) {
      return i;
    }
  }
  return -1;
};
function posLifeFighterByName(sTestName) {
  for(let i=0; i<LifeList.length;i++) {
    if (LifeList[i].sFullName()===sTestName) {
      return i;
    }
  }
  return -1;
};
function addFighter(bJugador, sNombre, sBonoInic, sIniciativa, bTiradaAuto, sPG){
  if(sNombre === "") return;
  if (sPG === "") sPG = "0";
  let iPG = parseInt(sPG);
  if (existsFighterByName(sNombre)) return;
  const newFighter = new fighter(sNombre, 
                                 sBonoInic, 
                                 sIniciativa, 
                                 bJugador, 
                                 getLastFighterByName(sNombre), 
                                 iPG);
  if (bTiradaAuto) newFighter.setInit(Math.floor(Math.random()*20)+1+newFighter.iInit_bon);
  FightersList.push(newFighter);
  InitiativeList.push(newFighter);
  InitiativeList.sort(fighter.sortByInit);
  LifeList.push(newFighter);
  LifeList.sort(fighter.sortByName);
  showFighters();
  updateTurn();
  showLife();
  saveLocal();
};
function editFighter(oFighter, sBonoInic, sIniciativa){
  oFighter.setBono(sBonoInic);
  oFighter.setInit(sIniciativa);
  InitiativeList.sort(oFighter.sortByInit);
  if(TurnControl.fighterName === oFighter.sFullName()) nextFighter();
  else showInitiative();
  showFighters();
  showLife();
  saveLocal();
};
function deleteFighter(oFighter){
  InitiativeList.splice(posInitFighterByName(oFighter.sFullName()),1);
  FightersList.splice(posCombFighterByName(oFighter.sFullName()),1);
  LifeList.splice(posLifeFighterByName(oFighter.sFullName()),1);
  if(TurnControl.fighterName === oFighter.sFullName()) nextFighter();
  else showInitiative();
  showFighters();
  showLife();
  saveLocal();
};
function dealFighter(oFighter, sDano){
  if (sDano==="") sDano="0";
  oFighter.iLife -= parseInt(sDano);
  showLife();
  showInitiative();
  saveLocal();
};
function healFighter(oFighter, sDano){
  if (sDano==="") sDano="0";
  oFighter.iLife += parseInt(sDano);
  showLife();
  showInitiative();
  saveLocal();
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
  if(htmlStatsData!==null) htmlStatsData.innerHTML = "";
  const hF = 32;
  let heightInitPanel = 0;
  if(window.innerWidth >= WidthResponsive) {
    heightInitPanel = Math.min(InitiativeList.length * hF, 200);
    if(InitiativeList.length > 12) {
      heightInitPanel = Math.ceil(InitiativeList.length/2) * hF;
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
function formPrep(){
  const divOpac = document.createElement("div");
  divOpac.classList.add("form-exterior");
  const divForm = document.createElement("div");
  divForm.classList.add("form-dialogo");
  divOpac.appendChild(divForm);
  return [divOpac, divForm];
};
function formTitle(Caption){
  const pTit = document.createElement("p");
  pTit.classList.add("form-titulo");
  pTit.innerHTML = Caption;  
  return pTit;
}
function formSeccion(Caption){
  const pTit = document.createElement("p");
  pTit.classList.add("form-seccion");
  pTit.innerHTML = Caption;  
  return pTit;
}
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
function formMemoInput(Caption, ID){
  const div = document.createElement("div");
  div.classList.add("form-memo-group");
  const pText = document.createElement("p");
  pText.classList.add("form-textinput-text");
  pText.innerHTML = Caption;
  const iText = document.createElement("textarea");
  iText.classList.add("form-textinput-memo");
  iText.setAttribute("id",ID);
  iText.setAttribute("oninput","autogrow(this)");
  div.appendChild(pText);
  div.appendChild(iText);
  return [div,pText,iText];
};
function formCheckBox(Caption, ID) {
  const divC = document.createElement("div");
  divC.classList.add("form-line-group");
  const iChbx = document.createElement("input");
  iChbx.classList.add("form-input-checkbox");
  iChbx.setAttribute("type","checkbox");
  iChbx.setAttribute("id",ID);
  const lbChbx = document.createElement("label");
  lbChbx.setAttribute("for",ID);
  lbChbx.classList.add("form-label-checkbox");
  lbChbx.innerHTML = Caption;
  divC.appendChild(lbChbx);  
  divC.appendChild(iChbx);
  return [divC, iChbx, lbChbx];
}
function changeCheckBox(checkBox, checkBoxSec, valideElements, invalideElements){
  valideElements.forEach(element => {
    element.disabled = !checkBox.checked;
  });
  invalideElements.forEach(element => {
    element.disabled = checkBox.checked;
  });
  if (checkBoxSec!=undefined) checkBoxSec.checked = !checkBox.checked;
};
function formButtons(numButtons, Captions, OnCliks){
  const buttons = new Array();
  const divB = document.createElement("div");
  divB.classList.add("form-button-group");
  for(let i=0; i<numButtons;i++){
    const bAdd = document.createElement("button");
    bAdd.classList.add("btn","form-button");
    bAdd.innerHTML = Captions[i];
    bAdd.addEventListener("click", OnCliks[i]);
    divB.appendChild(bAdd);
    buttons.push(bAdd);
  }
  return [divB, buttons];
}
function autogrow(element) {
  element.style.height = "5px";
  element.style.height = (element.scrollHeight) + "px";
}
/******* FORMULARIOS ******************/
function formNewFighter(){
  const divOpac = formPrep();

  // VISUAL
  const pTit = formTitle("Nuevo combatiente");
  const iName = formTextInput("Nombre","id-nombre-combatiente");
  const iBono = formTextInput("Bonificador de iniciativa","id-bono-iniciativa",true);
  const iInit = formTextInput("Tirada de iniciativa","id-tira-iniciativa",true);
  const iPtGP = formTextInput("Puntos de golpe (PG)","id-puntos-golpe",true);
  const iChbxJ = formCheckBox("Jugador", "chbxJugador");
  const iChbxT = formCheckBox("Tirada automatica", "chbxTiradaAuto");
  const divB = formButtons(2, ["AÑADIR", "CERRAR"], [
    () => { addFighter(iChbxJ[1].checked, 
                       iName[2].value, 
                       iBono[2].value, 
                       iInit[2].value, 
                       iChbxT[1].checked, 
                       iPtGP[2].value); },
    () => { divOpac[0].remove(); }
  ]);
  // LOGICA
  iInit[2].disabled = true;
  iChbxT[1].checked = true;
  iChbxJ[1].addEventListener("click", ()=>{ changeCheckBox(iChbxJ[1], iChbxT[1], [iInit[2]], [iPtGP[2]])} );
  iChbxJ[2].addEventListener("click", ()=>{ changeCheckBox(iChbxJ[1], iChbxT[1], [iInit[2]], [iPtGP[2]])} );
  iChbxT[1].addEventListener("click", ()=>{ changeCheckBox(iChbxT[1], undefined, [], [iInit[2]])} );
  iChbxT[2].addEventListener("click", ()=>{ changeCheckBox(iChbxT[1], undefined, [], [iInit[2]])} );
  
  // MONTAJE
  divOpac[1].appendChild(pTit);
  divOpac[1].appendChild(iChbxJ[0]);
  divOpac[1].appendChild(iName[0]);
  divOpac[1].appendChild(iBono[0]);
  divOpac[1].appendChild(iInit[0]);
  divOpac[1].appendChild(iPtGP[0]);
  divOpac[1].appendChild(iChbxT[0]);
  divOpac[1].appendChild(divB[0]);
  HTMLMain.appendChild(divOpac[0]);
};
function formEditFighter(oFighter){
  const divOpac = formPrep();
  // VISUAL
  const pTit = formTitle(oFighter.sFullName());
  const pTIt = formSeccion(`Iniciativa`);
  const iBono = formTextInput("Bonificador de iniciativa","id-bono-iniciativa",true);
  const iInit = formTextInput("Tirada de iniciativa","id-tira-iniciativa",true);
  const divB = formButtons(2, ["ACEPTAR","CERRAR"], [
    ()=>{ editFighter(oFighter, iBono[2].value, iInit[2].value); },
    ()=>{ divOpac[0].remove(); }
  ]);
  const pTEt = formSeccion(`Estados alterados`);
  const divE = formButtons(1, ["AÑADIR"], [
    ()=>{ divOpac[0].remove(); formAddState(oFighter); }
  ]);
  const pTEc = formSeccion(`Borrado`);
  const divD = formButtons(1, ["ELIMINAR COMBATIENTE"], [
    ()=>{ divOpac[0].remove(); deleteFighter(oFighter, iBono[2].value, iInit[2].value); }
  ]);

  // LOGICA
  iBono[2].value = `${oFighter.iInit_bon}`;
  iInit[2].value = `${oFighter.iInit_value}`;

  //MONTAJE
  divOpac[1].appendChild(pTit);
  divOpac[1].appendChild(pTIt);
  divOpac[1].appendChild(iBono[0]);
  divOpac[1].appendChild(iInit[0]);
  divOpac[1].appendChild(divB[0]);
  divOpac[1].appendChild(pTEt);
  oFighter.states.forEach(stateIn => {
    divOpac[1].appendChild(stateIn.showStateInEdit(divOpac[0]));
  })
  divOpac[1].appendChild(divE[0]);
  divOpac[1].appendChild(pTEc);
  divOpac[1].appendChild(divD[0]);
  HTMLMain.appendChild(divOpac[0]);
};
function formDealFighter(oFighter){
  const divOpac = formPrep();
  // VISUAL
  const pTit = formTitle(`Dañar a ${oFighter.sFullName()}`)
  const iDano = formTextInput("Daño causado","id-dano",true);

  const divB = formButtons(2, ["ACEPTAR","CERRAR"], [
    ()=>{ dealFighter(oFighter, iDano[2].value); },
    ()=>{ divOpac[0].remove(); }
  ]);  
  //MONTAJE
  divOpac[1].appendChild(pTit);
  divOpac[1].appendChild(iDano[0]);
  divOpac[1].appendChild(divB[0]);
  HTMLMain.appendChild(divOpac[0]);
};
function formHealFighter(oFighter){
  const divOpac = formPrep();
  // VISUAL
  const pTit = formTitle(`Sanar a ${oFighter.sFullName()}`)
  const iDano = formTextInput("Daño sanado","id-dano",true);
  
  const divB = formButtons(2, ["ACEPTAR","CERRAR"], [
    ()=>{ healFighter(oFighter, iDano[2].value); },
    ()=>{ divOpac[0].remove(); }
  ]);  
  //MONTAJE
  divOpac[1].appendChild(pTit);
  divOpac[1].appendChild(iDano[0]);
  divOpac[1].appendChild(divB[0]);
  HTMLMain.appendChild(divOpac[0]);
};
function formAddState(oFighter){
  const divOpac = formPrep();
  
  const pTit = formSeccion(`Añadir estado alterado a ${oFighter.sFullName()}`);
  const iName = formTextInput("Nombre","id-state-name",false);
  const iDesc = formMemoInput("Descripción","id-state-desc");
  const iChbx = formCheckBox("Incapacitante","id-state-donothing");
  const iNTrn = formTextInput("Turnos","id-state-truns",true);
  const divB = formButtons(2, ["ACEPTAR","CANCELAR"], [
    ()=>{
      divOpac[0].remove();
      const newState = new state(0, iName[2].value, 
                                    iDesc[2].value, 
                                    iChbx[1].checked, 
                                    iNTrn[2].value, 
                                    oFighter.sFullName());
      oFighter.states.push(newState);
      formEditFighter(oFighter);
    },
    ()=>{ divOpac[0].remove(); formEditFighter(oFighter); }
  ])

  divOpac[1].appendChild(pTit);
  divOpac[1].appendChild(iName[0]);
  divOpac[1].appendChild(iDesc[0]);
  divOpac[1].appendChild(iNTrn[0]);
  divOpac[1].appendChild(iChbx[0]);
  divOpac[1].appendChild(divB[0]);
  HTMLMain.appendChild(divOpac[0]);
};
function formEditState(oFighter, oState){
  const divOpac = formPrep();
  
  const pTit = formSeccion(`Añadir estado alterado a ${oFighter.sFullName()}`);
  const iName = formTextInput("Nombre","id-state-name",false);
  const iDesc = formMemoInput("Descripción","id-state-desc");
  const iChbx = formCheckBox("Incapacitante","id-state-donothing");
  const iNTrn = formTextInput("Turnos","id-state-truns",true);
  const divB = formButtons(2, ["ACEPTAR","CANCELAR"], [
    ()=>{
      divOpac[0].remove();
      oState.sName   = iName[2].value;
      oState.sDesc   = iDesc[2].value;
      oState.bInca   = iChbx[1].checked;
      oState.iTurnos = parseInt(iNTrn[2].value);
      formEditFighter(oFighter);
    },
    ()=>{ divOpac[0].remove(); formEditFighter(oFighter); }
  ])

  iName[2].value = oState.sName;
  iDesc[2].value = oState.sDesc;
  iChbx[1].checked = oState.bInca;
  iNTrn[2].value = oState.iTurnos.toString();

  divOpac[1].appendChild(pTit);
  divOpac[1].appendChild(iName[0]);
  divOpac[1].appendChild(iDesc[0]);
  divOpac[1].appendChild(iNTrn[0]);
  divOpac[1].appendChild(iChbx[0]);
  divOpac[1].appendChild(divB[0]);
  HTMLMain.appendChild(divOpac[0]);
};

// --- MAIN ENTRY ---------------------------------------------------

window.addEventListener("load", ()=>{
  HTMLMain = document.querySelector("main");
  
  loadLocal();
  
  htmlNumTurno = document.querySelector("#num-turno");
  window.addEventListener("resize", checkwindowWidthChange);
  
  const btnAddFighter = document.getElementById("btn-add-fighter");
  btnAddFighter.addEventListener("click", formNewFighter);
  
  htmlBtnTurno = document.getElementById("btn-next-turn");
  htmlBtnTurno.addEventListener("click", nextFighter);
  if (TurnControl.mode===1) htmlBtnTurno.innerHTML = "CONTINUAR"
  
  const btnClearCombat = document.getElementById("btn-clear-combat");
  btnClearCombat.addEventListener("click", clearCombat);
  
  htmlStatsData = document.getElementById("stats-data");
  console.log(htmlStatsData);
  
  updateTurn();
})