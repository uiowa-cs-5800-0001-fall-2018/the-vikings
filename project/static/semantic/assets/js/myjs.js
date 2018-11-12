
// open green navigation 
function openNav() {
  document.getElementById("choices1").style.width = "140px";
};
function closeNav() {
  document.getElementById("choices1").style.width = "0";
};
// open blue navigation
function openNav1() {
  document.getElementById("choices2").style.width = "140px";
};
function closeNav1() {
  document.getElementById("choices2").style.width = "0";
};
// open red navigation
function openNav2() {
  document.getElementById("choices3").style.width = "140px";
};
function closeNav2() {
  document.getElementById("choices3").style.width = "0";
};
// open yellow navigation
function openNav3() {
  document.getElementById("choices4").style.width = "140px";
};
function closeNav3() {
  document.getElementById("choices4").style.width = "0";
};
// open yellow navigation
function openNav4() {
  document.getElementById("choices5").style.width = "140px";
};
function closeNav4() {
  document.getElementById("choices5").style.width = "0";
};
// open yellow navigation
function openNav5() {
  document.getElementById("choices6").style.width = "140px";
};
function closeNav5() {
  document.getElementById("choices6").style.width = "0";
};
// open yellow navigation
function openNav6() {
  document.getElementById("choices7").style.width = "140px";
};
function closeNav6() {
  document.getElementById("choices7").style.width = "0";
};
// open yellow navigation
function openNav7() {
  document.getElementById("choices8").style.width = "140px";
};
function closeNav7() {
  document.getElementById("choices8").style.width = "0";
};


// coloring register password choice and check
function correctpass() {
  if (document.getElementById('passwordchoice').value.length >= 6) {
    document.getElementById('passwordchoice').style.borderColor = "green";
    if (document.getElementById('passwordchoice').value == document.getElementById('passwordchecking').value) {
      document.getElementById('passwordchecking').style.borderColor = "green";
    } else {
      document.getElementById('passwordchecking').style.borderColor = "red";
    }
  } else {
    document.getElementById('passwordchoice').style.borderColor = "red";
  }
};

//show modals

$('.ui.modal').modal({
  allowMultiple: true,
});
// $(document).ready(function () {
//   $('#openemailsupport').click(function () {
//     $('#id01').ui.modal('show')
//   })
// });
// $(document).ready(function () {
//   $('#signin').click(function () {
//     $('#id01').ui.modal('show')
//   })
// });
// $(document).ready(function () {
//   $('#registermod').click(function () {
//     $('#id02').ui.modal('show')
//   })
//   // $('.ui.modal').modal({
//   //   allowMultiple: true,
//   // });
// });
$(document).ready(function () {
  $('#forgotid').click(function () {
    $('#forgottenID').ui.modal('show')
  })
  // $('.ui.modal').modal({
  //   allowMultiple: true,
  // });
});



// for the register
function openUserChanges() {
  document.getElementById("userchanges").style.width = "250px";
  document.body.style.backgroundColor = "rgba(0,0,0,0.4)";
};

function closeUserChanges() {
  document.getElementById("userchanges").style.width = "0";
  document.body.style.backgroundColor = "white";
};

// dropdown menu
$('.ui.dropdown')
  .dropdown()
  ;


$('.ui.search').search({
  source: categoryContent,
  searchFields: [
    'title'
  ],
  searchFullText: false
});

var categoryContent = [
  { category: 'User', title: 'saywhat' }
];


// Vue js stuff

//var vm = new Vue({
//  el: '#card-projects',
//  data: function () {
//    return {
//      titleproj: 'My first project',
//      creator: 'saywhat',
 //     stars: '0',
 //     created: 'Yesterday',
 //     description: 'say who now',
 //     view: 'contents'
 ///   }
//},
 // components: {
 //   'contents': {
 //     template: '<div class="header"><a href="About_project.html">{{titleproj}}</a><a><i class="star icon" style="float:right;"></i></a></div>'
//    }
//  }
//});

// Vue.component('child',{
//   template:'{{text}}',
//   data: {

//   }
// });

// new Vue({
//   el: '#card_info',
//   data() {
//     return {
//     titleproj: 'My first project',
//     createdby: 'saywhat',
//     descriptionproj:'This project creation',
//     datecreated: '',
//     stars: ''
//   }
//   }
// });




