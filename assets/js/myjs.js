///slide show
var slideIndex = 1;
showSlides(slideIndex);

function plusSlides(n) {
  showSlides(slideIndex += n);
}

function currentSlide(n) {
  showSlides(slideIndex = n);
}

function showSlides(n) {
  var i;
  var slides = document.getElementsByClassName("mySlides");
  var dots = document.getElementsByClassName("dot");
  if (n > slides.length) {slideIndex = 1}    
  if (n < 1) {slideIndex = slides.length}
  for (i = 0; i < slides.length; i++) {
      slides[i].style.display = "none";  
  }
  for (i = 0; i < dots.length; i++) {
      dots[i].className = dots[i].className.replace(" active", "");
  }
  slides[slideIndex-1].style.display = "block";  
  dots[slideIndex-1].className += " active";
}



// open green navigation 
function openNav() {
  document.getElementById("choices1").style.width = "140px";
}
function closeNav() {
  document.getElementById("choices1").style.width = "0";
}
// open blue navigation
function openNav1() {
  document.getElementById("choices2").style.width = "140px";
}
function closeNav1() {
  document.getElementById("choices2").style.width = "0";
}
// open red navigation
function openNav2() {
  document.getElementById("choices3").style.width = "140px";
}
function closeNav2() {
  document.getElementById("choices3").style.width = "0";
}
// open yellow navigation
function openNav3() {
  document.getElementById("choices4").style.width = "140px";
}
function closeNav3() {
  document.getElementById("choices4").style.width = "0";
}
// open yellow navigation
function openNav4() {
  document.getElementById("choices5").style.width = "140px";
}
function closeNav4() {
  document.getElementById("choices5").style.width = "0";
}
// open yellow navigation
function openNav5() {
  document.getElementById("choices6").style.width = "140px";
}
function closeNav5() {
  document.getElementById("choices6").style.width = "0";
}
// open yellow navigation
function openNav6() {
  document.getElementById("choices7").style.width = "140px";
}
function closeNav6() {
  document.getElementById("choices7").style.width = "0";
}
// open yellow navigation
function openNav7() {
  document.getElementById("choices8").style.width = "140px";
}
function closeNav7() {
  document.getElementById("choices8").style.width = "0";
}




function correctpass() {
  if (document.getElementById('passwordchoice').value.length >= 6) {
    document.getElementById('passwordchoice').style.borderColor = "green";
    if (document.getElementById('passwordchoice').value == document.getElementById('passwordchecking').value) {
      document.getElementById('passwordchecking').style.borderColor = "green";
    } else {
      document.getElementById('passwordchecking').style.borderColor = "red";
    }
  }else{
    document.getElementById('passwordchoice').style.borderColor = "red";
  }
}

$('.modal').modal({
  allowMultiple: true,
});

function openUserChanges() {
  document.getElementById("userchanges").style.width = "250px";
  document.body.style.backgroundColor = "rgba(0,0,0,0.4)";
}

function closeUserChanges() {
  document.getElementById("userchanges").style.width = "0";
  document.body.style.backgroundColor = "white";
}

$('.ui.dropdown')
  .dropdown()
;


