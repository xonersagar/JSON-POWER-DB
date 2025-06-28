const baseURL = "http://api.login2explore.com:5577";
const token = "90935037|-31949209537887808|90958917";
const dbName = "EMP-DB";
const relName = "EmpData";

let empIdInput = null;

window.onload = () => {
  empIdInput = document.getElementById("empId");
  resetForm();
};

function resetForm() {
  document.getElementById("empForm").reset();
  empIdInput.disabled = false;
  document.getElementById("saveBtn").disabled = true;
  document.getElementById("changeBtn").disabled = true;
  document.getElementById("resetBtn").disabled = true;

  disableFieldsExceptID(true);
  empIdInput.focus();
}

function disableFieldsExceptID(disable = true) {
  ["name", "salary", "hra", "da", "deduction"].forEach(id => {
    document.getElementById(id).disabled = disable;
  });
}

async function getRecordById(id) {
  const req = {
    token,
    dbName,
    rel: relName,
    cmd: "GET_BY_KEY",
    key: JSON.stringify({ id }),
    createTime: false,
    updateTime: false
  };
  const res = await fetch(`${baseURL}/api/irl`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(req)
  });
  return res.json();
}

async function onIdBlur() {
  const id = empIdInput.value.trim();
  if (!id) return;

  const result = await getRecordById(id);
  if (result.status === 400) {
    // ID not found, allow save
    document.getElementById("saveBtn").disabled = false;
    document.getElementById("resetBtn").disabled = false;
    disableFieldsExceptID(false);
    document.getElementById("name").focus();
  } else if (result.status === 200) {
    // ID exists, load data and allow change
    const data = JSON.parse(result.data).record;
    document.getElementById("name").value = data.name;
    document.getElementById("salary").value = data.salary;
    document.getElementById("hra").value = data.hra;
    document.getElementById("da").value = data.da;
    document.getElementById("deduction").value = data.deduction;

    empIdInput.disabled = true;
    disableFieldsExceptID(false);
    document.getElementById("changeBtn").disabled = false;
    document.getElementById("resetBtn").disabled = false;
    document.getElementById("name").focus();
  }
}

function getFormData() {
  const id = document.getElementById("empId").value.trim();
  const name = document.getElementById("name").value.trim();
  const salary = document.getElementById("salary").value.trim();
  const hra = document.getElementById("hra").value.trim();
  const da = document.getElementById("da").value.trim();
  const deduction = document.getElementById("deduction").value.trim();

  if (!id || !name || !salary || !hra || !da || !deduction) {
    alert("All fields are required.");
    return null;
  }

  return { id, name, salary, hra, da, deduction };
}

async function saveRecord() {
  const data = getFormData();
  if (!data) return;

  const req = {
    token,
    dbName,
    rel: relName,
    cmd: "PUT",
    jsonStr: JSON.stringify(data)
  };

  const res = await fetch(`${baseURL}/api/iml`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(req)
  });

  const result = await res.json();
  alert(result.message);
  resetForm();
}

async function changeRecord() {
  const data = getFormData();
  if (!data) return;

  const req = {
    token,
    dbName,
    rel: relName,
    cmd: "UPDATE",
    jsonStr: JSON.stringify(data),
    relKey: "id"
  };

  const res = await fetch(`${baseURL}/api/iml`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(req)
  });

  const result = await res.json();
  alert(result.message);
  resetForm();
}
