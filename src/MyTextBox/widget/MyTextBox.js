define([
  "dojo/_base/declare",
  "mxui/widget/_WidgetBase",
  "dijit/_TemplatedMixin",
  "dojo/_base/lang",
  "./utils",
  "MyTextBox/widget/map",
  "dojo/text!MyTextBox/widget/MyTextBox.html",
  "xstyle/css!MyTextBox/widget/map.css"
], function(
  declare,
  _WidgetBase,
  _TemplatedMixin,
  lang,
  utils,
  /*_jQuery,*/ widgetTemplate
) {
  "use strict";
  // var $ = _jQuery.noConflict(true);
  return declare("MyTextBox.widget.MyTextBox", [_WidgetBase, _TemplatedMixin], {
    // _TemplatedMixin will create our dom node using this HTML template.
    templateString: widgetTemplate,
    // DOM elements
    canvas: null,
    // Parameters configured in the Modeler.
    messageString: "",
    // Internal variables. Non-primitives created in the prototype are shared between all widget instances.
    _handles: null,
    _contextObj: null,

    inputargs: { 
      longitude :'',
      latitude :'',
      startLat :'',
      startLon :'',
      zoomlevel :'',
      startArea :'',
      searchArea : '',
      road :'',
      tambol :'',
      amphur :'',
      province :'',
      zipcode :'',
      placename :'',
      geodata: '',
      editable :true
    },

    //IMPLEMENTATION
	  context : null,
	  object1: null,
	  suggestKeyword: null,

    renderTextBox : function (mxobject) {
      this.object1 = mxobject;
      MXobject = mxobject;
      MXlongitude=this.longitude;
      MXlatitude=this.latitude;
      MXstartLat=this.startLat;
      MXstartLon=this.startLon;
      MXzoomlevel=this.zoomlevel;
      MXstartArea=this.startArea;
      MXroad=this.road;
      MXtambol=this.tambol;
      MXamphur=this.amphur;
      MXprovince=this.province;
      MXzipcode=this.zipcode;
      MXplacename = this.placename;
      MXgeodata = this.geodata;
      mapeditable = this.editable;
      
      map.Overlays.clear();
      var la = new Number(mxobject.get(this.latitude));
      var lo = new Number(mxobject.get(this.longitude));
      
      stlat = new Number(mxobject.get(this.startLat));
      stlon = new Number(mxobject.get(this.startLon));
      stzoom = new Number(mxobject.get(this.zoomlevel));
      var tmpareacode = mxobject.get(this.searchArea);
      if(tmpareacode.length == 2 || tmpareacode.length == 4 || tmpareacode.length == 6){
        areacode = tmpareacode;
      }else{
        areacode ="";
        console.log('found invalid area code');
      }
      
      if(la>0){
        if(this.editable==true){
          marker1 = new longdo.Marker({lon: lo, lat: la}, {
            title: 'จุดเกิดเหตุ',
            detail: 'จุดเกิดเหตุ',
            size: {
              width: 300,
              height: 70
            },
            closable: true,
            icon: {
              url: '/widgets/MyTextBox/widget/image/pin_mark.png',
              offset: { x: 11, y: 40 }
            },
            clickable: true,
            draggable: true
  
            });
        }else{
          marker1 = new longdo.Marker({lon: lo, lat: la}, {
            title: 'จุดเกิดเหตุ',
            detail: 'จุดเกิดเหตุ',
            size: {
              width: 300,
              height: 70
            },
            closable: true,
            icon: {
              url: '/widgets/MyTextBox/widget/image/pin_mark.png',
              offset: { x: 11, y: 40 }
            },
            clickable: true,
            draggable: false
            });
        }
        map.Overlays.add(marker1);
      }else{
        //marker1 = new longdo.Marker({lon: stlon, lat: stlat},{title: 'จุดเกิดเหตุ',detail:  'จุดเกิดเหตุ',closable: true,clickable: true,draggable: true});
        marker1 = new longdo.Marker({lon: stlon, lat: stlat}, {
          title: 'จุดเกิดเหตุ',
          detail: 'จุดเกิดเหตุ',
          size: {
            width: 300,
            height: 70
          },
          closable: true,
          icon: {
            url: '/widgets/MyTextBox/widget/image/pin_mark.png',
            offset: { x: 11, y: 40 }
          },
          clickable: true,
          draggable: true
  
          });
        map.Overlays.add(marker1);
      }
      
      if(stlat>0){
        map.location({ lon:stlon, lat:stlat }, true);
        map.zoom(stzoom);
        console.log('move to '+stlat+' '+stlon+' zoomm '+stzoom );
      }else{
        console.log('start position undefined');
      }
      
      var stAreaValue = mxobject.get(this.startArea);
      stArea = longdo.Util.overlayFromWkt(stAreaValue,{
        lineWidth:1,
        lineColor:'rgba(255, 255, 0, 1)',
        fillColor:'rgba(255, 255, 0, 0.2)'
      });
      //console.log(stAreaValue);
      for(i=0;i<stAreaValue.length;i++){
        map.Overlays.add(stArea[i]);
      }
      //this.updateLocMarker();
      var geotmp = mxobject.get(this.geodata);
      if((geotmp.length>0)&&(geotmp!=null)){
        var geoobj = JSON.parse(geotmp);
        if(geoobj.geolist.length>0){
          for(i=0;i<geoobj.geolist.length;i++){
            if(geoobj.geolist[i].geotype === "line"){
              var geom1 = new longdo.Polyline(geoobj.geolist[i].location,{editable: this.editable});
              map.Overlays.add(geom1);
            }else if(geoobj.geolist[i].geotype === "polygon"){
              var geom2 = new longdo.Polygon(geoobj.geolist[i].location,{editable: this.editable});
              map.Overlays.add(geom2);
            }
          }
        }
      }
    },
    
    updateLoc : function () {
      var loc = map.location('POINTER');
      if(typeof loc.lon != 'undefined'){
        var tmp = new longdo.Marker(loc,{title: 'จุดเกิดเหตุ',detail:  'จุดเกิดเหตุ',closable: true,clickable: true,draggable: true});
        console.log(loc.lon);
        console.log(loc.lat);
        /*var stPolygon = new longdo.Polygon(stArea[0].location());
        if(stPolygon.contains(tmp)){*/
          map.Overlays.remove(marker1);
          marker1 = new longdo.Marker(loc);
          map.Overlays.add(marker1);
          MXobject.set(MXlongitude,loc.lon);
          MXobject.set(MXlatitude,loc.lat);
          MXobject.set(MXstartLon,loc.lon);
          MXobject.set(MXstartLat,loc.lat);
          MXobject.set(MXzoomlevel,map.zoom());
          
        /*}else{
          alert('ไม่อยู่ในขอบเขตที่กำหนด');
        }*/
      }else{
        console.log('get undefined value');
      }
    },
    
    updateLocMarker : function (event) {
      
      var loc = marker1.location();
      if(typeof loc.lon != 'undefined'){
        if(loc.lon>0 && loc.lat>0){
          if($.isNumeric(loc.lon) && $.isNumeric(loc.lat)){
            //console.log('lon='+loc.lon);
            //console.log('lat='+loc.lat);
            MXobject.set(MXlongitude,loc.lon);
            MXobject.set(MXlatitude,loc.lat);
            MXobject.set(MXstartLon,loc.lon);
            MXobject.set(MXstartLat,loc.lat);
            MXobject.set(MXzoomlevel,map.zoom());
            MXobject.set(MXplacename,'');
      
            //console.log('drag to lat='+loc.lat+' lon='+loc.lon)
            
            $("input[name=\""+MXobject.getEntity()+'/'+MXlongitude+"\"]").val(loc.lon);
            $("input[name=\""+MXobject.getEntity()+'/'+MXlatitude+"\"]").val(loc.lat);
            $("input[name=\""+MXobject.getEntity()+'/'+MXstartLon+"\"]").val(loc.lon);
            $("input[name=\""+MXobject.getEntity()+'/'+MXstartLat+"\"]").val(loc.lat);
            $("input[name=\""+MXobject.getEntity()+'/'+MXzoomlevel+"\"]").val(map.zoom());
            $("input[name=\""+MXobject.getEntity()+'/'+MXplacename+"\"]").val('');
          }
        }
      }else{
        console.log('get undefined value');
      }
      map.Search.address(loc);	
    },
  
    addOverlay : function() {
      var loc = map.location();
      if(this.editable==false){
        return;
      }
      markertmp = new longdo.Marker(loc, {
        title: 'จุดเกิดเหตุ',
        detail: 'จุดเกิดเหตุ',
        size: {
          width: 300,
          height: 70
        },
        closable: true,
        icon: {
          url: '/widgets/MyTextBox/widget/image/pin_mark.png',
          offset: { x: 11, y: 40 }
        },
        clickable: true,
        draggable: true
        });
        if(!stArea[0].contains(markertmp)){
          var ret = confirm('ยืนยันการปักหมุดนอกเขตพื้นที่รับผิดชอบ ?'); 
          if(ret == true){
          map.Overlays.remove(marker1);
          marker1 = new longdo.Marker(loc, {
            title: 'จุดเกิดเหตุ',
            detail: 'จุดเกิดเหตุ',
            size: {
              width: 300,
              height: 70
            },
            closable: true,
            icon: {
              url: '/widgets/MyTextBox/widget/image/pin_mark.png',
              offset: { x: 11, y: 40 }
            },
            clickable: true,
            draggable: true
  
            });
          map.Overlays.drop(marker1);
          }else{
          return;
          }
        }else{
        map.Overlays.remove(marker1);
        marker1 = new longdo.Marker(loc, {
          title: 'จุดเกิดเหตุ',
          detail: 'จุดเกิดเหตุ',
          size: {
            width: 300,
            height: 70
          },
          closable: true,
          icon: {
            url: '/widgets/MyTextBox/widget/image/pin_mark.png',
            offset: { x: 11, y: 40 }
          },
          clickable: true,
          draggable: true
  
          });
        map.Overlays.drop(marker1);  
        }
        
        
      if(typeof loc.lon != 'undefined'){
        if(loc.lon>0 && loc.lat>0){
          if($.isNumeric(loc.lon) && $.isNumeric(loc.lat)){
            console.log('lon='+loc.lon);
            console.log('lat='+loc.lat);
            MXobject.set(MXlongitude,loc.lon);
            MXobject.set(MXlatitude,loc.lat);
            MXobject.set(MXstartLon,loc.lon);
            MXobject.set(MXstartLat,loc.lat);
            MXobject.set(MXzoomlevel,map.zoom());
            console.log('drag to lat='+loc.lat+' lon='+loc.lon)
            
            $("input[name=\""+MXobject.getEntity()+'/'+MXlongitude+"\"]").val(loc.lon);
            $("input[name=\""+MXobject.getEntity()+'/'+MXlatitude+"\"]").val(loc.lat);
            $("input[name=\""+MXobject.getEntity()+'/'+MXstartLon+"\"]").val(loc.lon);
            $("input[name=\""+MXobject.getEntity()+'/'+MXstartLat+"\"]").val(loc.lat);
            $("input[name=\""+MXobject.getEntity()+'/'+MXzoomlevel+"\"]").val(map.zoom());
          }
        }
      }else{
        console.log('get undefined value');
      }
      map.Search.address(loc);
    },
    
    
    doSearch : function(){
      //console.log('doSearch');
      if(areacode.length>0){
        map.Search.search(this.searchKey.value,{area:areacode});
      }else{
        map.Search.search(this.searchKey.value);
      }
      document.getElementById("suggests").style.visibility = "hidden";
      document.getElementById("srcResult").style.visibility = "visible";
    },
    
    doClear : function(){
      console.log('doClear');
      $('#srcKey').val('');
      $('#suggests').html('');		
      map.Search.search('');
      document.getElementById("srcResult").style.visibility = "hidden";
      document.getElementById("suggests").style.visibility = "hidden";
    },
    
    doSuggest : function(){
      if (this.searchKey.value.length < 2) return;
      //map.Search.suggest(this.searchKey.value);
      suggestKeyword = this.searchKey.value;
      
      var data;
      if(areacode.length>0){
        data = {
        keyword: suggestKeyword,
        area:areacode
        };
      }else{
        data = {
        keyword: suggestKeyword
        };
      }
      suggestList = [];
      
      var suggesturl = '';
      var prot = location.protocol;
      if (prot == 'https:') {
        suggesturl = 'https://api.longdo.com/map/services/suggest?callback=?';
        //suggesturl = 'https://172.17.4.212/map2/services/suggest?callback=?';
      }else{
        suggesturl = 'http://api.longdo.com/map/services/suggest?callback=?';
        //suggesturl = 'http://172.17.4.212/map2/services/suggest?callback=?';
      }
      //$.getJSON('https://172.17.4.212/map2/services/suggest?callback=?', data, function(msg) {
      $.getJSON('http://api.longdo.com/map/services/suggest?callback=?', data, function(msg) {
         //console.log(msg);
        if (msg.meta.keyword != suggestKeyword) return;
        var html = '';
        suggestindex = -1;
        for (var i = 0; i < msg.data.length; i++) {
          suggestList[i] = msg.data[i].w;
          html = html + '<tr id="suggest' + i + '"><td style="min-width: 213px;"><a href="javascript:suggestClick(' + i + ')">' + msg.data[i].d + '</a></td></tr>';
        }
        $('#suggests').html('<tbody>' + html + '</tbody>');
        document.getElementById("srcResult").style.visibility = "hidden";
        document.getElementById("suggests").style.visibility = "visible";
      });
    },
    
    doLayer : function(){
      if(this.layer1dj.checked){
        map.Layers.add(policearea);
      }else{
        map.Layers.remove(policearea);
      }
      if(this.layer2dj.checked){
        map.Layers.add(policelocation);
      }else{
        map.Layers.remove(policelocation);
      }
    },
    
    doShowLatLon : function(){
      //console.log('doShowLatLon');
      if(this.showlatlondj.checked){
        this.inputLatLondj.style.display = "inline";
      }else{
        this.inputLatLondj.style.display = "none";
      }
    },
    
    doSaveLatLon : function (){
      markOverlay(this.inputLondj.value, this.inputLatdj.value);
      //this.inputLatLondj.style.display = "none";
      //this.showlatlondj.checked=false;
    },
    
    doHome : function (){
      map.location({lon:stlon,lat:stlat},false);
      map.zoom(stzoom,false);
    },
    
    doDelGeom : function (){
      var ret = confirm('ยืนยันการลบภาพวาดทั้งหมด ?'); 
      if(ret == true){
        MXobject.set(MXgeodata,'');
        var delobj =[];
        for(i=0;i<map.Overlays.size();i++){
          loc = map.Overlays.list()[i].location();
          if((loc.length>1)&&(loc.length<=100)){
            delobj.push(map.Overlays.list()[i]);
          }
        }
        for(j=0;j<delobj.length;j++){
          map.Overlays.remove(delobj[j]);
        }
      }
    },
    
    doPrint : function (){
      //var loc = map.location();
      
      var lat = MXobject.get(this.latitude);
      var lon = MXobject.get(this.longitude);
      var zoom = map.zoom();
      //var area = MXobject.get(this.startArea);
      var geodata =MXobject.get(this.geodata);
      
      window.open("/widgets/MyTextBox/widget/print.html?lat="+lat+"&lon="+lon+"&zoom="+zoom+"&geodata="+geodata,'_blank');
      
    },
    
    postCreate : function(){
      if (typeof(jQuery) == "undefined") {
        dojo.require("MyTextBox.widget.jquery-min");
      }
      
      this.initContext();
      this.actRendered();
      //this.connect(this.mapDiv, "onclick", dojo.hitch(this, this.updateLoc));
      //this.connect(this.searchOK, "onclick", dojo.hitch(this, this.doSearch));
      //this.connect(this.searchClear, "onclick", dojo.hitch(this, this.doClear));
      this.connect(this.searchKey, "oninput", dojo.hitch(this, this.doSuggest));
      this.connect(this.printMapdj, "onclick", dojo.hitch(this, this.doPrint));
      $('#srcKey').keyup(function( event ) {
        if(document.getElementById("suggests").style.visibility == "visible"){
          if(event.keyCode==13){
            if(suggestindex>=0){
              //console.log("Enter");
              suggestClick(suggestindex);
            }else{
              if(areacode.length>0){
                map.Search.search($('#srcKey').val(),{area:areacode});
              }else{
                map.Search.search($('#srcKey').val());
              }
              document.getElementById("suggests").style.visibility = "hidden";
              document.getElementById("srcResult").style.visibility = "visible";
            }
          }else if(event.keyCode==38){
            if(suggestindex>=0){
              $('#suggest'+suggestindex).css({'background-color':'white'});
              suggestindex--;
              $('#suggest'+suggestindex).css({'background-color':'rgb(226, 246, 252)'});
            }
            //console.log("Up suggestindex="+suggestindex);
          }else if(event.keyCode==40){
            if($('#suggest'+(suggestindex+1)).length==1){
              $('#suggest'+suggestindex).css({'background-color':'white'});
              suggestindex++;
              $('#suggest'+suggestindex).css({'background-color':'rgb(226, 246, 252)'});
              //console.log("Down suggestindex="+suggestindex);
            }
          }
        }else{
          if($('#srcKey').val().length>0){
            if(event.keyCode==13){
              if(areacode.length>0){
                map.Search.search($('#srcKey').val(),{area:areacode});
              }else{
                map.Search.search($('#srcKey').val());
              }
              document.getElementById("suggests").style.visibility = "hidden";
              document.getElementById("srcResult").style.visibility = "visible";
            }
          }
        }
      });
      this.connect(this.cleardj,"onclick",dojo.hitch(this, this.doClear));
      this.connect(this.addpindj,"onclick",dojo.hitch(this, this.addOverlay));
      this.connect(this.layer1dj,"onchange", dojo.hitch(this, this.doLayer));
      this.connect(this.layer2dj,"onchange", dojo.hitch(this, this.doLayer));
      
      this.connect(this.showlatlondj,"onchange", dojo.hitch(this, this.doShowLatLon));
      this.connect(this.saveLocdj,"onclick", dojo.hitch(this, this.doSaveLatLon));
      this.connect(this.homedj,"onclick", dojo.hitch(this, this.doHome));
      this.connect(this.delGeomdj,"onclick", dojo.hitch(this, this.doDelGeom));
      
      //this.inputLatLondj.style.display = "none";
      
      
      this.connect(this.srcButdj,"onclick", dojo.hitch(this, this.doSearch));
      if(this.editable==false){
        this.searchKey.style = "display:none";
        this.cleardj.style = "display:none";
        this.addpindj.style = "display:none";
        this.srcButdj.style = "display:none";
        this.layergroupdj.style = "display:none";
        this.inputLatLondj.style = "display:none";
        this.delGeomdj.style = "display:none";
      }
      
      $('#route').css({'display':'none'});
      
      init();
      //map.Event.bind('click',this.updateLoc);
      //map.Event.bind('overlayClick',this.updateLoc);
      
      map.Event.bind('overlayDrop', this.updateLocMarker);
      map.Event.bind('address', function(event) {
        locate = "";
        console.log(event);
        if (event) {
          locate += (typeof event.road !== 'undefined' ? event.road : '') + ' ' + (typeof event.subdistrict !== 'undefined' ? event.subdistrict : '') + ' ' + (typeof event.district !== 'undefined' ? event.district : '') + ' ' + (typeof event.province !== 'undefined' ? event.province : '') + ' ' + (typeof event.postcode !== 'undefined' ? event.postcode : '');
          locate = locate.trim();
          var roadtxt = '';
          var tamboltxt = '';
          var amphurtxt = '';
          var provincetxt = '';
          var zipcodetxt ='';
          if(typeof event.road !== 'undefined'){
          roadtxt = event.road+'';
          console.log('roadtxt= '+roadtxt+' '+MXobject.getEntity()+'/'+MXroad);
          MXobject.set(MXroad,roadtxt);
          $("input[name=\""+MXobject.getEntity()+'/'+MXroad+"\"]").val(roadtxt);
          }else{
          MXobject.set(MXroad,'');
          $("input[name=\""+MXobject.getEntity()+'/'+MXroad+"\"]").val('');
          }
          if(typeof event.subdistrict !== 'undefined'){
          tamboltxt = event.subdistrict+'';
          console.log('tamboltxt= '+tamboltxt+' '+MXobject.getEntity()+'/'+MXtambol);
          MXobject.set(MXtambol,tamboltxt);
          $("input[name=\""+MXobject.getEntity()+'/'+MXtambol+"\"]").val(tamboltxt);
          }else{
          MXobject.set(MXtambol,'');
          $("input[name=\""+MXobject.getEntity()+'/'+MXtambol+"\"]").val('');
          }
          if(typeof event.district !== 'undefined'){
          amphurtxt = event.district+'';
          console.log('amphurtxt= '+amphurtxt+' '+MXobject.getEntity()+'/'+MXamphur);
          MXobject.set(MXamphur,amphurtxt);
          $("input[name=\""+MXobject.getEntity()+'/'+MXamphur+"\"]").val(amphurtxt);
          }else{
          MXobject.set(MXamphur,'');
          $("input[name=\""+MXobject.getEntity()+'/'+MXamphur+"\"]").val('');
          }
          if(typeof event.province !== 'undefined'){
          provincetxt = event.province+'';
          console.log('provincetxt= '+provincetxt+' '+MXobject.getEntity()+'/'+MXprovince);
          MXobject.set(MXprovince,provincetxt);
          $("input[name=\""+MXobject.getEntity()+'/'+MXprovince+"\"]").val(provincetxt);
          }else{
          MXobject.set(MXprovince,'');
          $("input[name=\""+MXobject.getEntity()+'/'+MXprovince+"\"]").val('');
          }
          if(typeof event.postcode !== 'undefined'){
          zipcodetxt = event.postcode+'';
          console.log('zipcodetxt= '+zipcodetxt+' '+MXobject.getEntity()+'/'+MXzipcode);
          MXobject.set(MXzipcode,zipcodetxt);
          $("input[name=\""+MXobject.getEntity()+'/'+MXzipcode+"\"]").val(zipcodetxt);
          }else{
          MXobject.set(MXzipcode,'');
          $("input[name=\""+MXobject.getEntity()+'/'+MXzipcode+"\"]").val('');
          }
        }
        console.log('address= '+locate);
      });
      
      if (window.jQuery) {  
        console.log('JQuery Ready'); 
      } else {
        console.log('JQuery not load');
      }
    },
    
    _setDisabledAttr : function(value) {
      
    },
    
    _getValueAttr : function () {
      return '';
    },
    
    onChange : function () {
      console.log('change mxobject');
    },
    
    _setValueAttr : function(value) {
    },
    
    applyContext : function(context, callback){
      //this.getSlideEnum(context);
      if (context && context.getActiveGUID()) 
        mx.processor.getObject(context.getActiveGUID(), dojo.hitch(this, this.renderTextBox));
      else
        logger.warn(this.id + ".applyContext received empty context");
      callback && callback();
    },
    
    uninitialize : function(){
      console.log('uninitialize');
    }
    
  });
});

require(["MyTextBox/widget/MyTextBox"]);
