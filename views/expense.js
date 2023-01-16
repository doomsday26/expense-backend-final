let form = document.getElementById("myform");
let description = document.getElementById("descriptionInput");
let category = document.getElementById("category");
let ammount = document.getElementById("ammount");
let expenseId = document.getElementById("expenseId");
const userList = document.querySelector("#displayList");
const premiumbtn = document.getElementById("premium-btn");
let reportButton = document.getElementById("report");
let paginationForm= document.getElementById('paginationForm')
paginationForm.addEventListener('submit',dyanamicRow)
reportButton.addEventListener('click',displayReport)
let downloadRepo = document.getElementById("downloadReport");
downloadRepo.addEventListener("click", downloadReport);
let hidereport= document.getElementById('hidereport')
hidereport.addEventListener('click',hideReport)
let allReport = document.getElementById("allReport");
allReport.addEventListener("click", downloadAll);
// premiumbtn.addEventListener("click", premiumMembership);
let i = 0;
let FRONTEND_HOST='localhost'
const http = `http://${FRONTEND_HOST}:3000/expense/`;
const http2 = `http://${FRONTEND_HOST}:3000`;


window.addEventListener('DOMContentLoaded', (event) => {
  if(!localStorage.key(0)){
    alert('login first')
  }
});

//expenses adding
form.addEventListener("submit", add);
userList.addEventListener("click", removeItem);
userList.addEventListener("click", EditItem);
let token = localStorage.getItem("userData");
window.addEventListener("DOMContentLoaded", load);
document.getElementById('hideallReport').addEventListener('click',hidepreviousReports)
document.getElementById("previousReportsList").addEventListener("click", downloadPreviousData);


//pagination
let rowspp= document.getElementById('rowspp').value
localStorage.setItem('pageNo','1')
let mid= document.getElementById('mid')
let fwdbtn= document.getElementById('forward')
let backbtn= document.getElementById('backward')
fwdbtn.addEventListener('click',fwdpage)
backbtn.addEventListener('click',backpage)
let pageNo=localStorage.getItem('pageNo');

async function dyanamicRow(e){
e.preventDefault()
rowspp=document.getElementById('rowspp').value
await load()
}

async function fwdpage(){
pageNo=localStorage.getItem('pageNo')-0
pageNo=pageNo+1
await load()
}
async function backpage(){
  pageNo=localStorage.getItem('pageNo')-0
if(pageNo>1){
  pageNo=pageNo-1;
}
await load()
  
}

async function load() {
  mid.innerText=pageNo
  await axios
    .get(http+'/'+rowspp+'/'+pageNo, { headers: { Authourization: token } })
    .then(async (res) => {
      console.log(res);
      console.log(rowspp);
      if (res.Status == "success") {
        reportButton.addEventListener("click", displayReport);   
        await displayLeaderBoard();

 } else if(res.Status == "pending") {
var paras = document.getElementsByClassName('premium');
while(paras[0]) {
    paras[0].parentNode.removeChild(paras[0]);
}

      }





      displayexpenses(res.Expenses);
    })
    .catch((err) => {
      alert(err.success+err.status+ "you are not logged in, try login first")
      console.log("error found");
      console.log(err);
    });
}

async function add(e) {
  e.preventDefault();
  if (description.value === "" || ammount.value === "") {
    alert("please enter all fields");
  } else {
    let obj = {
      ammount: ammount.value,
      category: category.value,
      description: description.value,
    };
    await axios
      .post(http, obj, { headers: { Authourization: token } })
      .then((res) => console.log(res.data))
      .catch((err) => {
        console.log(err);
      });
    load();
  }
}

//display expenses
function displayexpenses(data) {
  //clear previous list items,
  let ul = document.getElementById("displayList");
  while (ul.firstChild) {
    ul.removeChild(ul.lastChild);
  }
  //create new childs.
  for (let i = 0; i < data.length; i++) {
    let destring = data[i];
    console.log(
      destring.id,
      destring.ammount,
      destring.category,
      destring.description
    );
    //creating li object
    let li = document.createElement("li");
    li.id = destring.id;

    let ammountspan = document.createElement("span");
    ammountspan.className = "amtspn";
    ammountspan.appendChild(
      document.createTextNode("Rs:  " + destring.ammount)
    );
    li.appendChild(ammountspan);

    let categoryspan = document.createElement("span");
    categoryspan.appendChild(document.createTextNode(destring.category));
    li.appendChild(categoryspan);

    let descriptionspan = document.createElement("span");
    descriptionspan.appendChild(document.createTextNode(destring.description));
    li.appendChild(descriptionspan);

    //create span
    let span = document.createElement("span");
    span.appendChild(document.createTextNode("  "));
    li.appendChild(span);
    //delete button
    let btn = document.createElement("button");
    btn.className = "delete";
    btn.appendChild(document.createTextNode("DELETE"));
    li.appendChild(btn);
    // edit button

    let editbtn = document.createElement("button");
    editbtn.className = "edit";
    editbtn.appendChild(document.createTextNode("EDIT"));
    editbtn.addEventListener("click", EditItem);
    li.appendChild(editbtn);
    ul.appendChild(li);
  }
  ammount.value = "";
  description.value = "";
}

async function removeItem(e) {
  if (e.target.classList.contains("delete")) {
    var li = e.target.parentElement;
    let key = li.id;
    console.log(key);
    await axios
      .delete(http + key, { headers: { Authourization: token } })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  await load();
}

//update the value,

async function EditItem(e) {
  e.preventDefault();

  console.log("edit items clicked");
  let li = e.target.parentElement;
  let key = li.id;
  console.log(key);
  console.log(http + key);
  await axios
    .get(http + key, { headers: { Authourization: token } })
    .then((res) => {
      console.log("result>>>", res.ammount, res.description, res.category);

      ammount.value = res.ammount;
      description.value = res.description;
      category.value = res.category;
      console.log(res.id);
      expenseId.value = key;

      console.log("restored for change");
    })
    .catch((err) => console.log(err));

  form.removeEventListener("submit", add);
  form.addEventListener("submit", updated);
}

async function updated(e) {
  console.log("called for upadte");
  console.log(expenseId.value);
  let key = expenseId.value;
  e.preventDefault();
  await axios
    .put(
      http + key,
      {
        ammount: ammount.value,
        category: category.value,
        description: description.value,
      },
      { headers: { Authourization: token } }
    )
    .then((res) => {
      console.log(res);
    })
    .catch((err) => {
      console.log(err);
    });

  form.removeEventListener("submit", updated);
  form.addEventListener("submit", add);

  await load();
}



document.getElementById('premium-btn').onclick=async function(e){
try {
    let response = await axios.get(http2 + "/purchase/purchasepremium", {
      headers: { Authourization: token}
    })
    console.log(response);
  let options={
    "key":response.key_id,
    "order_id":response.order.id,
  "handler":async function(response){
    await axios.post(http2+'/purchase/updateTransactionStatus',{
      orderId:options.order_id,
      payment_Id:response.razorpay_payment_id,
    },{headers:{Authourization: token}})
  alert('you are a premium user now,please refresh once ')
  location.reload()
  await load();
  }}
  
  var rzp1 = new Razorpay(options);
  rzp1.open()
  e.preventDefault()
  rzp1.on('payment.failed',function(response){
    console.log(response);
    alert('something is wrong')
  
  })
    
   
  } 
  catch (error) {
    if(error){
      console.log(error);
    }
  }

await load();

}



async function displayLeaderBoard() {
  axios
    .get(`http://${FRONTEND_HOST}:3000/premium`)
    .then((result) => {
      let list = document.getElementById("leader-list");
      while (list.firstChild) {
        list.removeChild(list.lastChild);
      }

      result.forEach((element) => {
        let li = document.createElement("li");
        li.className = "leader-item";
        let namespan = document.createElement("span");
        namespan.className = "leadername";
        namespan.innerText = element.user.name;
        li.appendChild(namespan);
        let moneyspan = document.createElement("span");
        moneyspan.className = "leader-money";
        moneyspan.innerText = element.total_ammount;
        li.appendChild(moneyspan);
        list.appendChild(li);
      });
    })
    .catch((err) => {
      console.log(err);
    });
}
function hideReport(){
  document.getElementById("reports").style.display = "none"
}

async function displayReport() {
  console.log("calling display reports");
  await axios
    .get(`http://${FRONTEND_HOST}:3000/expense/report`, {
      headers: { Authourization: token },
    })
    .then((result) => {
      console.log(result);
      document.getElementById("reports").style.display = "block";
      //descriptiob report
      let desRepo = document.getElementById("desRepo");

      while (desRepo.firstChild) {
        desRepo.removeChild(desRepo.lastChild);
      }

      result.descriptionReport.forEach((element) => {
        let li = document.createElement("li");
        li.innerText = `total money spent on ${element.description} is Rs. ${element.total_ammount}`;
        desRepo.appendChild(li);
      });

      //category report
      let catRepo = document.getElementById("catRepo");

      while (catRepo.firstChild) {
        catRepo.removeChild(catRepo.lastChild);
      }

      result.categoryReport.forEach((element) => {
        let li = document.createElement("li");
        li.innerText = `total  ${element.category} expenses is Rs. ${element.total_ammount}`;
        catRepo.appendChild(li);
      });
    })
    .catch((err) => {
      console.log(err);
    });
  // {descriptionReport: Array(3), categoryReport: Array(2)}
  // categoryReport:Array(2) 0:
  // {category: 'necessary', total_ammount: 1348}
  //1 :{category: 'unnecessary', total_ammount: 8922}
  // length :2
  // descriptionReport: Array(3)
  // 0:{description: 'stationery', total_ammount: 1235}
  // 1:{description: 'canteen', total_ammount: 113}
  // 2:{description: 'outings', total_ammount: 8922}
  // length:3
}

function downloadReport() {
  axios
    .get(`http://${FRONTEND_HOST}:3000/expense/downloadreport`, {
      headers: { Authourization: token },
    })
    .then((result) => {
      console.log(result);
      let a = document.createElement("a");
      a.href = result.url;
      a.innerText = "download your report";
      a.click();
    })
    .catch((err) => {
      console.log(err);
    });
}

async function downloadAll() {
  await axios
    .get(`http://${FRONTEND_HOST}:3000/expense/downloadAllreport`, {
      headers: { Authourization: token },
    })
    .then((result) => {
      console.log(result);
      document.getElementById('previousrReports').style.display="block"
      let list = document.getElementById("previousReportsList");
      list.style.overflowY = "scroll";
      while (list.firstChild) {
        list.removeChild(list.firstChild)
      }
      result.data.forEach((element) => {
        let li = document.createElement("li");
        li.className = "previousReport";
        li.innerHTML = element;
        list.appendChild(li);
      });
    })
    .catch((err) => {
      console.log(err);
    });
}

async function downloadPreviousData(e) {
  if (e.target.className == "previousReport") {
    await axios
      .get(
        `http://${FRONTEND_HOST}:3000/expense/downloadOldreport/${e.target.innerText}`,
        {
          headers: { Authourization: token },
        }
      )
      .then((result) => {
        // console.log("this is result>>>>>", result);
      
            let a = document.createElement('a')
        a.href=result
        a.click()
      })
      .catch((err) => {
        console.log(err);
      });
  }
}


function hidepreviousReports(){
  document.getElementById('previousrReports').style.display="none"
}