"use strict";

// using code from DomoMaker E
var username = void 0;
var pass = void 0;

var handleLogin = function handleLogin(e) {
  e.preventDefault();

  $("#catMessage").animate({ width: "hide" }, 200);

  if ($("#user").val() == "" || $("#pass").val() == "") {
    handleError("Meow...Username or password is empty");
    return false;
  }

  console.log($("input[name=_csrf]").val());

  sendAjax("POST", $("#loginForm").attr("action"), $("#loginForm").serialize(), redirect);

  return false;
};

// handles password changing
var handlePassChange = function handlePassChange(e) {
  e.preventDefault();

  $("#catMessage").animate({ width: "hide" }, 200);

  if ($("#user").val() == "" || $("#pass").val() == "" || $("#passNew").val() == "") {
    handleError("Meow...all fields are required");
    return false;
  }

  if ($("#pass").val() === $("#passNew").val()) {
    handleError("Meow...passwords cannot match");
    return false;
  }

  console.log($("input[name=_csrf]").val());

  sendAjax("POST", $("#passForm").attr("action"), $("#passForm").serialize(), redirect);

  return false;
};

var handleSignup = function handleSignup(e) {
  e.preventDefault();

  $("#catMessage").animate({ width: "hide" }, 200);

  if ($("#user").val() == "" || $("#pass").val() == "" || $("#pass2").val() == "") {
    handleError("Meow...All fields are required");
    return false;
  }

  if ($("#pass").val() !== $("#pass2").val()) {
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

var renderLogin = function renderLogin() {
  return React.createElement(
    "form",
    { id: "loginForm", name: "loginForm",
      onSubmit: this.handleSubmit,
      action: "/login",
      method: "POST",
      className: "mainForm"
    },
    React.createElement(
      "label",
      { htmlFor: "username" },
      "Username: "
    ),
    React.createElement("input", { id: "user", type: "text", name: "username", placeholder: "username" }),
    React.createElement(
      "label",
      { htmlFor: "pass" },
      "Password: "
    ),
    React.createElement("input", { id: "pass", type: "password", name: "pass", placeholder: "password" }),
    React.createElement("input", { type: "hidden", name: "_csrf", value: this.props.csrf }),
    React.createElement("input", { className: "formSubmit", type: "submit", value: "Sign in" })
  );
};

var renderPassChange = function renderPassChange() {
  return React.createElement(
    "form",
    { id: "passForm",
      name: "passForm",
      onSubmit: this.handleSubmit,
      action: "/changePass",
      method: "POST",
      className: "mainForm"
    },
    React.createElement(
      "label",
      { htmlFor: "username" },
      "Username: "
    ),
    React.createElement("input", { id: "user", type: "text", name: "username", placeholder: "username" }),
    React.createElement(
      "label",
      { htmlFor: "pass" },
      "Password: "
    ),
    React.createElement("input", { id: "pass", type: "password", name: "pass", placeholder: "password" }),
    React.createElement(
      "label",
      { htmlFor: "passNew" },
      "New Password: "
    ),
    React.createElement("input", { id: "passNew", type: "password", name: "passNew", placeholder: "new password" }),
    React.createElement("input", { type: "hidden", name: "_csrf", value: this.props.csrf }),
    React.createElement("input", { className: "formSubmit", type: "submit", value: "Change pass" })
  );
};

var renderSignup = function renderSignup() {
  return React.createElement(
    "form",
    { id: "signupForm",
      name: "signupForm",
      onSubmit: this.handleSubmit,
      action: "/signup",
      method: "POST",
      className: "mainForm"
    },
    React.createElement(
      "label",
      { htmlFor: "username" },
      "Username: "
    ),
    React.createElement("input", { id: "user", type: "text", name: "username", placeholder: "username" }),
    React.createElement(
      "label",
      { htmlFor: "pass" },
      "Password: "
    ),
    React.createElement("input", { id: "pass", type: "password", name: "pass", placeholder: "password" }),
    React.createElement(
      "label",
      { htmlFor: "pass2" },
      "Password: "
    ),
    React.createElement("input", { id: "pass2", type: "password", name: "pass2", placeholder: "retype password" }),
    React.createElement("input", { type: "hidden", name: "_csrf", value: this.props.csrf }),
    React.createElement("input", { className: "formSubmit", type: "submit", value: "Sign Up" })
  );
};

var createLoginWindow = function createLoginWindow(csrf) {
  var LoginWindow = React.createClass({
    displayName: "LoginWindow",

    handleSubmit: handleLogin,
    render: renderLogin
  });

  ReactDOM.render(React.createElement(LoginWindow, { csrf: csrf }), document.querySelector("#content"));
};

var createPassChangeWindow = function createPassChangeWindow(csrf) {
  var PassChangeWindow = React.createClass({
    displayName: "PassChangeWindow",

    handleSubmit: handlePassChange,
    render: renderPassChange
  });

  ReactDOM.render(React.createElement(PassChangeWindow, { csrf: csrf }), document.querySelector("#content"));
};

var createSignupWindow = function createSignupWindow(csrf) {
  var SignupWindow = React.createClass({
    displayName: "SignupWindow",

    handleSubmit: handleSignup,
    render: renderSignup
  });

  console.log('creating signup window');

  ReactDOM.render(React.createElement(SignupWindow, { csrf: csrf }), document.querySelector("#content"));
};

var setup = function setup(csrf) {
  var loginButton = document.querySelector("#loginButton");
  var signupButton = document.querySelector("#signupButton");
  var changePassButton = document.querySelector("#changePassButton");

  signupButton.addEventListener("click", function (e) {
    e.preventDefault();
    createSignupWindow(csrf);
    return false;
  });

  loginButton.addEventListener("click", function (e) {
    e.preventDefault();
    createLoginWindow(csrf);
    return false;
  });

  changePassButton.addEventListener("click", function (e) {
    e.preventDefault();
    createPassChangeWindow(csrf);
    return false;
  });

  createLoginWindow(csrf); // default view
};

var getToken = function getToken() {
  sendAjax("GET", "/getToken", null, function (result) {
    setup(result.csrfToken);
  });
};

$(document).ready(function () {
  getToken();
});
"use strict";

// using code from DomoMaker E by Aidan Kaufman
var handleError = function handleError(message) {
  $("#errorMessage").text(message);
  $("#catMessage").animate({ width: 'toggle' }, 700);
};

var redirect = function redirect(response) {
  $("#catMessage").animate({ width: 'hide' }, 700);
  window.location = response.redirect;
};

var sendAjax = function sendAjax(type, action, data, success) {
  $.ajax({

    cache: false,
    type: type,
    url: action,
    data: data,
    dataType: 'json',
    success: success,
    error: function error(xhr, status, _error) {

      var messageObj = JSON.parse(xhr.responseText);
      handleError(messageObj.error);
    }
  });
};
