
let form= document.getElementById('form')
let email = document.getElementById('email')
let name= document.getElementById('name')
let password= document.getElementById('password')
//let http="http://localhost:3000"
let FRONTEND_HOST='localhost'
let http=`http://${FRONTEND_HOST}:3000`

window.addEventListener('DOMContentLoaded', (event) => {
    localStorage.clear()
   
});


form.addEventListener('submit',signup)


function signup(e){
e.preventDefault()

if(email.value===''|| name.value==='' ||password.value=== ''){
    alert("please enter all the values")
}else{

axios.post(http+'/user/signup',{
    "name":name.value,
    "email":email.value,
    "password":password.value
}).then(
    result=>{
if(!result.success){
    alert("id already present please login no user could be added")
}else{
    window.location.assign('login.html')
}
        name.value="";
        email.value="";
        password.value=""
    }
)
}


}