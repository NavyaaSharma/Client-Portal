function validate1()
{
    if(document.getElementById('uname').value && document.getElementById('email').value && document.getElementById('pass').value && document.getElementById('phno').value)
    {
        register()
    }
    else
    {
        alert('Please fill complete details to register!')
    }
}

function validate2()
{
    if(document.getElementById('pass').value && document.getElementById('phno').value)
    {
        login()
    }
    else
    {
        alert('Please fill complete details to login!')
    }
}

function validate3()
{
    if(document.getElementById('pass').value && document.getElementById('phone').value)
    {
        forgot()
    }
    else
    {
        alert('Please fill complete details!')
    }
}

function forgot()
{
    var data=
    {
	"phone":document.getElementById('phone').value,
	"password":document.getElementById('pass').value
    }
    var xh = new XMLHttpRequest();
    xh.open("POST", "https://case-manger.herokuapp.com/client/forgotpassword", true)
    xh.setRequestHeader('Content-Type', 'application/json')
    xh.send(JSON.stringify(data))
    xh.onload=function(){
        if(this.status==201)
        {
            alert('Password updated!')
            window.location.replace('login.html')
        }
        else if(this.status==401){
            alert('Phone number is not registered! Make sure you enter the correct phone nummber.')
        }
        else
        {
            alert('Couldnot update password. Try again!')
            window.location.reload()
        }
}
}

function register()
{
    var data=
    {
    "name":document.getElementById('uname').value,
    "password":document.getElementById('pass').value,
    "phone":document.getElementById('phno').value
    }
    var xh = new XMLHttpRequest();
    xh.open("POST", "https://case-manger.herokuapp.com/client/create", true)
    xh.setRequestHeader('Content-Type', 'application/json')
    xh.send(JSON.stringify(data))
    xh.onload=function(){
        if(this.status==201)
        {
            alert('registered successfully! Login to continue')
            window.location.replace('login.html')
        }
        else if(this.status==401){
            var data=JSON.parse(this.responseText)
            alert(data.error)
            window.location.replace('signup.html')
        }
        else{
            alert('Failed! Try again')
            window.location.replace('signup.html')
        }
}
}

function login()
{
    var data=
    {
	"phone":document.getElementById('phno').value,
	"password":document.getElementById('pass').value
    }
    var xh = new XMLHttpRequest();
    xh.open("POST", "https://case-manger.herokuapp.com/client/login", true)
    xh.setRequestHeader('Content-Type', 'application/json')
    xh.send(JSON.stringify(data))
    xh.onload=function(){
        if(this.status==200)
        {
            var data = JSON.parse(this.responseText)
            localStorage.setItem("JWT_Token", "JWT " + data.token)
            localStorage.setItem("user",JSON.stringify(data.user))
            window.location.replace('dashboard.html')
        }
        else{
            alert('Invalid login credentials')
            window.location.replace('login.html')
        }
}
}
function profile()
{
    var user = localStorage.getItem('user')
    var disp=JSON.parse(user)
    console.log(disp)
    document.getElementById('cname').innerHTML=`Welcome ${disp.name}`
    console.log(disp.phone)
    count(disp.phone)
}

function dispcase()
{
    var user = localStorage.getItem('user')
    var disp=JSON.parse(user)
    var data={
        "phone":disp.phone
    }
    console.log(data)
    var jwt = localStorage.getItem('JWT_Token')
    var xh = new XMLHttpRequest();
    xh.open("POST", "https://case-manger.herokuapp.com/adv/details", true)
    xh.setRequestHeader('Content-Type', 'application/json')
    xh.setRequestHeader('Authorization', jwt)
    xh.send(JSON.stringify(data))
    xh.onload=function(){
        console.log(this.responseText)
        if(this.status==200)
        {
            var data = JSON.parse(this.responseText)
            console.log(data)
            for(var i=0;i<data.payload.length;i++)
            {
                $('#dispcase').append(`<a href="case.html?id=${data.payload[i].case_no}" class="card col-10 col-md-6 m-1">
                <h4 class="card-title">Case Name: <span>${data.payload[i].name}</span></h4>
                <h6>${data.payload[i].party.party1} v/s ${data.payload[i].party.party2}</h6>
            </a>`)
            }
        }
        else if(this.status==403)
        {
            alert('Session expired! Please Login to continue')
            window.location.replace('login.html')
        }
        else if(this.status==404)
        {
            $('#dispcase').append(`<a href="" class="card col-10 col-md-6 m-1">
                <h4 class="card-title">NO CASE FOUND</h4>
            </a>`)
        }
        else{
            $('#dispcase').append(`<a href="" class="card col-10 col-md-6 m-1">
                <h4 class="card-title">SOMETHING WENT WRONG! TRY AGAIN</h4>
            </a>`)
        }
    }
}

function details()
{
    const queryString = window.location.search
    const urlParams = new URLSearchParams(queryString)
    const cid = urlParams.get('id')
    var data={
        "case_no":cid
    }
    console.log(data)
    var jwt = localStorage.getItem('JWT_Token')
    var xh = new XMLHttpRequest();
    xh.open("POST", "https://case-manger.herokuapp.com/adv/moredetails", true)
    xh.setRequestHeader('Content-Type', 'application/json')
    xh.setRequestHeader('Authorization', jwt)
    xh.send(JSON.stringify(data))
    xh.onload=function(){
        console.log(this.responseText)
        if(this.status==200)
        {
            var data = JSON.parse(this.responseText)
            console.log(data)
            document.getElementById('name').innerHTML=data.user.name
            document.getElementById('party').innerHTML=data.user.party.party1+ " vs "+data.user.party.party2
            document.getElementById('desc').innerHTML=data.user.desc
            document.getElementById('judge').innerHTML=data.user.judge
            document.getElementById('ename').value=data.user.name
            document.getElementById('ep1').value=data.user.party.party1
            document.getElementById('ep2').value=data.user.party.party2
            document.getElementById('edesc').value=data.user.desc
            document.getElementById('ejudge').value=data.user.judge
            document.getElementById('cno').innerHTML=data.user.case_no
            if(data.user.date.length!=0)
            {
                for(var i=0;i<data.user.date.length;i++)
                {
                    $('#dates').append(`<div class="card">
                    <div class="card-header" id="date${i+1}" type="button" data-toggle="collapse" data-target="#data${i+1}" aria-expanded="true" aria-controls="data${i+1}">
                        <i class="fa fa-plus"></i> <span id="date${data.user.date[i]._id}">${data.user.date[i].date}</span>                       
                    </div>
                    <div id="data${i+1}" class="card-body collapse" aria-labelledby="date${i+1}" data-parent="#dates">
                       
                        <h5>Time: <span id="time${data.user.date[i]._id}">${data.user.date[i].time}</span></h5>
                        <h5>Venue: <span id="venue${data.user.date[i]._id}">${data.user.date[i].venue}</span></h5>
                        <h5>Details: <span id="det${data.user.date[i]._id}">${data.user.date[i].details}</span></h5>
                        <h5>Message For Client: <span id="msg${data.user.date[i]._id}">${data.user.date[i].msg}</span></h5>
                        <h5>Important Documents:</h5> 
                    
                        <div class="accordion" id="docs${i+1}">
                        
                        </div>
                    </div>
                </div>`)
                console.log(data.user.date[i].files.length)
                for(var j=0;j<data.user.date[i].files.length;j++)
                {
                    $(`#docs${i+1}`).append(`<div class="card">
                    <div class="card-header" id="docs${i+1}-${j+1}" type="button" data-toggle="collapse" data-target="#docd${i+1}-${j+1}" aria-expanded="true" aria-controls="docs${i+1}-${j+1}">
                        <i class="fa fa-plus"></i> Document ${j+1}                      
                    </div>
                    <div id="docd${i+1}-${j+1}" class="card-body collapse" aria-labelledby="docs${i+1}-${j+1}" data-parent="#docs${i+1}">
                    <a href="https://case-manger.herokuapp.com/adv/get/upload?cno=${data.user.case_no}&dno=${data.user.date[i]._id}&updno=${data.user.date[i].files[j]._id}" download target="_blank">
                    View and download document</a>
                    </div>
                </div>`)
                }
                }
            }
            else{
                $('#dates').append(`<div class="card">
                    <div class="card-header" id="date1" type="button" data-toggle="collapse" data-target="#data1" aria-expanded="true" aria-controls="data1">
                        <i class="fa fa-plus"></i> No date history found                      
                    </div>`)
            }
        }
        else if(this.status==403)
        {
            alert('Session expired! Please Login to continue')
            window.location.replace('login.html')
        }
        else if(this.status==404)
        {
            $('#dispcase').append(`<a href="" class="card col-10 col-md-6 m-1">
                <h4 class="card-title">NO CASE FOUND</h4>
            </a>`)
        }
        else{
            $('#dispcase').append(`<a href="" class="card col-10 col-md-6 m-1">
                <h4 class="card-title">SOMETHING WENT WRONG! TRY AGAIN</h4>
            </a>`)
        }
    }
}


function middle(date_id)
{
    document.getElementById('ucd').value=document.getElementById('date'+date_id).innerHTML
    document.getElementById('utime').value=document.getElementById('time'+date_id).innerHTML
    document.getElementById('umsg').value=document.getElementById('msg'+date_id).innerHTML
    document.getElementById('udet').value=document.getElementById('det'+date_id).innerHTML
    document.getElementById('did').innerHTML=date_id
}

function count(phno)
{
    console.log(phno)
    var jwt = localStorage.getItem('JWT_Token')
    console.log(jwt)
    var xh = new XMLHttpRequest();
    xh.open("GET", `https://case-manger.herokuapp.com/client/count?phone=${phno}`, true)
    xh.setRequestHeader('Content-Type', 'application/json')
    xh.setRequestHeader('Authorization', jwt)
    xh.send()
    xh.onload=function(){
        console.log(this.responseText)
        if(this.status==200)
        {
            var data = JSON.parse(this.responseText)
            console.log(data)
            document.getElementById('getcase').innerHTML=data.total
            
        }
        else{
            document.getElementById('getcase').innerHTML="Unable to display"
        }
    }
}

function logout()
{
    localStorage.removeItem('user')
    localStorage.removeItem('JWT_Token')
    window.location.replace('index.html')
}

function check()
{
    var jwt=localStorage.getItem('JWT_Token')
    if(!jwt)
    {
        
        window.location.replace('login.html')

    }
}

function homecheck()
{
    var jwt=localStorage.getItem('JWT_Token')
    if(!jwt)
    {
        $('#homepg').append(`<div class="col"><a href="signup.html">Signup</a></div>
        <div class="col"><a href="login.html">Login</a></div>
        <div class="col"><a href="#contact">Contact Me</a></div>`)

    }
    else{
        $('#homepg').append(`<div class="col"><a href="dashboard.html">My Dashboard</a></div>
        <div class="col"><a href="#contact">Contact Me</a></div>
        <div class="col">
        <a style="cursor: pointer; color: white;" onclick="logout()">Logout</a>
</div>`)

    }
}