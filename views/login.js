let form = document.getElementById("form");
let email = document.getElementById("email");
let name = document.getElementById("name");
let password = document.getElementById("password");
let FRONTEND_HOST='localhost'
let http = `http://${FRONTEND_HOST}:3000`;
form.addEventListener("submit", login);
document.getElementById("reset").addEventListener("click", forgot);
window.addEventListener('DOMContentLoaded', (event) => {
  localStorage.clear()
});
function login(e) {
  e.preventDefault();
  console.log(email.value, password.value);
  axios
    .post(http + "/user/login", {
      email: email.value,
      password: password.value,
    })
    .then((result) => {
      console.log(result);
      if (result.success) {
        window.alert(result.valid);

        localStorage.setItem("userData", result.userdata);
        //change location
        window.location.assign("expenses.html");
      } else {
        window.alert(result.valid);
      }
    })
    .catch((err) => {
      console.log(err);
      // alert("status:  "+err.status+err.valid)
      console.log(err.code);
      document.getElementById("errorheading").innerHTML =
        err.valid + " error:  " + err.status;
    });
}

//{ email: 'h12.com', password: '122234' }
function forgot() {
  document.getElementById("reset").style.display = "none";
  let resetform = document.createElement("form");
  resetform.id = "resetform";

  let button = document.createElement("input");
  button.value = "CREATE NEW PASSWORD";
  button.className='btn'
  button.id = "reset-submit";
  button.type = "submit";
  resetform.appendChild(button);

  document.getElementById("forgot").appendChild(resetform);

  resetform.addEventListener("submit", reset);

  async function reset(e) {
    e.preventDefault();
 await   axios
      .post(http + "/password/forgotpassword", { email: email.value })
      .then((result) => {
        //console.log(result);
if(result.msg){
  alert(result.msg)
}

        if (result.requestGenerated) {
          let newPasswordform = document.createElement("form");
          document.getElementById("forgot").removeChild(resetform);
          document.getElementById("forgot").appendChild(newPasswordform);

          let passinput = document.createElement("input");
          passinput.name = "newpass";
          passinput.id = "newpass";
          passinput.placeholder = "new password";
          let label = document.createElement("label");

          label.for = "newpass";
          label.innerText = "PLEASE ENTER NEW PASSWORD :";
          newPasswordform.appendChild(label);
          newPasswordform.appendChild(passinput);

          let button = document.createElement("input");
          button.value = "submit";
          button.className='btn'
          button.id = "newpass-submit";
          button.type = "submit";
          newPasswordform.appendChild(button);
          newPasswordform.addEventListener("submit", submitNewPassword);

          async function submitNewPassword(e) {
            e.preventDefault();
            await axios
              .post(http + "/password/newpassword", {
                email: email.value,
                newPassword: passinput.value,
                uuid:result.id
              })
              .then((result) => {
                //console.log(result);
                if(result.success){
                    document.getElementById("forgot").removeChild(newPasswordform);
                    alert('your password has been updated')
                }else{
                    alert("please refresh the page and start again, we are not able to change your password, sorry for the in convienence")
                }
              })
              .catch((err) => {
                console.log(err);
              });
          }
        }
      });
  }
}
