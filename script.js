// Function to create input rows for custom option
function createCustomInputs(container) {
  createInputRow(
    container,
    "web-thickness",
    "Web Thickness",
    "float",
    5,
    " mm"
  );
  createInputRow(
    container,
    "flange-thickness",
    "Input Flange Thickness",
    "float",
    7,
    " mm"
  );
  createInputRow(
    container,
    "yield-strength",
    "Input Steel Yield Strength",
    "integer",
    350,
    " MPa"
  );
  createInputRow(
    container,
    "elastic-modulus",
    "Input Elastic Modulus",
    "integer",
    200000,
    " MPa"
  );
}

// Function to set "custom" as the default option and create inputs accordingly
function setCustomDefaultAndListen() {
  const selectMenu = document.getElementById("shape-select"); // Replace 'shape-select' with your actual ID
  const inputsContainer = document.getElementById("inputs-container");

  // Set "custom" as the default option
  selectMenu.value = "custom";

  // Create inputs for "custom" option on page load
  createCustomInputs(inputsContainer);
  createCustomProperties();
  createCustomEventListeners();
  calculate();

  // Add event listener for select menu changes
  selectMenu.addEventListener("change", function () {
    const selectedOption = this.value;
    inputsContainer.innerHTML = "";

    if (selectedOption === "custom") {
      createCustomInputs(inputsContainer);
      createCustomProperties();
      createCustomEventListeners();
      calculate();
    } else if (selectedOption === "w-shape-metric") {
      createShapeMenu(inputsContainer, beamDetails, "Dsg");
      createWshapeProperties(0);
      calculate();
    } else if (selectedOption === "w-shape-imperial") {
      createShapeMenu(inputsContainer, beamDetails, "Ds_i");
      createWshapeProperties(0);
      calculate();
    }
  });
}

function createInputRow(container, id, label, type, initialValue, unit) {
  const row = document.createElement("div");
  row.classList.add("input-row");

  const inputLabel = document.createElement("label");
  inputLabel.textContent = label + ":";
  const input = document.createElement("input");
  input.setAttribute("type", type);
  input.setAttribute("id", id);
  input.setAttribute("value", initialValue);
  input.dataset.type = type;
  input.dataset.unit = unit;
  input.addEventListener("change", calculate);

  const unitLabel = document.createElement("span");
  unitLabel.textContent = unit;

  row.appendChild(inputLabel);
  row.appendChild(input);
  row.appendChild(unitLabel);
  container.appendChild(row);
}

function createShapeMenu(container, data, key) {
  const select = document.createElement("select");

  data.forEach((item, index) => {
    const option = document.createElement("option");
    option.textContent = item[key];
    option.setAttribute("value", index);
    select.appendChild(option);
  });

  select.addEventListener("change", function () {
    const selectedIndex = parseInt(this.value);
    // might need to pass it later, keep for now
    const selectedBeam = data[selectedIndex];
    createWshapeProperties(selectedIndex);
    calculate();
  });

  container.appendChild(select);
}

function createCustomProperties() {
  document.querySelector(".section-properties").style.display = "none";
  document.querySelector(".not-custom").style.display = "none";
  document.getElementById("material-not-custom").style.display = "none";
  document.getElementById("material-custom").style.display = "block";

  updateCustomProp("web-thickness", "W");
  updateCustomProp("flange-thickness", "T");

  updateCustomMaterial("yield-strength", "fy-custom");
  updateCustomMaterial("elastic-modulus", "E-custom");

  updateSelectedBeam("custom");
}

function createWshapeProperties(index) {
  document.getElementById("material-custom").style.display = "none";
  document.querySelector(".section-properties").style.display = "block";
  document.querySelector(".not-custom").style.display = "block";
  document.getElementById("material-not-custom").style.display = "block";

  updateBeamSect(index, "Dsg");
  updateBeamSect(index, "Ds_i");

  updateBeampProp(index, "D");
  updateBeampProp(index, "B");
  updateBeampProp(index, "T");
  updateBeampProp(index, "W");

  updateSelectedBeam(index);
}

function updateCustomProp(index, notation) {
  const element = document.querySelector(`#${notation}`);
  const elementChildToRemove = element.children[0];
  if (elementChildToRemove) {
    element.removeChild(elementChildToRemove);
  }
  const elementSpan = document.createElement("span");
  elementSpan.textContent =
    " " + document.getElementById(`${index}`).value + "mm";
  element.appendChild(elementSpan);
}

function updateCustomMaterial(index, notation) {
  const element = document.querySelector(`#${notation}`);
  const elementChildToRemove = element.children[0];
  if (elementChildToRemove) {
    element.removeChild(elementChildToRemove);
  }
  const elementSpan = document.createElement("span");
  elementSpan.textContent =
    " " + document.getElementById(`${index}`).value + "MPa";
  element.appendChild(elementSpan);
}

function updateBeamSect(index, notation) {
  const element = document.querySelector(`#${notation}`);
  const elementChildToRemove = element.children[0];
  if (elementChildToRemove) {
    element.removeChild(elementChildToRemove);
  }
  const elementSpan = document.createElement("span");
  elementSpan.textContent = beamDetails[index][notation];
  element.appendChild(elementSpan);
}

function updateBeampProp(index, notation) {
  const element = document.querySelector(`#${notation}`);
  const elementChildToRemove = element.children[0];
  if (elementChildToRemove) {
    element.removeChild(elementChildToRemove);
  }
  const elementSpan = document.createElement("span");
  elementSpan.textContent = beamDetails[index][notation] + "mm";
  element.appendChild(elementSpan);
}

// Load type radio buttons and load and length input event listeners

const interiorOption = document
  .getElementById("interior")
  .addEventListener("change", () => {
    updateLoadType("interior");
    calculate();
  });

const endOption = document
  .getElementById("end")
  .addEventListener("change", () => {
    updateLoadType("end");
    calculate();
  });

const loadInput = document
  .getElementById("load-input")
  .addEventListener("change", calculate);

const lengthInput = document
  .getElementById("length-input")
  .addEventListener("change", calculate);

function createCustomEventListeners() {
  const customWebThicknessInput = document
    .getElementById("web-thickness")
    .addEventListener("change", () => {
      updateCustomProp("web-thickness", "W");
      calculate();
    });

  const customeFlangeThicknessInput = document
    .getElementById("flange-thickness")
    .addEventListener("change", () => {
      updateCustomProp("flange-thickness", "T");
      calculate();
    });

  const customYieldStrengthInput = document
    .getElementById("yield-strength")
    .addEventListener("change", () => {
      updateCustomMaterial("yield-strength", "fy-custom");
      calculate();
    });

  const customElasticModulus = document
    .getElementById("elastic-modulus")
    .addEventListener("change", () => {
      updateCustomMaterial("elastic-modulus", "E-custom");
      calculate();
    });
}

let loadType = "interior";

let selectedBeam;

function updateSelectedBeam(index) {
  if (index === "custom") {
    selectedBeam = "custom";
  } else {
    selectedBeam = beamDetails[index];
  }
  console.log("current selected beam:", selectedBeam);
}

function updateLoadType(type) {
  loadType = type;
}

function updateSpan(value, notation) {
  const element = document.querySelector(`#${notation}`);
  const elementChildToRemove = element.children[0];
  if (elementChildToRemove) {
    element.removeChild(elementChildToRemove);
  }
  const elementSpan = document.createElement("span");
  elementSpan.innerHTML = value;
  element.appendChild(elementSpan);
}

function updateList(list1, list2) {
  const list = document.querySelector(".results-list");
  const childrenCount = list.children.length;

  if (childrenCount > 0) {
    list.removeChild(list.children[0]);
    list.removeChild(list.children[0]);
  }

  const li1 = document.createElement("li");
  const li2 = document.createElement("li");

  li1.innerHTML = list1;
  li2.innerHTML = list2;

  list.appendChild(li1);
  list.appendChild(li2);
}

function calculate() {
  const length = parseInt(document.getElementById("length-input").value);

  let W, T, F, E;

  console.log("during calculate selectedbeam:", selectedBeam);

  if (selectedBeam === "custom") {
    W = parseFloat(document.getElementById("web-thickness").value);
    T = parseFloat(document.getElementById("flange-thickness").value);
    F = parseFloat(document.getElementById("yield-strength").value);
    E = parseFloat(document.getElementById("elastic-modulus").value);
  } else {
    W = selectedBeam.W;
    T = selectedBeam.T;
    F = 350;
    E = 200000;
  }
  let Br1, Br2, list1, list2;

  if (loadType === "interior") {
    updateSpan("Interior load", "load");
    updateSpan("Φ<sub>bi</sub> = 0.8", "phi");

    Br1 = (0.8 * W * (length + 10 * T) * F) / 1000;
    Br2 = (1.45 * 0.8 * Math.pow(W, 2) * Math.sqrt(F * E)) / 1000;

    list1 = `Br = Φ<sub>bi</sub>*w*(N+10*t)*Fy = ${Br1.toFixed(0)} kN`;
    list2 = `Br = 1.45*Φ<sub>bi</sub>*w<sup>2</sup>*&#x221A;(Fy*E) = ${Br2.toFixed(
      0
    )} kN`;
  } else {
    updateSpan("End reaction", "load");
    updateSpan("Φ<sub>be</sub> = 0.75", "phi");

    Br1 = (0.75 * W * (length + 4 * T) * F) / 1000;
    Br2 = (0.6 * 0.75 * Math.pow(W, 2) * Math.sqrt(F * E)) / 1000;

    list1 = `Br = Φ<sub>be</sub>*w*(N+10*t)*Fy = ${Br1.toFixed(0)} kN`;
    list2 = `Br = 1.45*Φ<sub>be</sub>*w<sup>2</sup>*&#x221A;(Fy*E) = ${Br2.toFixed(
      0
    )} kN`;
  }
  updateList(list1, list2);

  let Br, P, utilRatio;

  Br = Math.min(Br1, Br2).toFixed(0);

  brSpan = `Br = ${Br} kN`;
  updateSpan(brSpan, "Br");

  P = parseFloat(document.getElementById("load-input").value);

  utilRatio = (P / Br).toFixed(3);

  if (utilRatio < 1) {
    utlization = `P/Br = ${utilRatio} < 1 - OK`;
    updateSpan(utlization, "utilization");
    updateSpan("No stiffener required", "stiffener-requirement");
  } else {
    utlization = `P/Br = ${utilRatio} > 1 - FAILS`;
    updateSpan(utlization, "utilization");
    updateSpan("Bearing stiffener required", "stiffener-requirement");
  }
}

function managePopUp() {
  const headerLink = document.getElementById("popup");
  const popupContainer = document.getElementById("popupContainer");
  const copyBtn = document.getElementById("copyLinkBtn");

  // Function to open the popup
  headerLink.addEventListener("click", function (event) {
    event.preventDefault();
    console.log("clicked");
    setTimeout(() => {
      popupContainer.style.display = "block";
    }, 150);
  });

  // Function to close the popup
  function closePopup() {
    popupContainer.style.display = "none";
  }

  // Close the popup when clicking outside or pressing Esc
  document.addEventListener("click", function (event) {
    if (!popupContainer.contains(event.target)) {
      closePopup();
    }
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      closePopup();
    }
  });

  copyBtn.addEventListener("click", function () {
    const linkToCopy = "https://www.oshemy.info";
    navigator.clipboard
      .writeText(linkToCopy)
      .then(function () {
        alert("Link copied to clipboard: " + linkToCopy);
      })
      .catch(function (error) {
        console.error("Unable to copy link: ", error);
      });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  setCustomDefaultAndListen();
  managePopUp();
});

