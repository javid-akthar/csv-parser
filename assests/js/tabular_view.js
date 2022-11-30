//for searching a particular row ina table
function search() {
   //  var rows = document.getElementsByTagName('tr');
   //  for(let j = 0;j < rows.length; j++ ){
   //      rows[j].style.backgroundColor = "white";
   //  }
    var name = document.getElementById("searchForm").elements["searchItem"].value;
    var pattern = name.toLowerCase();
    localStorage. setItem("pattern", pattern);
    var targetId = "";

  
    var divs = document.getElementsByClassName("row-data");
    console.log('divs',divs);
    for (let i = 0; i < divs.length; i++) {
      var child = divs.children;
      console.log('child',child);
      //  var index = divs[i].innerText.toLowerCase().indexOf(pattern);
      //  if (index != -1) {
      //     targetId = divs[i].parentNode.id;
      //     document.getElementById(targetId).scrollIntoView();
      //     document.getElementById(targetId).style.backgroundColor = 'orange';
      //     break;
      //  }
    }  
 }

