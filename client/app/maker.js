// using code from DomoMaker E by Aidan Kaufman
let catRenderer;
let shopForm;
let ShopFormClass;
let CatListClass;
let CatSelect;
let CatSelectClass;
let CatList;
let CatDiv;
let CatBuySuccess;
let CatBuySuccessClass;
let Happiness;

const handleCat = (e) => {
  e.preventDefault();
  
  $("#catMessage").animate({ width: 'hide' }, 350);
  
  if($("#catName").val() == '' || $("#catAge").val() == '') {
    handleError("Please fill all fields!");
    return false;
  }
  
  sendAjax('POST', $("#shopForm").attr("action"), $("#shopForm").serialize(), () => {
    
    CatBuySuccessClass = React.createClass({
      render: renderCatBuySuccessClass
    });
    
      
    CatBuySuccess = ReactDOM.render(
      <CatBuySuccessClass />, document.querySelector('#main')
    );
     
    const input1 = document.getElementById("catName");
    input1.value = '';
    const input2 = document.getElementById("catAge");
    input2.value = '';

  });
  
  return false;
};

// renders
const renderCatBuySuccessClass = (e) => {

  return(
    <h3>You've got kittens!</h3>
  );                                                                
};

// function to sendAjax that lets you view a specific cat's details
const select = function(csrf, catID) {
  
  const data = `_csrf=${csrf}&_id=${catID}`;
  
  sendAjax('POST', '/findByID', data, function(selectedCat) {

        const thisCat = selectedCat.catInfo;
    
        CatSelectClass = React.createClass({
          render: () => {                   // AIDAN this is what brakes retrieving data from selecting a cat
            console.dir(thisCat);
            return(
              renderCatSelect(thisCat)
            );
          }
        });

        CatSelect = ReactDOM.render(
          <CatSelectClass />, document.querySelector('#cats')
        );
      }.bind(this));
    
  
  return false;
};

// renders the singular cat div
const renderCatSelect = (cat) => {  
  return(
    <div key={cat._id} className="cat">
      <img src="/assets/img/catFace.png" alt="cat face" className="catFace" />
      <h3 className="catName"> Name: {cat.name} </h3>
      <h3 className="catAge"> Age: {cat.age} </h3>
      <h3 className="catHappiness"> Happiness: {cat.happiness} </h3>
    </div>
  );
};

// renders the buying a cat feature
const renderShop = function() {
  return (
   <form id="shopForm" 
      onSubmit={this.handleSubmit}
      name="shopForm"
      action="/maker"
      method="POST"
      className="shopForm"
    >
      <label htmlFor="name">Name: </label>
      <input id="catName" type="text" name="name" maxLength="12" placeholder="Cat Name"/>
      <label htmlFor="age">Age: </label>
      <input id="catAge" type="text" name="age" placeholder="Cat Age"/>
      <input type="hidden" name="_csrf" value={this.props.csrf} />
      <input className="makeCatSubmit" type="submit" value="Adopt Cat" />
    </form>  
  );
};

// renders the package that each cat element is displayed in
const renderCatDiv = function() {
  return(
    <div key={this.props.catID} className="cat">
      <img src="/assets/img/catFace.png" alt="cat face" className="catFace" />
      <h3 className="catName"> Name: {this.props.catName} </h3>
      
      <form id="petForm" 
        name="petForm"
        onSubmit={(e) => {
          e.preventDefault();
          select(this.props.csrf, this.props.catID);
          return false;
          }
        }
        action="/findByID"
        method="POST"
        className="petForm"
      >
        <input type="hidden" name="_id" value={this.props.catID} />
        <input type="hidden" name="_csrf" value={this.props.csrf} />
        <input className="petCat" type="submit" value="View Cat" />
      </form>
      
    </div>
  );
};

// renders all cat divs
const renderCatList = function() {
  if(this.state.data.length === 0) {
    return (
      <div className="catList">
        <h3 className="emptyCat">No Cats yet</h3>
      </div>
    );
  }
  
  const csrf = this.props.csrf;
  
  const catNodes = this.state.data.map(function(cat) {
    return(
      <CatDiv csrf={csrf} catName={cat.name} catID={cat._id} key={cat._id} />
    );
  });
  
  return (
    <div className="catList">
      {catNodes}
    </div>
  );
};

// creates a react class that handles the shop
const CreateShopFormClass = function(csrf) {
  // cat buying render
  ShopFormClass = React.createClass({
    handleSubmit: handleCat,
    render: renderShop,
  });
  
  shopForm = ReactDOM.render(
    <ShopFormClass csrf={csrf} />, document.querySelector("#cats")
    
  );
};

// creates a react class that handles the cat list
const CreateCatListClass = function(csrf) {
  // cat list render
  CatListClass = React.createClass({
    loadCatsFromServer: function() {
      sendAjax('GET', '/getCats', null, function(data) {
        this.setState({data:data.cats});
      }.bind(this));
    },
    getInitialState: function() {
      return {data: []};
    },
    componentDidMount: function() {
      this.loadCatsFromServer();
    },
    render: renderCatList
  });
  
  catRenderer = ReactDOM.render(
    <CatListClass csrf={csrf} />, document.querySelector("#cats")
  );
  
  // deletes the 'you bought a kitten' message
  let mainContent = document.querySelector('#main');
  mainContent.innerHTML = '';
  
};

// a function that sets up the event listeners to load elements to the page
const setupCatMaker = function(csrf) {
  
  const shopButton = document.querySelector("#shopButton");
  shopButton.addEventListener("click", (e) => {
    e.preventDefault();
    CreateShopFormClass(csrf);
    return false;
  });
  
  const catListButton = document.querySelector("#catListButton");
  catListButton.addEventListener("click", (e) => {
    e.preventDefault();
    CreateCatListClass(csrf);
    return false;
  });
  
  CatDiv = React.createClass({
    render: renderCatDiv
  });

  window.onload = CreateShopFormClass(csrf);
  
};

// takes the token and starts the page with it
const getToken = () => {
  sendAjax('GET', '/getToken', null, (result) => {
    setupCatMaker(result.csrfToken);
  });
};

$(document).ready(function() {
  getToken();
});


























