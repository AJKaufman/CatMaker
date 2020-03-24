"use strict";

// using code from DomoMaker E by Aidan Kaufman
var catRenderer = void 0;
var shopForm = void 0;
var ShopFormClass = void 0;
var CatListClass = void 0;
var CatSelect = void 0;
var CatSelectClass = void 0;
var CatList = void 0;
var CatDiv = void 0;
var CatBuySuccess = void 0;
var CatBuySuccessClass = void 0;
var Happiness = void 0;

var handleCat = function handleCat(e) {
  e.preventDefault();

  $("#catMessage").animate({ width: 'hide' }, 350);

  if ($("#catName").val() == '' || $("#catAge").val() == '') {
    handleError("Please fill all fields!");
    return false;
  }

  sendAjax('POST', $("#shopForm").attr("action"), $("#shopForm").serialize(), function () {

    CatBuySuccessClass = React.createClass({
      displayName: "CatBuySuccessClass",

      render: renderCatBuySuccessClass
    });

    CatBuySuccess = ReactDOM.render(React.createElement(CatBuySuccessClass, null), document.querySelector('#main'));

    var input1 = document.getElementById("catName");
    input1.value = '';
    var input2 = document.getElementById("catAge");
    input2.value = '';
  });

  return false;
};

// renders
var renderCatBuySuccessClass = function renderCatBuySuccessClass(e) {

  return React.createElement(
    "h3",
    null,
    "You've got kittens!"
  );
};

// function to sendAjax that lets you view a specific cat's details
var select = function select(csrf, catID) {

  var data = "_csrf=" + csrf + "&_id=" + catID;

  sendAjax('POST', '/findByID', data, function (selectedCat) {

    var thisCat = selectedCat.catInfo;

    CatSelectClass = React.createClass({
      displayName: "CatSelectClass",

      render: function render() {
        // AIDAN this is what brakes retrieving data from selecting a cat
        console.dir(thisCat);
        return renderCatSelect(thisCat);
      }
    });

    CatSelect = ReactDOM.render(React.createElement(CatSelectClass, null), document.querySelector('#cats'));
  }.bind(this));

  return false;
};

// renders the singular cat div
var renderCatSelect = function renderCatSelect(cat) {
  return React.createElement(
    "div",
    { key: cat._id, className: "cat" },
    React.createElement("img", { src: "/assets/img/catFace.png", alt: "cat face", className: "catFace" }),
    React.createElement(
      "h3",
      { className: "catName" },
      " Name: ",
      cat.name,
      " "
    ),
    React.createElement(
      "h3",
      { className: "catAge" },
      " Age: ",
      cat.age,
      " "
    ),
    React.createElement(
      "h3",
      { className: "catHappiness" },
      " Happiness: ",
      cat.happiness,
      " "
    )
  );
};

// renders the buying a cat feature
var renderShop = function renderShop() {
  return React.createElement(
    "form",
    { id: "shopForm",
      onSubmit: this.handleSubmit,
      name: "shopForm",
      action: "/maker",
      method: "POST",
      className: "shopForm"
    },
    React.createElement(
      "label",
      { htmlFor: "name" },
      "Name: "
    ),
    React.createElement("input", { id: "catName", type: "text", name: "name", maxLength: "12", placeholder: "Cat Name" }),
    React.createElement(
      "label",
      { htmlFor: "age" },
      "Age: "
    ),
    React.createElement("input", { id: "catAge", type: "text", name: "age", placeholder: "Cat Age" }),
    React.createElement("input", { type: "hidden", name: "_csrf", value: this.props.csrf }),
    React.createElement("input", { className: "makeCatSubmit", type: "submit", value: "Adopt Cat" })
  );
};

// renders the package that each cat element is displayed in
var renderCatDiv = function renderCatDiv() {
  var _this = this;

  return React.createElement(
    "div",
    { key: this.props.catID, className: "cat" },
    React.createElement("img", { src: "/assets/img/catFace.png", alt: "cat face", className: "catFace" }),
    React.createElement(
      "h3",
      { className: "catName" },
      " Name: ",
      this.props.catName,
      " "
    ),
    React.createElement(
      "form",
      { id: "petForm",
        name: "petForm",
        onSubmit: function onSubmit(e) {
          e.preventDefault();
          select(_this.props.csrf, _this.props.catID);
          return false;
        },
        action: "/findByID",
        method: "POST",
        className: "petForm"
      },
      React.createElement("input", { type: "hidden", name: "_id", value: this.props.catID }),
      React.createElement("input", { type: "hidden", name: "_csrf", value: this.props.csrf }),
      React.createElement("input", { className: "petCat", type: "submit", value: "View Cat" })
    )
  );
};

// renders all cat divs
var renderCatList = function renderCatList() {
  if (this.state.data.length === 0) {
    return React.createElement(
      "div",
      { className: "catList" },
      React.createElement(
        "h3",
        { className: "emptyCat" },
        "No Cats yet"
      )
    );
  }

  var csrf = this.props.csrf;

  var catNodes = this.state.data.map(function (cat) {
    return React.createElement(CatDiv, { csrf: csrf, catName: cat.name, catID: cat._id, key: cat._id });
  });

  return React.createElement(
    "div",
    { className: "catList" },
    catNodes
  );
};

// creates a react class that handles the shop
var CreateShopFormClass = function CreateShopFormClass(csrf) {
  // cat buying render
  ShopFormClass = React.createClass({
    displayName: "ShopFormClass",

    handleSubmit: handleCat,
    render: renderShop
  });

  shopForm = ReactDOM.render(React.createElement(ShopFormClass, { csrf: csrf }), document.querySelector("#cats"));
};

// creates a react class that handles the cat list
var CreateCatListClass = function CreateCatListClass(csrf) {
  // cat list render
  CatListClass = React.createClass({
    displayName: "CatListClass",

    loadCatsFromServer: function loadCatsFromServer() {
      sendAjax('GET', '/getCats', null, function (data) {
        this.setState({ data: data.cats });
      }.bind(this));
    },
    getInitialState: function getInitialState() {
      return { data: [] };
    },
    componentDidMount: function componentDidMount() {
      this.loadCatsFromServer();
    },
    render: renderCatList
  });

  catRenderer = ReactDOM.render(React.createElement(CatListClass, { csrf: csrf }), document.querySelector("#cats"));

  // deletes the 'you bought a kitten' message
  var mainContent = document.querySelector('#main');
  mainContent.innerHTML = '';
};

// a function that sets up the event listeners to load elements to the page
var setupCatMaker = function setupCatMaker(csrf) {

  var shopButton = document.querySelector("#shopButton");
  shopButton.addEventListener("click", function (e) {
    e.preventDefault();
    CreateShopFormClass(csrf);
    return false;
  });

  var catListButton = document.querySelector("#catListButton");
  catListButton.addEventListener("click", function (e) {
    e.preventDefault();
    CreateCatListClass(csrf);
    return false;
  });

  CatDiv = React.createClass({
    displayName: "CatDiv",

    render: renderCatDiv
  });

  window.onload = CreateShopFormClass(csrf);
};

// takes the token and starts the page with it
var getToken = function getToken() {
  sendAjax('GET', '/getToken', null, function (result) {
    setupCatMaker(result.csrfToken);
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
