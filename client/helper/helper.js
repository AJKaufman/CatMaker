// using code from DomoMaker E by Aidan Kaufman
const handleError = (message) => {
  $("#errorMessage").text(message);
  $("#catMessage").animate({width: 'toggle'}, 700);
};

const redirect = (response) => {
  $("#catMessage").animate({width: 'hide'}, 700);
  window.location = response.redirect;
};

const sendAjax = (type, action, data, success) => {
  $.ajax({
     
    cache: false,
    type: type,
    url: action,
    data: data,
    dataType: 'json',
    success: success,
    error: function(xhr, status, error) {
      
      var messageObj = JSON.parse(xhr.responseText);
      handleError(messageObj.error);
    }
  });  
};











