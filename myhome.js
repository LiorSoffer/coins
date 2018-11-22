var reports = [];
$(function () {
  if (localStorage.getItem("reports") == null)
    localStorage.setItem("reports", JSON.stringify(reports));
  else {
    reports = JSON.parse(localStorage.getItem("reports"));
  }
  Home("all");
});

function Home(request) {
  $("#pagename").text("Home");
  $(".se-pre-con").show();
  $("#main").empty();
  $.getJSON("https://api.coingecko.com/api/v3/coins/list", (data) => {
    $(".se-pre-con").fadeOut("slow");
    $("#main").append(`<div id="results" class="row text-center"></div>`);
    for (var i = 0; i < data.length; i++) {
      var htmlText =
        `   
        <div class="col-lg-3 col-md-6 mb-4 coincard">
        <div class="card">
        <div class="card-body">
        <h4 class="card-title">${data[i].symbol}</h4>
        <p class="card-text">${data[i].id}</p>
        <label class="switch">`
      if (reports.indexOf(data[i].symbol) >= 0)
        htmlText = htmlText + `<input data-symbol="${data[i].symbol}" type="checkbox" checked onclick="CBclicked()"></input>`;
      else htmlText += `<input data-symbol="${data[i].symbol}" type="checkbox" onclick="CBclicked()">`;
      htmlText += `
          <span class="slider round"></span>
          </label>
        <p id="${i}" class="card-text collapse"></p>
        </div>
        <div class="card-footer">
        <button data-time="" data-id="${data[i].id}" data-p="${i}" onclick="BtnClicked()" type="button" class="btn btn-primary" data-toggle="collapse" data-target="${"#"+i}">More Info!</button>
        </div>
        </div>
        </div>`;
      if (request == "all")
        $("#results").append(htmlText);
      if (request == "search" && data[i].symbol == $("#searchcoin").val())
        $("#results").append(htmlText);
      if (request == "followed" && reports.indexOf(data[i].symbol) >= 0)
        $("#results").append(htmlText);
    }
  });
}

function BtnClicked() {
  var coinid = event.target.getAttribute("data-id");
  var pindex = event.target.getAttribute("data-p");
  //button value && time validation
  if (event.target.innerText == "More Info!") {
    event.target.innerText = "Show Less";
    var click = event.target.getAttribute("data-time");
    var current = (new Date().getTime() / 60000);
    if (click == "" || (current - click) > 2) {
      MoreInfoFromApi(coinid, pindex)
    } else
      MoreInfoFromLS(coinid, pindex)
  } else
    event.target.innerText = "More Info!";
}

function MoreInfoFromApi(coinid, pindex) {
  $(".se-pre-con").show();
  event.target.setAttribute('data-time', (new Date().getTime() / 60000));
  $.getJSON("https://api.coingecko.com/api/v3/coins/" + coinid, (data) => {
    $(".se-pre-con").fadeOut("slow");
    var Phtml =
      `<img src="${data.image.small}" alt=""><br>
            $${data.market_data.current_price.usd}<br>
            €${data.market_data.current_price.eur}<br>
            ₪${data.market_data.current_price.ils} `;
    $(document.getElementById(pindex)).html(Phtml);
    var coin = {
      img: data.image.small,
      usd: data.market_data.current_price.usd,
      eur: data.market_data.current_price.eur,
      ils: data.market_data.current_price.ils
    };
    localStorage.setItem(coinid, JSON.stringify(coin));
  });
}

function MoreInfoFromLS(coinid, pindex) {
  var coin = JSON.parse(localStorage.getItem(coinid));
  var Phtml =
    `<img src="${coin.img}" alt=""><br>
             $${coin.usd}<br>
             €${coin.eur}<br>
             ₪${coin.ils} `;
  $(document.getElementById(pindex)).html(Phtml);
}

function CBclicked() {
  var coinsymbol = event.target.getAttribute("data-symbol");
  if (event.target.checked == true) {
    if (reports.length < 5) {
      reports.push(coinsymbol);
      localStorage.setItem("reports", JSON.stringify(reports));
    } else {
      modal();
    };
  }
  if (event.target.checked == false) {
    //delete
    reports.splice(reports.indexOf(coinsymbol), 1);
    localStorage.setItem("reports", JSON.stringify(reports));
  }
}

function modal() {
  var wanted= event.target.getAttribute("data-symbol");
  $('#modalbody').empty();
  var modalhtml = ""
  for (var i = 0; i < reports.length; i++) {
    modalhtml +=
      ` <h4 class="card-title">${reports[i]}</h4><br>
      <label class="switch">
      <input checked data-dismiss="modal" data-symbol="${reports[i]}" data-wanted="${wanted}" type="checkbox" onclick="ModalChange()">
      <span class="slider round"></span>
      </label>`;
  }
  $('#modalbody').append(modalhtml);
  $('#exampleModal').modal('show');
}

function ModalChange() {
  var unwanted= event.target.getAttribute("data-symbol");
  var wanted= event.target.getAttribute("data-wanted");
  //delete
  reports.splice(reports.indexOf(unwanted), 1);
  localStorage.setItem("reports", JSON.stringify(reports));
  //add
  reports.push(wanted);
  localStorage.setItem("reports", JSON.stringify(reports));
  //Update
  Home(`all`);
}