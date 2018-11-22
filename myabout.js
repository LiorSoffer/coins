function About() {
  $("#pagename").text("About");
  $(".se-pre-con").show();
  $(".se-pre-con").fadeOut("slow");
  $("#main").empty();
  var htmlText = 
  `
  <h2>Lior Soffer, Full Stack Developer</h2><br>
  <img src="me.jpg" style="height: 160px; width: 160px;"></img>
 `
  ;
  $("#main").append(htmlText);
}