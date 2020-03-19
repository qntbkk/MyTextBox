dojo.declare("MyTextBox.widget.map");
var imported = document.createElement('script');
//imported.src = 'http://api.longdo.com/map/?key=62ec7878c30a59eff5fe0c21e872cd91';
var prot = location.protocol;
if (prot == 'https:') {
	//imported.src = 'https://172.17.4.212/map2/?key=62ec7878c30a59eff5fe0c21e872cd91';
	imported.src = 'https://api.longdo.com/map/?key=62ec7878c30a59eff5fe0c21e872cd91';
	document.head.appendChild(imported);
}else{
	//imported.src = 'http://172.17.4.212/map2/?key=62ec7878c30a59eff5fe0c21e872cd91';
	imported.src = 'http://api.longdo.com/map/?key=62ec7878c30a59eff5fe0c21e872cd91';
	document.head.appendChild(imported);
}
var map;
var marker1;
var stArea;
var MXobject;
var MXlongitude;
var MXlatitude;
var MXstartLat;
var MXstartLon;
var MXzoomlevel;
var MXstartArea;
var MXroad;
var MXtambol;
var MXamphur;
var MXprovince;
var MXzipcode;
var MXplacename;
var MXgeodata;
var suggestList = [];
var arrMarker = new Array();
var curMarker = '';
var mapeditable = true;
var policearea;
var bharea;
var bkarea;
var areacode;
var suggestindex = -1;
var stzoom;
var stlat;
var stlon;
var isfullscreen = false;
var curpoiname ='';
var selectedGeom;


function init() {
	// กำหนดขนาดแผนที่
	resize();
	//window.addEventListener('resize', resize);
	longdo.MapTheme.ui.measureOptions = {weight:longdo.OverlayWeight.Top};
	
	// สร้างแผนที่
	map = new longdo.Map({
	  placeholder: document.getElementById('map')
	});
	map.Overlays.clear();
	map.Search.placeholder(
		document.getElementById('srcResult')
	);
	
	policearea = new longdo.Layer('crimes:policestation_area', {
			type: longdo.LayerType.WMS,
			url: 'http://172.17.4.202:8080/geoserver/gwc/service/wms'
		});
	bharea = new longdo.Layer('crimes:bharea', {
			type: longdo.LayerType.WMS,
			url: 'http://172.17.4.202:8080/geoserver/gwc/service/wms'
		});
	bkarea = new longdo.Layer('crimes:bkarea', {
			type: longdo.LayerType.WMS,
			url: 'http://172.17.4.202:8080/geoserver/gwc/service/wms'
		});	
	policelocation = new longdo.Layer('crimes:policestation_location', {
			type: longdo.LayerType.WMS,
			url: 'http://172.17.4.202:8080/geoserver/gwc/service/wms'
		});

	map.Event.bind('fullscreen', function(event){
		if(event===true){
			if(mapeditable===true){
				$('#layergroup').css({'top': '0px','left':'0px','position':'fixed'});
				$('#srcKey').css({'top': '0px','left':'0px','position':'fixed'});
				$('#srcBut').css({'top': '0px','left':'0px','position':'fixed'});
				$('#clear').css({'top': '0px','left':'0px','position':'fixed'});
				$('#home').css({'top': '0px','left':'0px','position':'fixed'});
				$('#addpin').css({'top': '0px','left':'0px','position':'fixed'});
				$('#suggests').css({'top': '0px','left':'0px','position':'fixed'});
				$('#srcResult').css({'top': '0px','left':'0px','position':'fixed'});
				$('#inputLatLon').css({'position':'fixed'});
				$('#route').css({'top': '0px','left':'0px','position':'fixed'});
				$('#delGeom').css({'top': '0px','left':'0px','position':'fixed'});
				//$('.ldmap_placeholder').css({'top': '35px!important','height': '95%!important'});
			}else{
				$('#home').css({'top': '0px','left':'0px','position':'fixed'});
			}
			isfullscreen=true;
		}else{
			if(mapeditable===true){
				$('#layergroup').removeAttr('style');
				$('#srcKey').removeAttr('style');
				$('#srcBut').removeAttr('style');
				$('#clear').removeAttr('style');
				$('#home').removeAttr('style');
				$('#addpin').removeAttr('style');
				$('#suggests').removeAttr('style');
				$('#srcResult').removeAttr('style');
				$('#inputLatLon').removeAttr('style');
				$('#route').removeAttr('style');
				$('#delGeom').removeAttr('style');
				//$('.ldmap_placeholder').removeAttr('style');
				$('#route').css({'display':'none'});
			}else{
				$('#home').removeAttr('style');
			}
			isfullscreen=false;
		}
	});
	if(mapeditable===true){
		
		map.Event.bind('overlayChange', function(event) {
			var obj = event;
			isarrMarker = false;
			console.log(event);
			//console.log('event active = '+event.active());
			curpoiname = '';
			if (event.active()) {
				if ($(".ldmap_popup_detail").css("visibility") === "visible") {
					//console.log('ldmap_popup_detail visibility');
					$('.ldmap_poi_menu').html('');
					var parent = $(".ldmap_popup_detail").parent();
					//console.log('pinMap len = '+parent.find('div.pinMap').length);
					if (parent.find('div.pinMap').length == 0) {
						currentMarker = event.marker.toString().trim();
						if(currentMarker==marker1){   
							isarrMarker = true; 
						}
						if (isarrMarker == true) {
							if(mapeditable==true){
								parent.append('<div class="pinMap"><input type="button" onclick="removeMarker(\'' + currentMarker + '\');" class="del" title="ลบ"></div>');
							}
							isarrMarker = false;

						} else {
							parent.append('<div class="pinMap"><input type="button" onclick="clearSearch(); markOverlay(' + event.marker.location().lon + ',' + event.marker.location().lat + ');" class="addPIN" title="ปักหมุด"></div>');
						}

					}
					curpoiname = $("div.ldmap_popup_title").text();
					console.log("poiname  = "+curpoiname);
				}
				doGeoSave();
			}
			if(map.Route.size()==0){
				$('#route').css({'display':'none'});
			}
		});
		
		map.Route.placeholder(document.getElementById('route'));
		map.Route.enableContextMenu();
		map.Route.auto(true);
		
		map.Event.bind('guideComplete', function(event){
			if(isfullscreen===true){
				$('#route').removeAttr('style');
				$('#route').css({'top': '0px','left':'0px','position':'fixed'});
			}else{
				$('#route').removeAttr('style');
			}
		});

		map.Event.bind('beforeContextmenu', function(event) {
		  var element = document.createElement('div');
		  element.innerHTML = '<a onclick="markOverlay(' + event.location.lon + ',' + event.location.lat + ');">ปักหมุด</a>';
		  element.style.cursor = 'pointer';
		  event.add(element);
		});
	}
}

function resize() {
	var style = document.getElementById('map').style
	style.height = '420px';
    style.width = '800px';
}

function suggestClick(index) {
	console.log('suggestClick');
  $('#srcKey').val(suggestList[index]);
  map.Search.search(suggestList[index]);
  document.getElementById("suggests").style.visibility = "hidden";
  document.getElementById("srcResult").style.visibility = "visible";
}

function clearSearch(){
	console.log('clearSearch');
	$('#srcKey').val('');
	$('#suggests').html('');		
	map.Search.search('');
	document.getElementById("srcResult").style.visibility = "hidden";
	document.getElementById("suggests").style.visibility = "hidden";
}

function markOverlay(lon, lat) {
	if(mapeditable==false){
		return;
	}
	var loc;
	if (lon) {
		loc = {
		  lon: lon,
		  lat: lat
		};
	  } else {
		loc = map.location();
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
				map.Ui.ContextMenu.visible(false);
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
					//console.log('lon='+loc.lon);
					//console.log('lat='+loc.lat);
					MXobject.set(MXlongitude,loc.lon);
					MXobject.set(MXlatitude,loc.lat);
					MXobject.set(MXstartLon,loc.lon);
					MXobject.set(MXstartLat,loc.lat);
					MXobject.set(MXzoomlevel,map.zoom());
					//if(curpoiname.length>0){}
					MXobject.set(MXplacename,curpoiname);
					//console.log('drag to lat='+loc.lat+' lon='+loc.lon)
					
					$("input[name=\""+MXobject.getEntity()+'/'+MXlongitude+"\"]").val(loc.lon);
					$("input[name=\""+MXobject.getEntity()+'/'+MXlatitude+"\"]").val(loc.lat);
					$("input[name=\""+MXobject.getEntity()+'/'+MXstartLon+"\"]").val(loc.lon);
					$("input[name=\""+MXobject.getEntity()+'/'+MXstartLat+"\"]").val(loc.lat);
					$("input[name=\""+MXobject.getEntity()+'/'+MXzoomlevel+"\"]").val(map.zoom());
					$("input[name=\""+MXobject.getEntity()+'/'+MXplacename+"\"]").val(curpoiname);
				}
			}
		}else{
			console.log('get undefined value');
		}
		map.Search.address(loc);
		map.Ui.ContextMenu.visible(false);
}

function removeMarker(markerName) {
	if(mapeditable==false){
		return;
	}
		map.Overlays.remove(marker1);
		MXobject.set(MXlongitude,0);
		$("input[name=\""+MXobject.getEntity()+'/'+MXlongitude+"\"]").val('');
		MXobject.set(MXlatitude,0);
		$("input[name=\""+MXobject.getEntity()+'/'+MXlatitude+"\"]").val('');
		//MXobject.set(MXstartLon,loc.lon);
		//MXobject.set(MXstartLat,loc.lat);
		//MXobject.set(MXzoomlevel,map.zoom());
		MXobject.set(MXroad,'');
		$("input[name=\""+MXobject.getEntity()+'/'+MXroad+"\"]").val('');
		MXobject.set(MXtambol,'');
		$("input[name=\""+MXobject.getEntity()+'/'+MXtambol+"\"]").val('');
		MXobject.set(MXamphur,'');
		$("input[name=\""+MXobject.getEntity()+'/'+MXamphur+"\"]").val('');
		MXobject.set(MXprovince,'');
		$("input[name=\""+MXobject.getEntity()+'/'+MXprovince+"\"]").val('');
		MXobject.set(MXzipcode,'');
		$("input[name=\""+MXobject.getEntity()+'/'+MXzipcode+"\"]").val('');
		MXobject.set(MXplacename,'');
		$("input[name=\""+MXobject.getEntity()+'/'+MXplacename+"\"]").val('');

}

	function doGeoSave(){
		if(mapeditable==false){
			return;
		}
		txtall = '{"geolist":[';
		geoindex = 0;
		for(i=0;i<map.Overlays.size();i++){
			loc = map.Overlays.list()[i].location();
			overlaytype = map.Overlays.list()[i].toString();
			if((loc.length>1)&&(loc.length<=100)){// Line and Polygon Only // less than 100 points 
				txt = '"location":[';
				//console.log(overlaytype);
				firstlat=-1;
				firstlon=-1;
				lastlat=-1;
				lastlon=-1;
				for(j=0;j<loc.length;j++){
					//console.log(loc[j]);
					point = loc[j];
					if(j==0){
						firstlat=point.lat;
						firstlon=point.lon;
						txt = txt + '{"lat":'+point.lat+',"lon":'+point.lon+'}';
					}else{
						lastlat=point.lat;
						lastlon=point.lon;
						txt = txt + ',{"lat":'+point.lat+',"lon":'+point.lon+'}';
					}
				}
				txt = txt + ']';
				if(firstlat==lastlat && firstlon==lastlon){
					txt='{"geotype":"polygon",'+txt+'}';
					//console.log(map.Overlays.list()[i]);
					map.Overlays.list()[i].update({weight: longdo.OverlayWeight.Top});
					
				}else{
					txt='{"geotype":"line",'+txt+'}';
					//console.log(map.Overlays.list()[i]);
					map.Overlays.list()[i].update({weight: longdo.OverlayWeight.Top});
				}
				if(geoindex==0){
					txtall=txtall+txt;
				}else{
					txtall=txtall+','+txt;
				}
				geoindex++;
			}
		}
		txtall = txtall+']}';
		if(geoindex==0){
			console.log('geo not found');
			MXobject.set(MXgeodata,'');
		}else{
			console.log(txtall);
			var obj = JSON.parse(txtall);
			console.log(obj.geolist.length);
			MXobject.set(MXgeodata,txtall);
		}
	}