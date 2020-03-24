// using code from DomoMaker E
let username;
let pass;

const handleLogin = (e) => {
  e.preventDefault();
  
  $("#catMessage").animate({width: "hide"}, 200);
  
  if($("#user").val() == "" || $("#pass").val() == "") {
    handleError("Meow...Username or password is empty");
    return false;
  }
  
  console.log($("input[name=_csrf]").val());
  
  
  sendAjax("POST", $("#loginForm").attr("action"), $("#loginForm").serialize(), redirect);
  
  return false;
};

// handles password changing
const handlePassChange = (e) => {
  e.preventDefault();
  
  $("#catMessage").animate({width: "hide"}, 200);
  
  if($("#user").val() == "" || $("#pass").val() == "" || $("#passNew").val() == "") {
    handleError("Meow...all fields are required");
    return false;
  }
  
  if($("#pass").val() === $("#passNew").val()) {
    handleError("Meow...passwords cannot match");
    return false;
  }
  
  console.log($("input[name=_csrf]").val());
  
  
  sendAjax("POST", $("#passForm").attr("action"), $("#passForm").serialize(), redirect);
  
  return false;
};

const handleSignup = (e) => {
  e.preventDefault();
  
  $("#catMessage").animate({width:"hide"}, 200);
  
  if($("#user").val() == "" || $("#pass").val() == "" || $("#pass2").val() == "") {
    handleError("Meow...All fields are required");
    return false;
  }
  
  if($("#pass").val() !== $("#pass2").val()) {
    handleError("Meow...Passwords do not match");
    return false;
  }
  
  username = $("#user").val();
  pass = $("#pass").val();
  console.log("Username = " + username + " Pass = " + pass);
  
  console.dir($("#signupForm").serialize());
  sendAjax("POST", $("#signupForm").attr("action"), $("#signupForm").serialize(), redirect);
  
  return false;
};

const renderLogin = function() {
  return (
  <form id="loginForm" name="loginForm"
    onSubmit={this.handleSubmit}
    action="/login"
    method="POST"
    className="mainForm"
  >
    <label htmlFor="username">Username: </label>
    <input id="user" type="text" name="username" placeholder="username"/>
    <label htmlFor="pass">Password: </label>
    <input id="pass" type="password" name="pass" placeholder="password"/>
    <input type="hidden" name="_csrf" value={this.props.csrf}/>
    <input className="formSubmit" type="submit" value="Sign in"/>
  </form>
  );
};

const renderPassChange = function() {
  return (
  <form id="passForm" 
    name="passForm"
    onSubmit={this.handleSubmit}
    action="/changePass"
    method="POST"
    className="mainForm"
  >
    <label htmlFor="username">Username: </label>
    <input id="user" type="text" name="username" placeholder="username"/>
    <label htmlFor="pass">Password: </label>
    <input id="pass" type="password" name="pass" placeholder="password"/>
    <label htmlFor="passNew">New Password: </label>
    <input id="passNew" type="password" name="passNew" placeholder="new password"/>
    <input type="hidden" name="_csrf" value={this.props.csrf}/>
    <input className="formSubmit" type="submit" value="Change pass"/>
  </form>
  );
};

const renderSignup = function() {
  return (
  <form id="signupForm" 
    name="signupForm"
    onSubmit={this.handleSubmit}
    action="/signup"
    method="POST"
    className="mainForm"
  >
    <label htmlFor="username">Username: </label>
    <input id="user" type="text" name="username" placeholder="username"/>
    <label htmlFor="pass">Password: </label>
    <input id="pass" type="password" name="pass" placeholder="password"/>
    <label htmlFor="pass2">Password: </label>
    <input id="pass2" type="password" name="pass2" placeholder="retype password"/>
    <input type="hidden" name="_csrf" value={this.props.csrf} />
    <input className="formSubmit" type="submit" value="Sign Up" />
  </form>
  );
};


const createLoginWindow = function (csrf) {
  const LoginWindow = React.createClass({
    handleSubmit: handleLogin,
    render: renderLogin
  });
  
  ReactDOM.render(
    <LoginWindow csrf={csrf} />,
    document.querySelector("#content")
  );
};

const createPassChangeWindow = function (csrf) {
  const PassChangeWindow = React.createClass({
    handleSubmit: handlePassChange,
    render: renderPassChange
  });
  
  ReactDOM.render(
    <PassChangeWindow csrf={csrf} />,
    document.querySelector("#content")
  );
};


const createSignupWindow = function (csrf) {
  const SignupWindow = React.createClass({
    handleSubmit: handleSignup,
    render: renderSignup
  });
  
  console.log('creating signup window');
  
  ReactDOM.render(
    <SignupWindow csrf={csrf} />,
    document.querySelector("#content")
  );
};


const setup = function(csrf) {
  const loginButton = document.querySelector("#loginButton");
  const signupButton = document.querySelector("#signupButton");
  const changePassButton = document.querySelector("#changePassButton");
  
  signupButton.addEventListener("click", (e) => {
    e.preventDefault();
    createSignupWindow(csrf);
    return false;
  });
  
  loginButton.addEventListener("click", (e) => {
    e.preventDefault();
    createLoginWindow(csrf);
    return false;
  });
  
  changePassButton.addEventListener("click", (e) => {
    e.preventDefault();
    createPassChangeWindow(csrf);
    return false;
  });
  
  
  createLoginWindow(csrf); // default view
};


const getToken = () => {
  sendAjax("GET", "/getToken", null, (result) => {
    setup(result.csrfToken);
  });
};

$(document).ready(function() {
  getToken();
});
















