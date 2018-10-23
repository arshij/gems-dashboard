      $(document).ready(function(){
      function changePage(pageName, elmnt ,color){
    var tabcontent;
    var tablinks;
    tabcontent=document.getElementsByClassName("tabcontent");
    for(var i=0;i<tabcontent.length;i++){
        tabcontent[i].style.display="none";
        
    }
    tablinks=document.getElementsByClassName("tablink");
    for(var i=0;i<tablinks.length;i++){
        tablinks[i].style.backgroundColor="";
    }
    document.getElementById(pageName).style.display="block";
    elmnt.style.backgroundColor=color;
    
}
        });


/*
function changePage(pageName, elmnt ,color){
    var tabcontent;
    var tablinks;
    tabcontent=document.getElementsByClassName("tabcontent");
    for(var i=0;i<tabcontent.length;i++){
        tabcontent[i].style.display="none";
        
    }
    tablinks=document.getElementsByClassName("tablink");
    for(var i=0;i<tablinks.length;i++){
        tablinks[i].style.backgroundColor="";
    }
    document.getElementById(pageName).style.display="block";
    elmnt.style.backgroundColor=color;
    
}
document.getElementById("defaultOpen").click();
*/