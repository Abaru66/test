/*jshint browser:true */
/* jshint loopfunc:true */
var evy;
var rc;
var directionsDisplay;   
var directionsService;
var map;
var buttonrif=[];
var concount;
var rosacount;
var markers = [];
var neighborhoods = [];
var titoli = [];
var centro = [];
var idslogin;
var sonologin;
var mm;
/*global $ */(function()
{
  
 "use strict";
 /*
   hook up event handlers 
 */
 function register_event_handlers()
 {
    
/*********************************** READY **********************************************/          
$(document).ready(function() {
    
    StatusBar.overlaysWebView(false);
   
   
//var ref = cordova.InAppBrowser.open('http://belmonte.somee.com/fbl.html', '_blank', 'location=yes');
   // window.open('http://belmonte.somee.com/fbl.html', '_blank');
    
    
    if (localStorage.getItem("sid")===null) {
       rc= getEventi("login");
        
     } else {
    $("#sid").val(localStorage.getItem("sid"));
    $("#cat").val(localStorage.getItem("cat")); 
    $("#soc").val(localStorage.getItem("soc"));
    $("#torneo").val(localStorage.getItem("torneo")); 
    $("#alb").val(localStorage.getItem("alb")); 
    $("#alb_t").val(localStorage.getItem("alb_t")); 
    $("#alb_l").val(localStorage.getItem("alb_l"));      
    rc= getEventi("load");     
     }
    
    evy= Create2DArray(10);
     
          
    directionsDisplay = new google.maps.DirectionsRenderer(); 
    directionsService = new google.maps.DirectionsService(); 
    navigator.geolocation.getCurrentPosition(onSuccess, onError); 
    
  
}); 

     
/*********************************** Click Elemento LISTA **********************************************/          
     
     
     $("#eventi").on("click", "li", function(evt)
    {
var ee=($(this).attr('id'));

var info;
var label="Quando";        

$("#pid").val(evy[ee][0]);          
$("#ev_l").val(evy[ee][3]); 
$("#idc").val(evy[ee][8]);         
$(".card-header").empty();        
$(".card-footer").empty();  
if (evy[ee][6]=="util")   {
    label="Num.Tel <p5 style='font-style: italic; font-size: small;'>(click sul numero per chiamare)</p5>";
     }  
    
$(".card-header").append(evy[ee][7] + ": <h1>" + evy[ee][1] + "</h1>")   ;
if (evy[ee][7]=="match")   {
    $(".card-header").append("<a id='bt_convocazioni' class='button widget uib_w_34 d-margins green bt_convox el el-list-alt' data-uib='app_framework/button' data-ver='2'>Convocazioni</a>")   ;
     }  
        
        
$(".card-footer").append("<br><hr><br><h1>" + label + ":</h1> " + evy[ee][2] + "<br><br><hr><br><h1>Dove:</h1>" + evy[ee][3] +"<br>" );  

info=getRouteInfo($("#alb_l").val(),$("#ev_l").val(),"Albergo");
info=getRouteInfo($("#curr_pos").val(),$("#ev_l").val(),"Attuale posizione");        

 if (evy[ee][5]=="match") {
 $(".card-footer").append("<a id='bt_vicini' class='button widget uib_w_34 d-margins green bt_convox icon pin green' data -uib='app_framework/button' data-ver='2'>nelle vicinanze...</a>" );         
   }        
$.afui.drawer.show("#uib_w_11", "left");

        return false;
    }); 
     
     
 
    
/*********************************** chiudi side menu ****************************************************/          
    $(document).on("click", ".uib_w_18", function(evt)
    {
         $.afui.drawer.hide ("#uib_w_11", "left");
         return false;
    });
    
    /*********************************** MAPPA da posizione corrente **********************************************/          
    $(document).on("click", "#bnmappacurr", function(evt)
    {
         
   activate_subpage("#mappa"); 
    $.afui.drawer.hide ("#uib_w_11", "left");            
   $("#map_info3").empty();        
   $("#map3").empty();
   $("#panel3").empty();
   var partenza = $("#curr_pos").val();
   var arrivo = $("#ev_l").val();   
   getMap(partenza,arrivo); 
         return false;
    });
    
/*********************************** MAPPA da Hotel *******************************************************/          
    $(document).on("click", "#bnmappahotel", function(evt)
    {
     activate_subpage("#mappa"); 
     $.afui.drawer.hide ("#uib_w_11", "left");    
   $("#map_info3").empty();        
   $("#map3").empty();
   $("#panel3").empty();
   var partenza = $("#alb_l").val();
   var arrivo = $("#ev_l").val();    
        
    getMap(partenza,arrivo); 
         return false;
    });
     
   /*********************************** MAPPA vcini **********************************************/          
    $(document).on("click", "#bt_vicini", function(evt)
    {
    neighborhoods = [];    
    var neig="";  
    var from="";
    var t=0;    
   activate_subpage("#mappa"); 
    $.afui.drawer.hide ("#uib_w_11", "left");            
   $("#map_info3").empty();        
   $("#map3").empty();
   $("#panel3").empty();
   var el='<ul class="list widget uib_w_6 d-margins" data-uib="app_framework/listview" data-ver="2" id="eventi2">';
       
   var url = "http://adriasport.somee.com/adria/range.asp?id="+ $("#idc").val();        
     $.get(url, function(data){
     var dataret=data.split("$"); 
     var fLen=dataret.length-1;     
     for (var i = 0; i < fLen; i++) {
      var vic=dataret[i].split("§"); 
         var coo=vic[8].split(","); 
          var lat=coo[0].replace("lat: ","");
          var lng=coo[1].replace("lng: ","");
          neighborhoods.push(new google.maps.LatLng(lat, lng));
          titoli[t]=vic[4];
          t=t+1;
        from= vic[11];
        var evd=vic[5] + " " + vic[4] + " " + vic[6] + " " + " <a href=tel:"+vic[7] + ">tel: " + vic[7] + "</a> " + "\nDistanza:" + vic[9] + "  Tempo:" + vic[10] + " min.";
        var icona="ii"; 
               el=el +'<li class="widget uib_w_8 evstyle" data-uib="app_framework/listitem" data-ver="2" id=' + i + '>' + evd + '</li>';
               // $("#eventi").append(el);  
         }
         $("#panel3").append(el +"</ul>");
          var coo=from.split(","); 
          var lat=coo[0].replace("lat: ","");
          var lng=coo[1].replace("lng: ","");
          
          neighborhoods.push(new google.maps.LatLng(lat, lng));
          titoli[t]=$("#ev_l").val();
          centro.push(new google.maps.LatLng(lat, lng));
         
         drop(); 
     });                
        
 return false;
    });
      
          
    
/*********************************** Esempio POPUP **********************************************/          
    $(document).on("click", "#slide", function(evt)
    {
        /* Popups are created using custom js 
         For examples and documentation visit http://app-framework-software.intel.com/api.php#af_popup */
        var options = {
          title: 'Popup!',
          message: 'This is a standard popup.',
          cancelText: 'Cancel',
          doneText: 'Done',
          cancelOnly: false
        };
        $.afui.popup(options); 
         return false;
    });
    
/*********************************** CAMPI ********************************************************/          
    $(document).on("click", "#b_campi", function(evt)
    {
         rc= getUtil("campi");
         return false;
    });
    
/*********************************** SETTING ********************************************************/          
    $(document).on("click", "#b_conf", function(evt)
    {
        var rc=getTornei();
        activate_subpage("#login");  
         return false;
    });     
/*********************************** RISTORANTI **********************************************/          
    $(document).on("click", "#bt_ristoranti", function(evt)
    {
        rc= getUtil("ristoranti");
         return false;
    });
    
/*********************************** OSPEDALI *******************************************************/          
    $(document).on("click", "#bt_ospedali", function(evt)
    {
       rc= getUtil("ospedali");
         return false;
    });
    
/*********************************** ATTRAZIONI TURISTICHE **********************************************/          
    $(document).on("click", "#bt_turismo", function(evt)
    {
        rc= getUtil("Attrazioni Turistiche");
         return false;
    });
    
/*********************************** RIFERIMENTI *****************************************************/          
    $(document).on("click", "#bt_riferimenti", function(evt)
    {
        rc= getRif();
        
         return false;
    });
    
      
    
/*********************************** CONVENZIONI ***************************************************/          
    $(document).on("click", "#Convenzioni", function(evt)
    {
        rc= getUtil("Convenzioni");
         return false;
    });
    
/*********************************** EVENTI *********************************************************/          
    $(document).on("click", "#bt_eventi", function(evt)
    {
        rc= getEventi("load");
         return false;
    });
    
/*********************************** EXIT ***********************************************************/          
    $(document).on("click", "#exit", function(evt)
    {
        navigator.app.exitApp(); 
         return false;
    });
    
/*********************************** CALENDARIO *****************************************************/      
    $(document).on("click", "#bt_calendario", function(evt)
    {
        
         var url = "http://adriasport.somee.com/adria/gare.asp?sid=" + $("#sid").val(); 
    
       $.get(url, function(data){
              
       $("#garescreen").html(data);
        activate_subpage("#gare");         
    }); 
         
         return false;
    });
    
/*********************************** CONVOCAZIONI **************************************************/      
    $(document).on("click", "#bt_convocazioni", function(evt)
    {
       
       $("#cat").val("<scegli categoria>");
       $("#partita").val("");       
      $("#rosa").empty(); 
      $("#convo").empty(); 
      $("#partinfo").empty();       
      $("#quando").empty();              
      $("#ritrovo").text("");  
    $("#hhr").text("Rosa (0)");      
    $("#hhr").addClass("icon user");       
    $("#hhc").text("Convocati (0");             
    $("#hhc").addClass("icon user");  
    $("#partinfo").empty();       
      $("#quando").empty();              
      $("#ritrovo").empty();    
 $("#rosa").empty();   
  
    
    $("#convo").empty(); 
       
    
   /* Convocati */    
var url = "http://adriasport.somee.com/adria/convocati.asp?pid=" + $("#pid").val() + "&sid=" + $("#sid").val(); 
       
       $.get(url, function(data){
       var dataret=data.split("$");
       /* alert(dataret[0]); */
       $('#tt').val(dataret[0]);
    var gio=dataret[0].split(",");   
    var fLen = gio.length;
    var el="";
    for (var i =1; i < fLen; i++) {
      el ='<li data-name="'+ gio[i] + '" class="widget uib_w_24 elenchi" data-uib="app_framework/listitem" data-ver="2" id="' + gio[i] + '"><a>' + gio[i] + '</a></li>'     ;       
    $("#convo").append(el); 
            }
            
    }); 
   
    
    /* NON Convocati */
    url = "http://adriasport.somee.com/adria/NonConvocati.asp?pid=" + $("#pid").val() + "&sid=" + $("#sid").val(); 
       
       $.get(url, function(data){
       var dataret=data.split("$");
       /* alert(dataret[0]); */
       $('#tt').val(dataret[0]);
    var gio=dataret[0].split(",");   
    var fLen = gio.length;
           
    var el="";
    for (var i = 1; i < fLen; i++) {
      el ='<li class="widget uib_w_24 elenchi" data-uib="app_framework/listitem" data-ver="2" id="' + gio[i] + '"><a>' + gio[i] + '</a></li>'     ;       
    $("#rosa").append(el);  
        }
    
     
rosacount=$("#rosa").children().length;
concount=$("#convo").children().length;
rosacount=$("#rosa").children().length;
concount=$("#convo").children().length;           
   $("#hhr").text("Rosa (" + rosacount + ")");      
    $("#hhr").addClass("icon user");       
    $("#hhc").text("Convocati (" + concount + ")");             
    $("#hhc").addClass("icon user");              
    
      
    }); 
 
    
    /* info partita */
    url = "http://adriasport.somee.com/adria/partitainfo.asp?pid=" + $("#pid").val() + "&sid=" + $("#sid").val(); 
     //alert (url);
        $.get(url, function(data){
       var dataret=data.split("$");
        var info=dataret[0].split("!");          
        //alert(dataret[0]); 
           $("#partinfo").text(info[0]);
           $("#quando").text(info[1]);
           $("#ritrovo").text(info[2]);
          var pub="Convocazioni non ancora pubblicate" ;
         if (info[3]=="SI")  {
          pub="Convocazioni già pubblicate" ;     
           }
         $("#pub").text(pub);
    }); 
   
    
$("#partita").css({ visibility: "visible"});       
           
          activate_subpage("#convocazioni"); 
          $.afui.drawer.hide ("#uib_w_11", "left");
         return false;
    });
     
        

/*********************************** ALBERGO **********************************************/              
    $(document).on("click", "#bt_albergo", function(evt)
    {
$("#ev_l").val($("#alb_l").val());   
    var info;
$(".card-header").empty();        
$(".card-footer").empty();  

 var   label="Num.Tel <p5 style='font-style: italic; font-size: small;'>(click sul numero per chiamare)</p5>";

$(".card-header").append("<h1>" + $("#alb").val() + "</h1>")   ;
$(".card-footer").append("<br><hr><br><h1>" + label + ":</h1> " + $("#alb_t").val() + "<br><br><hr><br><h1>Indirizzo:</h1>" + $("#alb_l").val() +"<br>" );  

info=getRouteInfo($("#curr_pos").val(),$("#alb_l").val(),"Attuale posizione");        

$.afui.drawer.show("#uib_w_11", "left");
    
        return false;
    });
 
     
/*********************************** CONVOCA GIOCATORE **********************************************/  
    $("#rosa").on("click", "li", function(evt)
    {
rosacount=rosacount-1;
concount=concount+1;        
var cc=($(this).text());
var lielem='<li style=" font-size: 14px;"class="widget uib_w_24" data-uib="app_framework/listitem" data-ver="2" id="' + cc + '"><a>' + cc + '</a></li>'     ;
    $("#convo").append(lielem);  
    $(this).remove();    
    var rc=sortUnorderedList("convo",false);    
    $("#hhr").text("Rosa (" + rosacount + ")");      
    $("#hhr").addClass("icon user");       
    $("#hhc").text("Convocati (" + concount + ")");             
    $("#hhc").addClass("icon user");              
         
        return false;
    });
    
/*********************************** RIMUOVI CONVOCAZIONE **********************************************/  
     $("#convo").on("click", "li", function(evt)
    {
rosacount=rosacount+1;
concount=concount-1;            
var cc=($(this).text());
var lielem='<li class="widget uib_w_24 elenchi" data-uib="app_framework/listitem" data-ver="2" id="' + cc + '"><a>' + cc + '</a></li>'     ;

    $("#rosa").append(lielem);  
    $(this).remove();    
    var rc=sortUnorderedList("rosa",false);
  
    $("#hhr").text("Rosa (" + rosacount + ")");      
    $("#hhr").addClass("icon user");       
    $("#hhc").text("Convocati (" + concount + ")");             
    $("#hhc").addClass("icon user");              
    
    
          
    
        return false;
    });     
     
     
 /*********************************** SALVA CONVOCAZIONE **********************************************/  
    $(document).on("click", "#salvaConvo", function(evt)
    {
       var convocati="";    
   var listItems = $("#convo li");
   listItems.each(function(li) {
   var el = $(this).text();   
   convocati=convocati + "," + el;
         
 });
       
        var url = "http://adriasport.somee.com/adria/convoca.asp?pid=" + $('#pid').val() + "&convocati=" +convocati +"&rit=" + $("#ritrovo").val()+"&sid=" + $("#sid").val();
      
        $.get(url, function(data){
       var dataret=data.split("$");
       if (dataret[0]=="OK") 
        alert ('Convocazioni salvate correttamente' );
       else alert("Errore nel salvataggio");
    }); 
        return false;
    });
    
        
    
    
    /*********************************** NOTE **********************************************/  
    $(document).on("click", "#bt_note", function(evt)
    {
      $("#notescreen").empty(); 
      $("#partinfon").empty();       
      $("#quandon").empty();              
      $("#ritrovon").empty();
      $("#partinfon").empty();       
      $("#quandon").empty();              
      $("#ritrovon").empty(); 
      $("#notescreen").empty(); 
    
var url = "http://adriasport.somee.com/adria/note.asp?pid=" + $("#pid").val() + "&sid=" + $("#sid").val(); 
     
        $.get(url, function(data){
        var dataret=data.split("$"); 
        $("#notescreen").html(dataret[0]);    
        
    }); 
       /* info partita */
    url = "http://adriasport.somee.com/adria/partitainfo.asp?pid=" + $("#pid").val() + "&sid=" + $("#sid").val(); 
     $.get(url, function(data){
       var dataret=data.split("$");
        var info=dataret[0].split("!");          
           $("#partinfon").text(info[0]);
           $("#quandon").text(info[1]);
           $("#ritrovon").text("Ritrovo:" + info[2]);
   
    });  
$("#partita").css({ visibility: "visible"});    
        
        
         activate_subpage("#note"); 
         return false;
      
    });
    
    
    
 /*********************************** ESCI MAPPA **********************************************/  
    $(document).on("click", "#escimappa", function(evt)
    {
        activate_subpage("#page_33_15"); 
        $.afui.drawer.show("#uib_w_11", "left");
         return false;
    });
    
 /*********************************** ESCI CONVOCAZIONI **********************************************/  
    $(document).on("click", "#esciConvo", function(evt)
    {
        activate_subpage("#page_33_15"); 
        //$.afui.drawer.show("#uib_w_11", "left");
         return false;
    });
    
        /* button  #backDAgare */
    $(document).on("click", "#backDAgare", function(evt)
    {
       activate_subpage("#page_33_15"); 
         return false;
    });
    
        /* button  #esciNote */
    $(document).on("click", "#esciNote", function(evt)
    {
        activate_subpage("#page_33_15"); 
         return false;
    });
    
        /* button  #btlogin */
    $(document).on("click", "#btlogin", function(evt)
    {
        var rc=getTornei();
        activate_subpage("#login");  
         return false;
    });
    
        /* button  #registrati */
    $(document).on("click", "#registrati", function(evt)
    {
        
        
        mm=$("#mailaddressN").val() + "@" + $("#mailaddressS").val()
        ValidateEmail(mm); 
        //alert (idslogin + " con " + mm + " sono " + sonologin);
        setSid();
        return false;
    });
    
    }
 document.addEventListener("app.Ready", register_event_handlers, false);
{}})();




/*******************************************************************************************************************************************/
/************************* FUNZIONI ********************************************************************************************************/
/*******************************************************************************************************************************************/



/*********************************** LISTA EVENTI **********************************************/  
function getEventi(bflag) { 
    activate_subpage("#page_33_15"); 
    if (bflag=="load") { 
    $("#eventi").empty(); 
    var dataret;
    var tt;
    var icona="icon calendar";
    var url = "http://adriasport.somee.com/adria/eventi.asp?sid=" + $("#sid").val();        
     $.get(url, function(data){
     dataret=data.split("$"); 
     var fLen=dataret.length-1;     
     for (var i = 0; i < fLen; i++) { 
     icona="icon calendar";     
     var ev=dataret[i].split("§"); 
         evy[i][0]=ev[0];
         evy[i][1]=ev[1];
         evy[i][2]=ev[2];
         evy[i][3]=ev[3];
         evy[i][4]=ev[4];
         evy[i][5]=ev[5];
         evy[i][7]=ev[5];
         evy[i][8]=ev[7];
         evy[i][6]="evento";
         tt=$("#torneo").val() + "\n" + $("#soc").val() + "\n" + $("#cat").val();
     var evd="  " + ev[1] + "<br>" + ev[2] ;
         
         if (ev[5]=="match")
             icona="fa fa-soccer-ball-o";
       var el='<li class="widget uib_w_8 evstyle" data-uib="app_framework/listitem" data-ver="2" id=' + i + '><a class="' + icona + '">' + evd + '</a></li>';
        $("#eventi").append(el);  
         }
         $("#titoloh").text(tt);
     });         
} else
     $("#eventi").append("<a class='button widget uib_w_46 btlog' data-uib='app_framework/button' data-ver='2' id='btlogin'>Clikka qui per la prima registrazione</a>");
    }

/*********************************** LISTA UTILITY **********************************************/  
function getUtil(tipo) { 
    $("#eventi").empty(); 
    var dataret;
    var tt;
    var url = "http://adriasport.somee.com/adria/utility.asp?sid=" + $("#sid").val() + "&tipo=" + tipo;        
     $.get(url, function(data){
     dataret=data.split("$"); 
     var fLen=dataret.length-1;     
     for (var i = 0; i < fLen; i++) { 
       
     var ev=dataret[i].split("§"); 
         evy[i][0]=ev[0];
         evy[i][1]=ev[1];
         evy[i][2]="<a href=tel:"+ev[2] + ">" + ev[2] + "</a>";
         evy[i][3]=ev[3];
         evy[i][4]=ev[4];
         evy[i][5]=ev[5];
         evy[i][6]="util";
         evy[i][7]=tipo;
         var evd="    " + ev[1] + "<br>" + ev[3] ;
         tt=ev[6];
           
       var el='<li class="widget uib_w_8 evstyle" data-uib="app_framework/listitem" data-ver="2" id=' + i + '><a class="' + ev[5] + '">' + evd + '</a></li>';
        $("#eventi").append(el);  
         }
        $("#titoloh").text(tipo); 
     });         
}

/*********************************** LISTA RIFERIMENTI **********************************************/  
function getRif() { 
    var dataret;
    buttonrif = [];
 
    var url = "http://adriasport.somee.com/adria/riferimenti.asp?sid=" + $("#sid").val();        
     $.get(url, function(data){
     dataret=data.split("$"); 
     var fLen=dataret.length-1;     
     var ev;
     var evd;     
     var funName;     
     var i  ;   
     for ( i = 0; i < fLen; i++) { 
         ev=dataret[i].split("§"); 
         evd=ev[1] + "-" + ev[2] + " : " + ev[3];
       
         buttonrif.push({"text": evd,"cssClasses": "rifstyle", "handler": function(){var ilocal = ev[3]; return function() {rifcall(ilocal);};}()});   
        }
     $.afui.actionsheet(buttonrif);  
     });         
}

/*********************************** CREAZIONE ARRAY **********************************************/  
   function Create2DArray(rows) {
  var arr = [];

  for (var i=0;i<rows;i++) {
     arr[i] = [];
  }

  return arr;
}

/*********************************** CALCOLO PERCORSO **********************************************/  
 function getRouteInfo(partenza,arrivo,partenza_desc) {
    
   var request = {
          origin:partenza, 
          destination:arrivo,
          travelMode: google.maps.DirectionsTravelMode.DRIVING
   };
        
    directionsService.route(request, function(response, status) {
        if (status == google.maps.DirectionsStatus.OK) {
           var point = response.routes[ 0 ].legs[ 0 ];
          if(partenza_desc=="Albergo")  {
           $(".card-footer").append("<br><HR><br><h1>Da " + partenza_desc + ":</h1>&nbsp;&nbsp;&nbsp;distanza: " + point.distance.text + "<BR>&nbsp;&nbsp;&nbsp;durata percorso: " + point.duration.text) ;        
           $(".card-footer").append("<a class='button widget uib_w_19 d-margins btmap icon pin green' data-uib='app_framework/button' data-ver='2' id='bnmappahotel'></a>");
                 }
           else { 
             $(".card-footer").append("<HR><br><h1>Da attuale tua posizione:</h1>&nbsp;&nbsp;&nbsp;distanza: " + point.distance.text + "<BR>&nbsp;&nbsp;&nbsp;durata percorso: " + point.duration.text) ;       
             $(".card-footer").append("<a class='button widget uib_w_19 d-margins btmap icon location green' data-uib='app_framework/button' data-ver='2' id='bnmappacurr'></a>");  
               }
        }
     });
  return false;
}

/*********************************** ON SUCCESS/ON ERROR DA POSIZIONE CORRENTE **********************************************/  
function onSuccess(position) {
        //var rc=getMap(position.coords.latitude + "," + position.coords.longitude);
   $("#curr_pos").val(position.coords.latitude + "," + position.coords.longitude);  
}

function onError(error) {
        alert('code: '    + error.code    + '\n' +
              'message: ' + error.message + '\n');
    }

/*********************************** CHIAMATA TELEFONICA ***************************************************/  
function rifcall(ntel) {
        ntel='0555233991';
        document.location.href = 'tel:'+ntel;
              
    }

/*********************************** MAPPA *****************************************************************/  
function getMap(partenza,arrivo) {
    var myOptions = { 
		zoom:7,
        
      	center: {lat: 41.85, lng: -87.65}
	   }; 
    var partenzaDisplay=partenza;
    map = new google.maps.Map(document.getElementById("map3"), myOptions);     
    
    if (partenza.substring(0,1)=="4") 
          partenzaDisplay="Tua attuale posizione";
        
    
    directionsDisplay.setMap(map);
    directionsDisplay.setPanel(document.getElementById("panel3"));     
   
   
   
    var request = {
          origin:partenza, 
          destination:arrivo,
          travelMode: google.maps.DirectionsTravelMode.DRIVING
   };
        
    directionsService.route(request, function(response, status) {
        if (status == google.maps.DirectionsStatus.OK) {
          directionsDisplay.setDirections(response);
          $("#map_info3").text("Partenza:" + partenzaDisplay + " \r\n Arrivo:" + arrivo);      }
     });
    }
    
/*********************************** SORT LISTA **********************************************/  
function sortUnorderedList(ul, sortDescending) {
  if(typeof ul == "string")
    ul = document.getElementById(ul);

  var lis = ul.getElementsByTagName("li");
  var vals = [];

  for(var i = 0, l = lis.length; i < l; i++)
    vals.push(lis[i].innerHTML);

  vals.sort();

  if(sortDescending)
    vals.reverse();

  for( i = 0, l = lis.length; i < l; i++)
      lis[i].innerHTML = vals[i];
    
  
}

/*********************************** SET SID **********************************************/  
   function setSid() {
        //activate_subpage("#login");  
       
  // var soc_id = prompt("inserisci ID società che ti è stato consegnato al check-in");
        
   var url = "http://adriasport.somee.com/adria/squadrainfo.asp?sid=" + idslogin + "&mm=" + mm + "&sono=" + sonologin;
     $.get(url, function(data){
     var dataret=data.split("$"); 
     var fLen=dataret.length-1;     
     for (var i = 0; i < fLen; i++) {      
        $("#sid").val(dataret[0]); 
        $("#cat").val(dataret[1]);   
        $("#soc").val(dataret[2]);
        $("#torneo").val(dataret[3]);  
        $("#alb").val(dataret[4]);  
        $("#alb_t").val(dataret[5]);  
        $("#alb_l").val(dataret[6]);  
        localStorage.setItem("sid", idslogin); 
        localStorage.setItem("cat", dataret[1]); 
        localStorage.setItem("soc", dataret[2]);
        localStorage.setItem("torneo", dataret[3]); 
        localStorage.setItem("alb", dataret[4]); 
        localStorage.setItem("alb_t", dataret[5]); 
        localStorage.setItem("alb_l", dataret[6]); 
        
         }
alert("Diamo il benevenuto alla società: " + $("#soc").val() + "\nPer la partecipazione al " + $("#torneo").val() + "\nCategoria:" +   $("#cat").val()); 
rc= getEventi("load");          
         }); 
}

 


function drop() {
        //geocodeAddress(centro);
   
    

        clearMarkers();
    var myOptions = { 
		zoom:10,
      	center: centro[0]
	   }; 
    
    map = new google.maps.Map(document.getElementById("map3"), myOptions);  
        for (var i = 0; i < neighborhoods.length; i++) {
          addMarkerWithTimeout(neighborhoods[i], i * 200,titoli[i]);
        }
      }

function addMarkerWithTimeout(position, timeout,titolo) {
        window.setTimeout(function() {
           
          markers.push(new google.maps.Marker({
            position: position,
            map: map,
            animation: google.maps.Animation.DROP,
            title: titolo
          }));
        }, timeout);
      }

function clearMarkers() {
        for (var i = 0; i < markers.length; i++) {
          markers[i].setMap(null);
        }
        markers = [];
      }

function geocodeAddress(address) {
alert(address);
     var geocoder = new google.maps.Geocoder();   
        geocoder.geocode({'address': address}, function(results, status) {
          if (status === 'OK') {
           //alert(results[0].geometry.location);
	       $("#centro").val(results[0].geometry.location);
        
          } else {
            alert('xxxGeocode was not successful for the following reason: ' + status);
          }
	  
        });
      }

function getTornei() { 
    $('label[for=lg_torneo],select#lg_torneo').show();
    $('label[for=lg_squadra],select#lg_squadra').hide();
    $('label[for=lg_categoria],select#lg_categoria').hide();
    $('#sonoid').hide();
    $('#registrati').hide();
    $('#mailaddressN').hide();
    $('#mailaddressS').hide();
    $('#mailaddressL').hide();
    $('#mailaddressC').hide();
    
    $('#consensoID').hide();
    
    $("#lg_torneo").empty(); 
    $("#lg_torneo").append("<option>scegli...</option>"); 
    var dataret;
    var icona="icon calendar";
    var url = "http://adriasport.somee.com/adria/login.asp?tipo=t";        
     $.get(url, function(data){
     dataret=data.split("$"); 
     var fLen=dataret.length-1;     
     for (var i = 0; i < fLen; i++) { 
     icona="icon calendar";     
     var tt=dataret[i].split("§"); 
         var opt="<option value='" + tt[4] + "'>" + tt[0] + " " + tt[1]  + "</option>";
         
        $("#lg_torneo").append(opt);  
         }
         
     });         

    }



function TSelected(sel) { 
 $('label[for=lg_squadra],select#lg_squadra').show();    
 $("#lg_squadra").empty(); 
    $("#lg_squadra").append("<option>scegli...</option>"); 
    var dataret;
    var icona="icon calendar";
    //var url = "http://adriasport.somee.com/adria/login.asp?tipo=s&t="sel.value;        
    
    var url = "http://adriasport.somee.com/adria/login.asp?tipo=s&t=1";
    
     $.get(url, function(data){
     dataret=data.split("$"); 
     var fLen=dataret.length-1;     
     for (var i = 0; i < fLen; i++) { 
     icona="icon calendar";     
     var tt=dataret[i].split("§"); 
           var opt="<option value=" + tt[1] + ">" + tt[0]  + "</option>";
         
        $("#lg_squadra").append(opt);  
         }
         
     });         
}


function SSelected(sel) { 
 $("#lg_categoria").empty(); 
 $('label[for=lg_categoria],select#lg_categoria').show();  

    $("#lg_categoria").append("<option>scegli...</option>"); 
    var dataret;
    var icona="icon calendar";
    //var url = "http://adriasport.somee.com/adria/login.asp?tipo=s&t="sel.value;        
    
    var url = "http://adriasport.somee.com/adria/login.asp?tipo=c&s=" + sel.value
    
     $.get(url, function(data){
     dataret=data.split("$"); 
     var fLen=dataret.length-1;     
     for (var i = 0; i < fLen; i++) { 
     icona="icon calendar";     
     var tt=dataret[i].split("§"); 
           var opt="<option value=" + tt[1] + ">" + tt[0] + "</option>";
         
        $("#lg_categoria").append(opt);  
         }
         
     });         
}

function CSelected(sel) { 
 $('#sonoid').show();      
 idslogin=sel.value;
}

function sono(sel) { 
sonologin=sel.value;
    $('label[for=lg_torneo],select#lg_torneo').hide();
    $('label[for=lg_squadra],select#lg_squadra').hide();
    $('label[for=lg_categoria],select#lg_categoria').hide();
    $('#sonoid').hide();
    $('#registrati').show();
    $('#consensoID').show(); 
    $('#mailaddressN').show();
    $('#mailaddressS').show();
    $('#mailaddressL').show();
    $('#mailaddressC').show();
}

function ValidateEmail(mail) 
{
 if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail))
  {
    return (true);
  }
    alert("Hai inserito un indirizzo Email non corretto, riprova");
    return (false);
}