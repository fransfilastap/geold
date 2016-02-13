
$(function(){
       //xhr.setRequestHeader(header, token); 

	var isFrameOpen = false;
        var currentTab = null;
        var currentCells = [];
        var currentPage = "UMTS";
        
        var lineChartColors = ["#00d2ff","#00da1c","#9b59b6","#f1c40f","#e67e22","#2c3e50"];
        var lineChartBaseLine = [ "#f20000","#ff7109" ];
        
        var currentKQISelected = "";
        var currentKQINe = "";
        
        var groupNow = "Golden Site";
        
        var newsAlarmTable = $("#zzz");

        var pageBrowsingSuccessRateValue = $("#kqi_bsr");
        var pageBrowsingSuccessRateIndicator = $("#bsr_indicator");
        var pageBrowsingDelayValue = $("#kqi_bd");
        var pageBrowsingDelayIndicator = $("#bd_indicator");
        var videoStreamingStartSuccessRateValue = $("#kqi_ssr");;
        var videoStreamingStartSuccessRateIndicator = $("#ssr_indicator");
        var videoStreamingStartDelayValue = $("#kqi_ssd");;
        var videoStreamingStartDelayIndicator = $("#ssd_indicator");
        
        var _2gRanCallSetUpSuccessRateSpeech = $("#2gRanCall");
        var _2gCallMinutesBetweenDrop = $("#2gCallMinutes");
        var _3gRanCallSetUpSuccessRateSpeech = $("#3gRanCall");
        var _3gRanPSAccessibility = $("#3gRanPS");
        var _3gCallMinutesBetweenDrop = $("#3gCallMinutes");
        var _3gMinutesPSAbnormalReleases = $("#3gMinutesPS");
        var _4gEstablishmentSuccessRate = $("#4GEstablishment");
        var _4gMinutesBetweenERABAbnormal = $("#4gMinutesERAB");
        
        var _2gRanCallSetUpSuccessRateSpeechIndicator = $("#2gRanCallIndicator");
        var _2gCallMinutesBetweenDropIndicator = $("#2gCallMinutesIndicator");
        var _3gRanCallSetUpSuccessRateSpeechIndicator = $("#3gRanCallIndicator");
        var _3gRanPSAccessibilityIndicator = $("#3gRanPSIndicator");
        var _3gCallMinutesBetweenDropIndicator = $("#3gCallMinutesIndicator");
        var _3gMinutesPSAbnormalReleasesIndicator = $("#3gMinutesPSIndicator");
        var _4gEstablishmentSuccessRateIndicator = $("#4GEstablishmentIndicator");
        var _4gMinutesBetweenERABAbnormalIndicator = $("#4gMinutesERABIndicator");

        
        var kqiAspects = {
            pbsr : "Page Browsing Success Rate",
            pbd : "Page Browsing Delay",
            vsssr : "Video Streaming Start Success Rate",
            vssd : "Video Streaming Start Delay"
        };
        
        var kpiAspectsx = {
            rcsur2g : "2G RAN Call Set Up Success Rate, Speech",
            cmbtd2g : "2G Call Minutes between Drop",
            rcsur3g : "3G RAN Call Set Up Success Rate, Speech",
            ranpsacc3g : "3G RAN PS Accessibility",
            cmbd3g : "3G Call Minutes between Drop",
            mbps3g : "3G Minutes between PS Abnormal Releases",
            esr4g : "4G Establishment Success Rate",
            erab4g : "4G Minutes between E-RAB abnormal releases"
        };
        
        //intervals
        var goldenSiteInterval;
        var lteLogicalInterval;
        var gsmLogicalInterval;
        var umtsLogicalInterval;
        
        var kpiGaugeInterval;
        var alarmDetailInterval;
        var sectorKqiChartInterval;
        var sectorKpiChartInterval;

	var alarmColor = {
            critical            : "#f21414",
            major 		: "#ff8b24",
            minor 		: "#f1c40f", 	
            normal               : "#2ecc71"
	};

	var elements = {
            news : $("#news-frame"),
            newsAlarmDetail : $("#alarm-detail"),
            newsKPIDetail : $("#kpi-detail"),
            newsKQIDetail : $("#kqi-detail"),
            logicalSiteDetail : $("#logical")
	};
        
        var kpiAspects = {
            GSM : [
                {
                    title : "CS Trafic",
                    id    : "cs"
                },
                {
                    title : "PS Trafic",
                    id    : "ps"
                },
                {
                    title : "2G Call Minutes between Drop",
                    id    : "2gcmbd"
                },   
                {
                    title : "2G RAN Call Setup Success Rate",
                    id    : "2grcssr"
                }               
            ],
            UMTS : [
                {
                    title : "CS Trafic",
                    id    : "cs"
                },
                {
                    title : "PS Trafic",
                    id    : "ps"
                },
                {
                    title : "3G RAN Call Set Up Success Rate",
                    id    : "3grcsusr"
                },   
                {
                    title : "3G RAN PS Accessibility",
                    id    : "3grpa"
                },   
                {
                    title : "3G Call Minutes between Drop",
                    id    : "3gcmbd"
                }, 
                {
                    title : "3G Minutes between PS Abnormal Releases",
                    id    : "3gmbpar"
                }                  
            ],
            LTE : [
                {
                    title : "PS Trafic",
                    id    : "ps"
                },
                {
                    title : "4G Establishment Success Rate",
                    id    : "4gesr"
                },   
                {
                    title : "4G Minutes between E-RAB abnormal releases",
                    id    : "4gmbear"
                }                
            ]
        };

        var map;
        var markers = [];

        var icons = {
            normal : "assets/img/g-normal.png",
            minor : "assets/img/g-minor.png",
            major : "assets/img/g-major.png",
            critical : "assets/img/g-critical.png"
        };

        var urls = {
            golden : "goldensites",
            gsm : "cells/gsm",
            umts : "cells/umts",
            lte : "cells/lte"
        };
    
	var events = {
            alarm : function( siteId ){
                changeContent( elements.news , elements.newsAlarmDetail );
                var alarmTable = $("table#alarmlisttable > tbody");
                alarmTable.html("");
                $.ajax({
                   url : "sitealarm/detail/"+siteId,
                   method : "GET",
                   contentType: 'application/json',
                   dataType : "JSON",
                   success : function( response ){
                       if( response !== undefined ){
                           
                           $.each( response , function(i,v){
                               var date = new Date( v.lastOccurence );
                                var row = "<tr>"+
                                            "<td>"+v.siteId+"</td>"+    
                                            "<td>"+v.siteName+"</td>"+    
                                            "<td>"+v.severity+"</td>"+
                                            "<td>"+v.nodeAlias+"</td>"+
                                            "<td>"+v.alarmName+"</td>"+
                                            "<td>"+date+"</td>"+
                                            "<td>"+v.ticketId+"</td>"+
                                            "<td>"+v.summary+"</td>"+
                                        "</tr>";
                                
                                alarmTable.append( row );
                           });
                       }
                       else{
                           alert( "response data format error" );
                       }
                   }
                });
                
                $.ajax({
                   url : "sitealarm/summary/"+siteId,
                   method : "GET",
                   contentType: 'application/json',
                   dataType : "JSON",
                   success : function( response ){
                       if( response !== undefined ){
                            var chartData = [{
                                title: "Critical",
                                value: response.critical,
                                color: alarmColor.critical
                              }, {
                                title: "Major",
                                value: response.major,
                                color: alarmColor.major
                              }, {
                                title: "Minor",
                                value: response.minor,
                                color: alarmColor.minor
                            }];
                            
                            formatAlarmFrame( chartData );
                       }
                   }
                });
              
            },
            kpi : function(){
                changeContent( elements.news , elements.newsKPIDetail );
                //drawLineChart("#container");
            },
            kqi : function(){
                changeContent( elements.news , elements.newsKQIDetail );
                $("h3#kqi_group_tendency_chart").html( groupNow );
                $.ajax({
                    url : "news/kqi",
                    method : "GET",
                    dataType : "json",
                    contentType : "application/json",
                    success : function( response ){
                        
                        if( response !== undefined ){
                            var videoStreamingSuccessRate = response.videoStreamingKQI.videoStreamingSuccessRate;
                            var videoStreamingStartDelay = response.videoStreamingKQI.videoStreamingStartDelay;
                            var pageBrowsingSuccessRate = response.pageBrowsingKQI.pageBrowsingSuccessRate;
                            var pageBrowsingDelay = response.pageBrowsingKQI.pageBrowsingDelay;

                            //push them zzz
                            $("#vssd1").html( videoStreamingStartDelay + " ms");
                            $("#vssr1").html( videoStreamingSuccessRate + " %" );
                            $("#pbd1").html( pageBrowsingDelay + " ms" );
                            $("#pbsr1").html( pageBrowsingSuccessRate + " %" );

                        }
                        else{
                            alert("error while parsing kqi data from server");
                        }

                    }
                });                
                
                drawLineChart("#container2");
            },
            kqiKey : function( key ){
                
                var aspect = "";
                var ne = ( currentKQINe == "" ? "AccessType_2G" : currentKQINe );//AccessType_2G, AccessType_3G,AccessType_4G
                
                if( key === "pbsr" ){
                    aspect = kqiAspects.pbsr;
                }else if( key === "pbd" ){
                    aspect = kqiAspects.pbd;
                }else if( key === "vsssr" ){
                    aspect = kqiAspects.vsssr;
                }else if( key === "vssd" ){
                    aspect = kqiAspects.vssd;
                }else{
                    aspect = "Undefined";
                }
                
                currentKQISelected = key;
                
                getKQITopWorstCells(key,ne,function(response){
                    $("#worst_cell_kqi > tbody").html("");
                    $.each(response,function(i,v){
                        var row = "<tr>"+
                                    "<td><a href='#' class='frame-link' data-type='kqi-cell' data-kqi='"+currentKQISelected+"' data-cell='"+v.cellName+"'>"+( v.cellName == null ? "CELL UNDEFINED" : v.cellName )+"</a></td>"+
                                    "<td>"+v.value+"</td>"+
                                "</tr>";
                        $("#worst_cell_kqi > tbody").append( row );  
                    }); 
                });
                
                
                $("#kqi_group_legend").html( aspect );
                
            },
            kpiKey : function( key ){
                
                var aspect = "";
                var postfix = "";
                var realKey = "";
  
                if( key === "rcsur2g" ){
                    aspect = kpiAspectsx.rcsur2g;
                    postfix = " %";
                    realKey = "RAN_CALL_SETUP_SUCCESS_RATE_2G";
                }else if( key === "cmbtd2g" ){
                    aspect = kpiAspectsx.cmbtd2g;
                    realKey = "CALL_MINUTES_BETWEEN_DROP_2G";
                }else if( key === "rcsur3g" ){
                    aspect = kpiAspectsx.rcsur3g;
                    postfix = " %";
                    realKey = "RAN_CALL_SETUP_SUCCESS_RATE_3G";
                }else if( key === "ranpsacc3g" ){
                    aspect = kpiAspectsx.ranpsacc3g;
                    postfix = " %";
                    realKey = "RAN_PS_ACCESSIBILITY_3G";
                }else if( key === "cmbd3g" ){
                    aspect = kpiAspectsx.cmbd3g;
                    realKey = "CALL_MINUTES_BETWEEN_DROP_3G";
                }else if( key === "mbps3g" ){
                    aspect = kpiAspectsx.mbps3g;
                    realKey = "MINUTES_BETWEEN_PS_ABNORMAL_RELEASES_3G";
                }
                else if( key === "esr4g" ){
                    aspect = kpiAspectsx.esr4g;
                    postfix = " %";
                    realKey = "ESTABLISHMENT_SUCCESS_RATE_4G";
                }
                else if( key === "4gmbear" ){
                    aspect = kpiAspectsx.erab4g;
                    realKey = "MINUTES_BETWEEN_ERAB_ABNORMAL_RELEASES_4G";
                }
                else{
                    aspect = "Undefined";
                }
                
                $.ajax({
                    url : "news/kpi/"+key,
                    method : "GET",
                    dataType : "JSON",
                    success: function( response ){
                        $("#kpi-worst-cells > tbody").html("");
                        $.each(response,function(i,v){
                            var row = "<tr>"+
                                        "<td><a href='#' class='frame-link' data-type='celltdc' data-kpi='"+realKey+"' data-cell='"+v.cellName+"'>"+v.cellName+"</a></td>"+
                                        "<td>"+v.value+" "+postfix+"</td>"+
                                    "</tr>";
                            $("#kpi-worst-cells > tbody").append( row );  
                        });
                    }
                });
                
                
                $("#kpi_group_legend").html( aspect );
                
            },   
            kpiCell : function( cell,type ){
                    loadKPITendecyChartData([cell],type,function(chartData,type){
                        
                    $("#kpicellname").html(cell);
                    var suffix = getSuffix(type);
                    var chartOptions = {
                        title:{
                            text:''
                        },
                        legend : {
                          enabled: false  
                        },
                        tooltip: {
                            animation : true,
                            backgroundColor : "rgba(26,89,145,1)",
                            borderColor: "#154c7d",
                            style : {
                                color: '#fff',
                                fontSize: '12px',
                                padding: '8px'
                            },
                            valueSuffix : suffix
                        },
                        chart : {
                            backgroundColor: '#05112c',
                                style: {
                                color: "#14295d"
                            }
                        },
                        credits: {
                            enabled: false
                        },
                        exporting: {
                            enabled: false
                        },
                        xAxis: {
                            lineColor: '#14295d',
                            tickColor: '#14295d',
                            minorGridLineColor: '#14295d',
                            labels: {
                                style: {
                                    color: '#14295d',
                                    fontSize : "10px"
                                }
                            },
                            gridLineColor: "#142143",
                            type: 'datetime',
                            dateTimeLabelFormats: { // don't display the dummy year
                                month: '%e. %b',
                                year: '%b'
                            },
                            title: {
                                text: ''
                            },
                            ordinal: false
                        },
                        yAxis: {
                            title: {
                                    text: null
                            },
                            plotLines: [{
                                    value: 0,
                                    width: 1,
                                    color: '#14295d'
                            }],
                            labels: {
                                style: {
                                    color: '#14295d',
                                    fontSize : "10px"
                                }
                            },
                            lineColor: '#14295d',
                            lineWidth: 1,
                            tickWidth: 1,
                            tickColor: '#14295d',
                            minorGridLineColor: '#14295d',
                            gridLineColor: "#142143",
                            min : 0 ,
                            tickInterval: 10,
                        },
                        series: []
                    };


                    $.each(chartData.series,function(index,value){
                        var template = {
                            name: '',
                            data: [],
                            lineWidth : 0.75,
                            color : "#00d2ff",
                            type : "area",
                            fillColor: {
                               linearGradient: [0, 0, 0, 170],
                                stops: [
                                    [0, "#00d2ff"],
                                    [1, "rgba(2,0,0,0)"]
                                ]
                            }
                        };                        
                        template.name = value.name;
                        template.color = lineChartColors[index];
                        template.fillColor.stops = {
                               linearGradient: [0, 0, 0, 170],
                                stops: [
                                    [0, "#00d2ff"],
                                    [1, "rgba(2,0,0,0)"]
                                ]                            
                        }
                        var dt= value.data;
                        $.each( dt, function(i,v){
                            var sd = [ v.timestamp , v.value ];
                            template.data.push( sd );
                        });

                        chartOptions.series.push( template );
                    });
                    
                    //baseLine 
                        $.each(chartData.baseLines,function(index,value){
                            var template = {
                                name: '',
                                data: [],
                                lineWidth : 1,
                                color : "#00d2ff",
                                type : "area",
                                fillColor: {
                                   linearGradient: [0, 0, 0, 170],
                                    stops: [
                                        [0, "#00d2ff"],
                                        [1, "rgba(2,0,0,0)"]
                                    ]
                                }
                            };                        
                            template.name = value.name;
                            template.color = lineChartBaseLine[index];
                            template.fillColor.stops = {
                                   linearGradient: [0, 0, 0, 170],
                                    stops: [
                                        [0, "#00d2ff"],
                                        [1, "rgba(2,0,0,0)"]
                                    ]                            
                            }
                            var dt= value.data;
                            $.each( dt, function(i,v){
                                var sd = [ v.timestamp , v.value ];
                                template.data.push( sd );
                            });

                            chartOptions.series.push( template );
                        });

                    $("#container").highcharts(chartOptions);	
                        
                    });
            },
            kqiCell : function(cells,type){
                var realType = "";
                switch(type){
                    case "pbsr": 
                        realType = "PAGE_BROWSING_SUCCESS_RATE";
                        break;
                    case "pbd": 
                        realType = "PAGE_BROWSING_DELAY";
                        break;
                    case "vsssr": 
                        realType = "VIDEO_STREAMING_START_SUCCESS_RATE";
                        break;
                    case "vssd": 
                        realType = "VIDEO_STREAMING_START_DELAY";
                        break;
                    default :
                        break;
                }
                
                loadKQITendecyChartData( [cells], realType ,function(response,type){
                    var chartOptions = {
                            title:{
                                text:''
                            },
                            legend : {
                              enabled: false  
                            },
                            tooltip: {
                                animation : true,
                                backgroundColor : "rgba(26,89,145,1)",
                                borderColor: "#154c7d",
                                style : {
                                    color: '#fff',
                                    fontSize: '12px',
                                    padding: '8px'
                                }
                            },
                            chart : {
                                backgroundColor: '#05112c',
                                    style: {
                                    color: "#14295d"
                                }
                            },
                            credits: {
                                enabled: false
                            },
                            exporting: {
                                enabled: false
                            },
                            xAxis: {
                                lineColor: '#14295d',
                                tickColor: '#14295d',
                                minorGridLineColor: '#14295d',
                                labels: {
                                    style: {
                                        color: '#14295d',
                                        fontSize : "10px"
                                    }
                                },
                                gridLineColor: "#142143",
                                type: 'datetime',
                                dateTimeLabelFormats: { // don't display the dummy year
                                    month: '%e. %b',
                                    year: '%b'
                                },
                                title: {
                                    text: ''
                                },
                                ordinal: false
                            },
                            yAxis: {
                                title: {
                                        text: null
                                },
                                plotLines: [{
                                        value: 0,
                                        width: 1,
                                        color: '#14295d'
                                }],
                                labels: {
                                    style: {
                                        color: '#14295d',
                                        fontSize : "10px"
                                    }
                                },
                                lineColor: '#14295d',
                                lineWidth: 1,
                                tickWidth: 1,
                                tickColor: '#14295d',
                                minorGridLineColor: '#14295d',
                                gridLineColor: "#142143",
                                min : 0 ,
                                tickInterval: 10,
                            },
                            series: []
                        };


                        $.each(response.series,function(index,value){
                            var template = {
                                name: '',
                                data: [],
                                lineWidth : 1,
                                color : "#00d2ff",
                                type : "area",
                                fillColor: {
                                   linearGradient: [0, 0, 0, 170],
                                    stops: [
                                        [0, "#00d2ff"],
                                        [1, "rgba(2,0,0,0)"]
                                    ]
                                }
                            };                        
                            template.name = value.name;
                            template.color = lineChartColors[index];
                            template.fillColor.stops = {
                                   linearGradient: [0, 0, 0, 170],
                                    stops: [
                                        [0, "#00d2ff"],
                                        [1, "rgba(2,0,0,0)"]
                                    ]                            
                            }
                            var dt= value.data;
                            $.each( dt, function(i,v){
                                var sd = [ v.timestamp , v.value ];
                                template.data.push( sd );
                            });

                            chartOptions.series.push( template );
                        }); 

                        //baseLine 
                        $.each(response.baseLines,function(index,value){
                            var template = {
                                name: '',
                                data: [],
                                lineWidth : 1,
                                color : "#00d2ff",
                                type : "area",
                                fillColor: {
                                   linearGradient: [0, 0, 0, 170],
                                    stops: [
                                        [0, "#00d2ff"],
                                        [1, "rgba(2,0,0,0)"]
                                    ]
                                }
                            };                        
                            template.name = value.name;
                            template.color = lineChartBaseLine[index];
                            template.fillColor.stops = {
                                   linearGradient: [0, 0, 0, 170],
                                    stops: [
                                        [0, "#00d2ff"],
                                        [1, "rgba(2,0,0,0)"]
                                    ]                            
                            }
                            var dt= value.data;
                            $.each( dt, function(i,v){
                                var sd = [ v.timestamp , v.value ];
                                template.data.push( sd );
                            });

                            chartOptions.series.push( template );
                        });

                        $("#kqichart1").highcharts( chartOptions );
                });
            },
            logical : function(){
                console.log("current ==> "+currentElementOnFrame.html());
                changeContent( currentElementOnFrame , elements.logicalSiteDetail );
                var smooth = function(){
                    slideFrameUp();
                    rearrangeFrameHeight(50);
                }
                
                setTimeout(smooth,300);
            }
	};
	
	var previousElementFrame   = elements.news;
	var currentElementOnFrame  = elements.news;
        
        var goldenSiteButton = $("a#golden");
        var eventSiteButton  = $("a#event");
        var gsmButton        = $("a#gsm");
        var umtsButton       = $("a#umts");
        var lteButton        = $("a#lte");
        
        var activeButton = goldenSiteButton;
        
        var sectorIcon = {
            path: 'm0.5,0.5l53,30.2857c-11.4313,19.8149 -30.0151,27.7095 -53,30.2858l0,-60.5715z',
            fillColor: alarmColor.minor, // default is minor color
            fillOpacity: 0.8,
            scale: 1,
            strokeColor: 'white',
            strokeWeight: 1,
            rotation: -30            
        };
        
       /*
        var newsAlarmSocket      = new SockJS("/data");
        var newsAlarmStompClient = Stomp.over( newsAlarmSocket );
            newsAlarmStompClient.connect({},function(fr){
                newsAlarmStompClient.subscribe('/monitoring/newsalarm', function(alarm){
                    console.log(alarm);
                }); 
            });
       */

	function init(){
            
            createGMapElem();
            initClickFrameToggleEvent();
            
            activeButton.addClass( "mbtnactive" );
            
            goldenSiteButton.click(function(evt){
                evt.preventDefault();
                groupNow = "Golden Site";

                clearInterval( umtsLogicalInterval );
                clearInterval( lteLogicalInterval );
                clearInterval( gsmLogicalInterval );
                
                umtsLogicalInterval = 0;
                lteLogicalInterval = 0;
                umtsLogicalInterval = 0;
                
                goldenSiteInterval = setInterval(loadGoldenSiteSilent,60000);
                
                if( isFrameOpen ){ 
                    slideFrameDown();
                    setTimeout(loadGoldenSite,300);
                }else{
                    loadGoldenSite();
                }
                $(this).toggleClass("mbtnactive");
                currentPage = $(this).data("page");
                changeContent( previousElementFrame,elements.news );
            });
            
            gsmButton.click(function(evt){
                evt.preventDefault();
                
                clearInterval( goldenSiteInterval );
                clearInterval( lteLogicalInterval );
                clearInterval( umtsLogicalInterval );
                
                goldenSiteInterval = 0;
                lteLogicalInterval = 0;
                umtsLogicalInterval = 0;
                
                gsmLogicalInterval = setInterval(loadGSMCellSilent,60000);
                
                currentPage = $(this).data("page");
                if( isFrameOpen ) {
                    slideFrameDown();
                    setTimeout(loadGSMCell,500);
                }else{
                    loadGSMCell();
                }
                $(".mbtn").removeClass("mbtnactive");
                $(this).addClass("mbtnactive");
                
            });
            
            umtsButton.click(function(evt){
                evt.preventDefault();

                clearInterval( goldenSiteInterval );
                clearInterval( lteLogicalInterval );
                clearInterval( gsmLogicalInterval );
                
                goldenSiteInterval = 0;
                lteLogicalInterval = 0;
                umtsLogicalInterval = 0;
                
                umtsLogicalInterval = setInterval(loadUMTSCellSilent,60000);

                currentPage = $(this).data("page");
                if( isFrameOpen ){ 
                    slideFrameDown();
                    setTimeout(loadUMTSCell,300);
                }else{
                    loadUMTSCell();
                };
                $(".mbtn").removeClass("mbtnactive");
                $(this).addClass("mbtnactive");
                
            });
            
            lteButton.click(function(evt){
               evt.preventDefault();
               
                clearInterval( goldenSiteInterval );
                clearInterval( gsmLogicalInterval );
                clearInterval( umtsLogicalInterval );
                
                goldenSiteInterval = 0;
                gsmLogicalInterval = 0;
                umtsLogicalInterval = 0;
                
                lteLogicalInterval = setInterval(loadLTECellSilent,60000);
                
               currentPage = $(this).data("page");
               if( isFrameOpen ) {
                   slideFrameDown();
                   setTimeout(loadLTECell,300);
               }
               else{
                   loadLTECell();
               }
               $(".mbtn").removeClass("mbtnactive");
               $(this).addClass("mbtnactive");
            });
            
            drawLineChart();
            
            $(".scrollable").perfectScrollbar();
            gaugeIt("#gauge1");
            gaugeIt("#gauge2");
            gaugeIt("#gauge3");
            gaugeIt("#gauge4");
            
            
            $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
                var target = $(e.target).attr("href") // activated tab

                var rearrange = function(){
                    rearrangeFrameHeight(50);
                };
                
                if( target !== currentTab ){
                        currentTab = target;
                        if( target === "#kqix" ){
                            var innerLoad = function(){
                                    loadSectorKQITendencyChart(currentCells,function(chartData){

                                        var innerKQIChartDrawer = function( data , container ){
                                            var chartOptions = {
                                                    title:{
                                                        text:''
                                                    },
                                                    legend : {
                                                      enabled: false  
                                                    },
                                                    tooltip: {
                                                        animation : true,
                                                        backgroundColor : "rgba(26,89,145,1)",
                                                        borderColor: "#154c7d",
                                                        style : {
                                                            color: '#fff',
                                                            fontSize: '12px',
                                                            padding: '8px'
                                                        }
                                                    },
                                                    chart : {
                                                        backgroundColor: '#05112c',
                                                            style: {
                                                            color: "#14295d"
                                                        }
                                                    },
                                                    credits: {
                                                        enabled: false
                                                    },
                                                    exporting: {
                                                        enabled: false
                                                    },
                                                    xAxis: {
                                                        lineColor: '#14295d',
                                                        tickColor: '#14295d',
                                                        minorGridLineColor: '#14295d',
                                                        labels: {
                                                            style: {
                                                                color: '#14295d',
                                                                fontSize : "10px"
                                                            }
                                                        },
                                                        gridLineColor: "#142143",
                                                        type: 'datetime',
                                                        dateTimeLabelFormats: { // don't display the dummy year
                                                            month: '%e. %b',
                                                            year: '%b'
                                                        },
                                                        title: {
                                                            text: ''
                                                        },
                                                        ordinal: false
                                                    },
                                                    yAxis: {
                                                        title: {
                                                                text: null
                                                        },
                                                        plotLines: [{
                                                                value: 0,
                                                                width: 1,
                                                                color: '#14295d'
                                                        }],
                                                        labels: {
                                                            style: {
                                                                color: '#14295d',
                                                                fontSize : "10px"
                                                            }
                                                        },
                                                        lineColor: '#14295d',
                                                        lineWidth: 1,
                                                        tickWidth: 1,
                                                        tickColor: '#14295d',
                                                        minorGridLineColor: '#14295d',
                                                        gridLineColor: "#142143",
                                                        min : 0 ,
                                                        tickInterval: 10,
                                                    },
                                                    series: []
                                                };


                                                $.each(data.series,function(index,value){
                                                    var template = {
                                                        name: '',
                                                        data: [],
                                                        lineWidth : 1,
                                                        color : "#00d2ff",
                                                        type : "area",
                                                        fillColor: {
                                                           linearGradient: [0, 0, 0, 170],
                                                            stops: [
                                                                [0, "#00d2ff"],
                                                                [1, "rgba(2,0,0,0)"]
                                                            ]
                                                        }
                                                    };                        
                                                    template.name = value.name;
                                                    template.color = lineChartColors[index];
                                                    template.fillColor.stops = {
                                                           linearGradient: [0, 0, 0, 170],
                                                            stops: [
                                                                [0, "#00d2ff"],
                                                                [1, "rgba(2,0,0,0)"]
                                                            ]                            
                                                    }
                                                    var dt= value.data;
                                                    $.each( dt, function(i,v){
                                                        var sd = [ v.timestamp , v.value ];
                                                        template.data.push( sd );
                                                    });

                                                    chartOptions.series.push( template );
                                                }); 
                                                
                                                //baseLine 
                                                $.each(data.baseLines,function(index,value){
                                                    var template = {
                                                        name: '',
                                                        data: [],
                                                        lineWidth : 1,
                                                        color : "#00d2ff",
                                                        type : "area",
                                                        fillColor: {
                                                           linearGradient: [0, 0, 0, 170],
                                                            stops: [
                                                                [0, "#00d2ff"],
                                                                [1, "rgba(2,0,0,0)"]
                                                            ]
                                                        }
                                                    };                        
                                                    template.name = value.name;
                                                    template.color = lineChartBaseLine[index];
                                                    template.fillColor.stops = {
                                                           linearGradient: [0, 0, 0, 170],
                                                            stops: [
                                                                [0, "#00d2ff"],
                                                                [1, "rgba(2,0,0,0)"]
                                                            ]                            
                                                    }
                                                    var dt= value.data;
                                                    $.each( dt, function(i,v){
                                                        var sd = [ v.timestamp , v.value ];
                                                        template.data.push( sd );
                                                    });

                                                    chartOptions.series.push( template );
                                                });
                                                $(container).highcharts( chartOptions );
                                        }

                                        innerKQIChartDrawer( chartData.PAGE_BROWSING_SUCCESS_RATE, "#kqi1" );
                                        innerKQIChartDrawer( chartData.PAGE_BROWSING_DELAY, "#kqi2" );
                                        innerKQIChartDrawer( chartData.VIDEO_STREAMING_START_SUCCESS_RATE, "#kqi3" );
                                        innerKQIChartDrawer( chartData.VIDEO_STREAMING_START_DELAY, "#kqi4" );

                                    });                                
                            }
                            rearrange();
                            setTimeout(innerLoad,300);
                            
                        }else if( target === "#kpix" ){
                            if( currentPage === "GSM" ){
                                
                                var container = $(".carousel-list");
                                container.html("");

                                var cs = '<li><a href="#" class="kpi-item" data-type="CS_TRAFFIC_2G" data-id="cs">'+
                                    '<div class="panel panel-primary mpanel-child">'+                                                                                
                                      '<div class="panel-heading" style="text-align:center">'+
                                          '<h3 class="panel-title">CS Traffic</h3>'+
                                      '</div>'+
                                        '<div class="panel-body">'+
                                            '<div class="gauge" data-type="CS_TRAFFIC_2G" data-id="cs" id="cs" style="min-width: 255px; max-width:400px; height: 180px; margin: 0 auto"></div>'+
                                        '</div>'+
                                    '</div>'+
                                    '</a></li>';
                                
                                var ps = '<li><a href="#" class="kpi-item" data-type="PS_TRAFFIC_2G" data-id="ps">'+
                                    '<div class="panel panel-primary mpanel-child">'+                                                                                
                                      '<div class="panel-heading" style="text-align:center">'+
                                          '<h3 class="panel-title">PS Traffic</h3>'+
                                      '</div>'+
                                        '<div class="panel-body">'+
                                            '<div class="gauge" id="ps" data-type="PS_TRAFFIC_2G" data-id="ps" style="min-width: 255px; max-width:400px; height: 180px; margin: 0 auto"></div>'+
                                        '</div>'+
                                    '</div>'+
                                    '</a></li>';
                            
                                var _2gcmbd = '<li><a href="#" class="kpi-item" data-type="CALL_MINUTES_BETWEEN_DROP_2G" data-id="2gcmbd">'+
                                    '<div class="panel panel-primary mpanel-child">'+                                                                                
                                      '<div class="panel-heading" style="text-align:center">'+
                                          '<h3 class="panel-title">2G Call Minutes between Drop</h3>'+
                                      '</div>'+
                                        '<div class="panel-body">'+
                                            '<div class="gauge" id="2gcmbd" data-type="CALL_MINUTES_BETWEEN_DROP_2G" data-id="2gcmbd" style="min-width: 255px; max-width:400px; height: 180px; margin: 0 auto"></div>'+
                                        '</div>'+
                                    '</div>'+
                                    '</a></li>';
                            
                                var _2grcssr = '<li><a href="#" class="kpi-item" data-type="RAN_CALL_SETUP_SUCCESS_RATE_2G" data-id="2grcssr" >'+
                                    '<div class="panel panel-primary mpanel-child">'+                                                                                
                                      '<div class="panel-heading" style="text-align:center">'+
                                          '<h3 class="panel-title">2G RAN Call Setup Success Rate</h3>'+
                                      '</div>'+
                                        '<div class="panel-body">'+
                                            '<div class="gauge" id="2grcssr" data-type="RAN_CALL_SETUP_SUCCESS_RATE_2G" data-id="2grcssr" style="min-width: 255px; max-width:400px; height: 180px; margin: 0 auto"></div>'+
                                        '</div>'+
                                    '</div>'+
                                    '</a></li>';
                                                                
                                container.append(cs);
                                container.append(ps);
                                container.append(_2gcmbd);
                                container.append(_2grcssr);
                                
                                loadSectorKPI( currentCells, function(kpiValues){
                                    gaugeKPI( {
                                        id : "#cs",
                                        data : [kpiValues.kpi2g.csTraffic],
                                        max : 100,
                                        baseLine : [{
                                            from: 0,
                                            to: 100,
                                            color: '#2ecc71'
                                        }]
                                    } );

                                    gaugeKPI( {
                                        id : "#ps",
                                        data : [kpiValues.kpi2g.psTraffic],
                                        max : 100,
                                        baseLine : [{
                                            from: 0,
                                            to: 100,
                                            color: '#2ecc71'
                                        }]
                                    } );                                

                                    gaugeKPI( {
                                        id : "#2gcmbd",
                                        data : [kpiValues.kpi2g.callMinutesBetweenDrop],
                                        max : 400,
                                        baseLine : [{
                                            from: 0,
                                            to: 200,
                                            color: '#2ecc71'
                                        },{
                                            from: 200,
                                            to: 350,
                                            color: '#f1c40f'
                                        },
                                        {
                                            from: 351,
                                            to: 400,
                                            color: '#ff0004'
                                        }
                                        ]
                                    });

                                    gaugeKPI( {
                                        id : "#2grcssr",
                                        data : [kpiValues.kpi2g.rancallSetupSuccessRate],
                                        max : 100,
                                        baseLine : [{
                                            from: 0,
                                            to: 80,
                                            color: '#ff0004' 
                                        },{
                                            from: 81,
                                            to: 99.2,
                                            color: '#e4ef2d'
                                        },{
                                            from: 99.2,
                                            to: 100,
                                            color: '#23ff0c'
                                        },
                                        ]
                                    } );                                      
                                } );

                            }else if( currentPage === "UMTS" ){
                                
                                var container = $(".carousel-list");
                                container.html("");

                                var cs = '<li><a href="#" class="kpi-item" data-type="CS_TRAFFIC_3G" data-id="cs">'+
                                    '<div class="panel panel-primary mpanel-child">'+                                                                                
                                      '<div class="panel-heading" style="text-align:center">'+
                                          '<h3 class="panel-title">CS Traffic</h3>'+
                                      '</div>'+
                                        '<div class="panel-body">'+
                                            '<div class="gauge" id="cs" data-type="CS_TRAFFIC_3G" data-id="cs" style="min-width: 255px; max-width:400px; height: 180px; margin: 0 auto"></div>'+
                                        '</div>'+
                                    '</div>'+
                                    '</a></li>';
                                
                                var ps = '<li><a href="#" class="kpi-item" data-type="PS_TRAFFIC_3G" data-id="ps">'+
                                    '<div class="panel panel-primary mpanel-child">'+                                                                                
                                      '<div class="panel-heading" style="text-align:center">'+
                                          '<h3 class="panel-title">PS Trafic</h3>'+
                                      '</div>'+
                                        '<div class="panel-body">'+
                                            '<div class="gauge" id="ps" data-type="PS_TRAFFIC_3G" data-id="ps" style="min-width: 255px; max-width:400px; height: 180px; margin: 0 auto"></div>'+
                                        '</div>'+
                                    '</div>'+
                                    '</a></li>';
                            
                                var _3grcsusr = '<li><a href="#" class="kpi-item" data-type="RAN_CALL_SETUP_SUCCESS_RATE_3G" data-id="3grcsusr">'+
                                    '<div class="panel panel-primary mpanel-child">'+                                                                                
                                      '<div class="panel-heading" style="text-align:center">'+
                                          '<h3 class="panel-title">3G RAN Call Set Up Success Rate</h3>'+
                                      '</div>'+
                                        '<div class="panel-body">'+
                                            '<div class="gauge" id="3grcsusr" data-type="RAN_CALL_SETUP_SUCCESS_RATE_3G" data-id="3grcsusr" style="min-width: 255px; max-width:400px; height: 180px; margin: 0 auto"></div>'+
                                        '</div>'+
                                    '</div>'+
                                    '</a></li>';
                            
                                var _3grpa = '<li><a href="#" class="kpi-item" data-type="RAN_PS_ACCESSIBILITY_3G" data-id="3grpa">'+
                                    '<div class="panel panel-primary mpanel-child">'+                                                                                
                                      '<div class="panel-heading" style="text-align:center">'+
                                          '<h3 class="panel-title">3G RAN PS Accessibility</h3>'+
                                      '</div>'+
                                        '<div class="panel-body">'+
                                            '<div class="gauge" id="3grpa" data-type="RAN_PS_ACCESSIBILITY_3G" data-id="3grpa" style="min-width: 255px; max-width:400px; height: 180px; margin: 0 auto"></div>'+
                                        '</div>'+
                                    '</div>'+
                                    '</a></li>';
                            
                                var _3gcmbd = '<li><a href="#" class="kpi-item" data-type="CALL_MINUTES_BETWEEN_DROP_3G" data-id="3gcmbd">'+
                                    '<div class="panel panel-primary mpanel-child">'+                                                                                
                                      '<div class="panel-heading" style="text-align:center">'+
                                          '<h3 class="panel-title">3G Call Minutes between Drop</h3>'+
                                      '</div>'+
                                        '<div class="panel-body">'+
                                            '<div class="gauge" id="3gcmbd" data-type="CALL_MINUTES_BETWEEN_DROP_3G" data-id="3gcmbd" style="min-width: 255px; max-width:400px; height: 180px; margin: 0 auto"></div>'+
                                        '</div>'+
                                    '</div>'+
                                    '</a></li>';
                            
                                var _3gmbpar = '<li><a href="#" class="kpi-item" data-type="MINUTES_BETWEEN_PS_ABNORMAL_RELEASES_3G" data-id="3gmbpar">'+
                                    '<div class="panel panel-primary mpanel-child">'+                                                                                
                                      '<div class="panel-heading" style="text-align:center">'+
                                          '<h3 class="panel-title">3G Minutes between PS Abnormal Releases</h3>'+
                                      '</div>'+
                                        '<div class="panel-body">'+
                                            '<div class="gauge" id="3gmbpar" data-type="MINUTES_BETWEEN_PS_ABNORMAL_RELEASES_3G" data-id="3gmbpar" style="min-width: 255px; max-width:400px; height: 180px; margin: 0 auto"></div>'+
                                        '</div>'+
                                    '</div>'+
                                    '</a></li>';
                                     
                                                                
                                container.append(cs);
                                container.append(ps);
                                container.append(_3grcsusr);
                                container.append(_3grpa);
                                container.append(_3gcmbd);
                                container.append(_3gmbpar);
                                
                                
                                loadSectorKPI( currentCells, function(kpiValues){
                                    gaugeKPI( {
                                        id : "#cs",
                                        data : [kpiValues.kpi3g.csTraffic],
                                        max : 100,
                                        baseLine : [{
                                            from: 0,
                                            to: 100,
                                            color: '#23ff0c' 
                                        }]
                                    } );

                                    gaugeKPI( {
                                        id : "#ps",
                                        data : [kpiValues.kpi3g.psTraffic],
                                        max : ( kpiValues.kpi3g.psTraffic+(kpiValues.kpi3g.psTraffic*0.5) <= 0 ? 100 : kpiValues.kpi3g.psTraffic+(kpiValues.kpi3g.psTraffic*0.5) ),
                                        baseLine : [{
                                            from: 0,
                                            to: ( kpiValues.kpi3g.psTraffic+(kpiValues.kpi3g.psTraffic*0.5) <= 0 ? 100 : kpiValues.kpi3g.psTraffic+(kpiValues.kpi3g.psTraffic*0.5) ),
                                            color: '#23ff0c' 
                                        }]
                                    } );                                

                                    gaugeKPI( {
                                        id : "#3grcsusr",
                                        data : [kpiValues.kpi3g.rancallSetupSuccessRate],
                                        max : 100,
                                        baseLine : [{
                                            from: 0,
                                            to: 80,
                                            color: '#ff0000' 
                                        },
                                        {
                                            from: 81,
                                            to: 95,
                                            color: '#ffe400' 
                                        },
                                        {
                                            from: 96,
                                            to: 100,
                                            color: '#23ff0c' 
                                        }
                                        ]
                                    } );

                                    gaugeKPI( {
                                        id : "#3grpa",
                                        data : [kpiValues.kpi3g.ranpsaccessibility],
                                        max : 100,
                                        baseLine : [{
                                            from: 0,
                                            to: 80,
                                            color: '#ff0000' 
                                        },
                                        {
                                            from: 81,
                                            to: 95,
                                            color: '#ffe400' 
                                        },
                                        {
                                            from: 96,
                                            to: 100,
                                            color: '#23ff0c' 
                                        }]
                                    } ); 
                                    
                                    gaugeKPI( {
                                        id : "#3gcmbd",
                                        data : [kpiValues.kpi3g.callMinutesBetweenDrop],
                                        max : 420+(420*0.5),
                                        baseLine : [{
                                            from: 0,
                                            to: 200,
                                            color: '#23ff0c' 
                                        },
                                        {
                                            from: 201,
                                            to: 360,
                                            color: '#ffe400' 
                                        },
                                        {
                                            from: 361,
                                            to: 420+(420*0.5),
                                            color: '#ff0000' 
                                        }]
                                    } );

                                    gaugeKPI( {
                                        id : "#3gmbpar",
                                        data : [kpiValues.kpi3g.ranminutesBetweenPSAbnormalReleases],
                                        max : kpiValues.kpi3g.ranminutesBetweenPSAbnormalReleases+(kpiValues.kpi3g.ranminutesBetweenPSAbnormalReleases*0.5),
                                        baseLine : [{
                                            from: 0,
                                            to: 90,
                                            color: '#23ff0c' 
                                        },
                                        {
                                            from: 91,
                                            to: 140,
                                            color: '#ffe400' 
                                        },
                                        {
                                            from: 141,
                                            to: kpiValues.kpi3g.ranminutesBetweenPSAbnormalReleases+(kpiValues.kpi3g.ranminutesBetweenPSAbnormalReleases*0.5),
                                            color: '#ff0000' 
                                        }]
                                    } );                                      
                                } );                         
                            }else if( currentPage === "LTE" ){
                                
                                var container = $(".carousel-list");
                                container.html("");                                
                                
                                var ps = '<li><a href="#" class="kpi-item" data-type="PS_TRAFFIC_4G" data-id="ps">'+
                                    '<div class="panel panel-primary mpanel-child">'+                                                                                
                                      '<div class="panel-heading" style="text-align:center">'+
                                          '<h3 class="panel-title">PS Trafic</h3>'+
                                      '</div>'+
                                        '<div class="panel-body">'+
                                            '<div class="gauge" id="ps" data-type="PS_TRAFFIC_4G" data-id="ps" style="min-width: 255px; max-width:400px; height: 180px; margin: 0 auto"></div>'+
                                        '</div>'+
                                    '</div>'+
                                    '</a></li>';
                            
                                var _4gesr = '<li><a href="#" class="kpi-item" data-type="ESTABLISHMENT_SUCCESS_RATE_4G" data-id="4gesr">'+
                                    '<div class="panel panel-primary mpanel-child">'+                                                                                
                                      '<div class="panel-heading" style="text-align:center">'+
                                          '<h3 class="panel-title">4G Establishment Success Rate</h3>'+
                                      '</div>'+
                                        '<div class="panel-body">'+
                                            '<div class="gauge" id="4gesr" data-type="ESTABLISHMENT_SUCCESS_RATE_4G" data-id="4gesr" style="min-width: 255px; max-width:400px; height: 180px; margin: 0 auto"></div>'+
                                        '</div>'+
                                    '</div>'+
                                    '</a></li>';
                            
                                var _4gmbear = '<li><a href="#" class="kpi-item" data-type="MINUTES_BETWEEN_ERAB_ABNORMAL_RELEASES_4G" data-id="4gmbear">'+
                                    '<div class="panel panel-primary mpanel-child">'+                                                                                
                                      '<div class="panel-heading" style="text-align:center">'+
                                          '<h3 class="panel-title">4G Minutes between E-RAB abnormal releases</h3>'+
                                      '</div>'+
                                        '<div class="panel-body">'+
                                            '<div class="gauge" id="4gmbear" data-type="MINUTES_BETWEEN_ERAB_ABNORMAL_RELEASES_4G" data-id="4gmbear" style="min-width: 255px; max-width:400px; height: 180px; margin: 0 auto"></div>'+
                                        '</div>'+
                                    '</div>'+
                                    '</a></li>';       
                            
                                container.append(ps);
                                container.append(_4gesr);
                                container.append(_4gmbear);
                                
                                loadSectorKPI( currentCells, function(kpiValues){
                                    gaugeKPI( {
                                        id : "#ps",
                                        data : [kpiValues.kpi4g.psTraffic],
                                        max : kpiValues.kpi4g.psTraffic+(kpiValues.kpi4g.psTraffic*0.5),
                                        baseLine : [
                                        {
                                            from: 0,
                                            to: kpiValues.kpi4g.psTraffic+(kpiValues.kpi4g.psTraffic*0.5),
                                            color: '#23ff0c' 
                                        }]
                                    } );                                

                                    gaugeKPI( {
                                        id : "#4gesr",
                                        data : [kpiValues.kpi4g.establishmentSuccessRate],
                                        max : 100,
                                        baseLine : [{
                                            from: 0,
                                            to: 80,
                                            color: '#ff0000' 
                                        },
                                        {
                                            from: 81,
                                            to: 95,
                                            color: '#ffe400' 
                                        },
                                        {
                                            from: 95,
                                            to: 100,
                                            color: '#23ff0c' 
                                        }]
                                    } );

                                    gaugeKPI( {
                                        id : "#4gmbear",
                                        data : [kpiValues.kpi4g.minutesBetweenERABAbnormalReleases],
                                        max : 150,
                                        baseLine : [{
                                            from: 0,
                                            to: 80,
                                            color: '#23ff0c' 
                                        },
                                        {
                                            from: 81,
                                            to: 130,
                                            color: '#ffe400' 
                                        },
                                        {
                                            from: 130,
                                            to: 150,
                                            color: '#ff0000' 
                                        }]
                                    } );                                   
                                } );                                  
                            }
                            setTimeout(rearrange,400);
                        }else{
                            rearrange();
                        }

                };
                
                
            }); 
               
            $(document).on("click",".kpi-item, .kpi-item > .mpanel-child",function(evt){
                    evt.preventDefault();
                    evt.preventDefault();
                    var type = $(this).data("type");
                    var id = $(this).data("id");
                    var title = $("#"+id).find(".panel-title").html();
                    loadKPITendecyChartData(currentCells,type,function(chartData){
                        
                    $(".tdccarousel").fadeOut("fast");
                    $(".kpi-tendencychart-container").css({visibility: "visible"}).fadeIn("slow");
                    if( $(".kpi-tendencychart-container").length <= 0 ){
                        $(".kpi-tendencychart-container").html('<div id="#logical-kpi-tendencychart"></div>');
                    }

                    $(".kpi-tendencychart-container").find(".real-title").html(title);

                    var chartOptions = {
                        title:{
                            text:''
                        },
                        legend : {
                          enabled: false  
                        },
                        tooltip: {
                            animation : true,
                            backgroundColor : "rgba(26,89,145,1)",
                            borderColor: "#154c7d",
                            style : {
                                color: '#fff',
                                fontSize: '12px',
                                padding: '8px'
                            }
                        },
                        chart : {
                            backgroundColor: '#05112c',
                                style: {
                                color: "#14295d"
                            }
                        },
                        credits: {
                            enabled: false
                        },
                        exporting: {
                            enabled: false
                        },
                        xAxis: {
                            lineColor: '#14295d',
                            tickColor: '#14295d',
                            minorGridLineColor: '#14295d',
                            labels: {
                                style: {
                                    color: '#14295d',
                                    fontSize : "10px"
                                }
                            },
                            gridLineColor: "#142143",
                            type: 'datetime',
                            dateTimeLabelFormats: { // don't display the dummy year
                                month: '%e. %b',
                                year: '%b'
                            },
                            title: {
                                text: ''
                            },
                            ordinal: false
                        },
                        yAxis: {
                            title: {
                                text: null
                            },
                            plotLines: [{
                                    value: 0,
                                    width: 1,
                                    color: '#14295d'
                            }],
                            labels: {
                                style: {
                                    color: '#14295d',
                                    fontSize : "10px"
                                }
                            },
                            lineColor: '#14295d',
                            lineWidth: 1,
                            tickWidth: 1,
                            tickColor: '#14295d',
                            minorGridLineColor: '#14295d',
                            gridLineColor: "#142143",
                            tickInterval: 0.1
                        },                       
                        series: []
                    };
                    
                    $.each(chartData.series,function(index,value){
                        var template = {
                            name: '',
                            data: [],
                            lineWidth : 0.75,
                            color : "#00d2ff",
                            type : "area",
                            fillColor: {
                               linearGradient: [0, 0, 0, 170],
                                stops: [
                                    [0, "#00d2ff"],
                                    [1, "rgba(2,0,0,0)"]
                                ]
                            }
                        };
                        template.name = value.name;
                        template.color = lineChartColors[index];
                        template.fillColor.stops = {
                               linearGradient: [0, 0, 0, 170],
                                stops: [
                                    [0, lineChartColors[index]],
                                    [1, "rgba(2,0,0,0)"]
                                ]                            
                        }
                        var dt= value.data;
                        $.each( dt, function(i,v){
                            var sd = [ v.timestamp , v.value ];
                            template.data.push( sd );
                        });

                        chartOptions.series.push( template );
                    });
                    
                    //baseLine 
                    $.each(chartData.baseLines,function(index,value){
                        var template = {
                            name: '',
                            data: [],
                            lineWidth : 1,
                            color : "#00d2ff",
                            type : "area",
                            fillColor: {
                               linearGradient: [0, 0, 0, 170],
                                stops: [
                                    [0, "#00d2ff"],
                                    [1, "rgba(2,0,0,0)"]
                                ]
                            }
                        };                        
                        template.name = value.name;
                        template.color = lineChartColors[index];
                        template.fillColor.stops = {
                               linearGradient: [0, 0, 0, 170],
                                stops: [
                                    [0, "#00d2ff"],
                                    [1, "rgba(2,0,0,0)"]
                                ]                            
                        }
                        var dt= value.data;
                        $.each( dt, function(i,v){
                            var sd = [ v.timestamp , v.value ];
                            template.data.push( sd );
                        });

                        chartOptions.series.push( template );
                    });

                    $("#logical-kpi-tendencychart").highcharts(chartOptions);	
                        
                    });
               });
               
               $(document).on("mousedown",".gauge",function(evt){
                    evt.preventDefault();
                    rearrangeFrameHeight(44);
                    var type = $(this).data("type");
                    var id = $(this).data("id");
                    var title = $("#"+id).parents(".kpi-item").find(".panel-title").html();
                    
                    
                    loadKPITendecyChartData(currentCells,type,function(chartData,type){
                        
                    $(".tdccarousel").fadeOut("fast");
                    $(".kpi-tendencychart-container").css({visibility: "visible"}).fadeIn("slow");
                    if( $(".kpi-tendencychart-container").length <= 0 ){
                        $(".kpi-tendencychart-container").html('<div id="#logical-kpi-tendencychart"></div>');
                    }

                    $(".kpi-tendencychart-container").find(".real-title").html(title);
                    var suffix = getSuffix(type);

                    var chartOptions = {
                        title:{
                            text:''
                        },
                        legend : {
                          enabled: false  
                        },
                        tooltip: {
                            animation : true,
                            backgroundColor : "rgba(26,89,145,1)",
                            borderColor: "#154c7d",
                            style : {
                                color: '#fff',
                                fontSize: '12px',
                                padding: '8px'
                            },
                            valueSuffix : " "+suffix
                        },
                        chart : {
                            backgroundColor: '#05112c',
                                style: {
                                color: "#14295d"
                            },
                            zoomType: 'y'
                        },
                        credits: {
                            enabled: false
                        },
                        exporting: {
                            enabled: false
                        },
                        xAxis: {
                            lineColor: '#14295d',
                            tickColor: '#14295d',
                            minorGridLineColor: '#14295d',
                            labels: {
                                style: {
                                    color: '#14295d',
                                    fontSize : "10px"
                                }
                            },
                            gridLineColor: "#142143",
                            type: 'datetime',
                            dateTimeLabelFormats: { // don't display the dummy year
                                month: '%e. %b',
                                year: '%b'
                            },
                            title: {
                                text: ''
                            },
                            ordinal: false
                        },
                        yAxis: {
                            title: {
                                    text: null
                            },
                            plotLines: [{
                                    width: 1,
                                    color: '#14295d'
                            }],
                            labels: {
                                style: {
                                    color: '#14295d',
                                    fontSize : "10px"
                                }
                            },
                            lineColor: '#14295d',
                            lineWidth: 1,
                            tickWidth: 1,
                            tickColor: '#14295d',
                            minorGridLineColor: '#14295d',
                            gridLineColor: "#142143",
                            tickInterval : 0.35
                       },
                        series: []
                    };


                    $.each(chartData.series,function(index,value){
                        var template = {
                            name: '',
                            data: [],
                            lineWidth : 1,
                            color : "#00d2ff",
                            type : "area",
                            fillColor: {
                               linearGradient: [0, 0, 0, 170],
                                stops: [
                                    [0, "#00d2ff"],
                                    [1, "rgba(2,0,0,0)"]
                                ]
                            }
                        };                        
                        template.name = value.name;
                        template.color = lineChartColors[index];
                        template.fillColor.stops = {
                               linearGradient: [0, 0, 0, 170],
                                stops: [
                                    [0, "#00d2ff"],
                                    [1, "rgba(2,0,0,0)"]
                                ]                            
                        }
                        var dt= value.data;
                        $.each( dt, function(i,v){
                            var sd = [ v.timestamp , v.value ];
                            template.data.push( sd );
                        });

                        chartOptions.series.push( template );
                    });
                    
                    //baseLine 
                    $.each(chartData.baseLines,function(index,value){
                        var template = {
                            name: '',
                            data: [],
                            lineWidth : 1,
                            color : "#00d2ff",
                            type : "area",
                            fillColor: {
                               linearGradient: [0, 0, 0, 170],
                                stops: [
                                    [0, "#00d2ff"],
                                    [1, "rgba(2,0,0,0)"]
                                ]
                            }
                        };                        
                        template.name = value.name;
                        template.color = lineChartBaseLine[index];
                        template.fillColor.stops = {
                               linearGradient: [0, 0, 0, 170],
                                stops: [
                                    [0, "#00d2ff"],
                                    [1, "rgba(2,0,0,0)"]
                                ]                            
                        }
                        var dt= value.data;
                        $.each( dt, function(i,v){
                            var sd = [ v.timestamp , v.value ];
                            template.data.push( sd );
                        });

                        chartOptions.series.push( template );
                    });

                    $("#logical-kpi-tendencychart").highcharts(chartOptions);	
                        
                    });
               });
               
	}
        
        function loadSectorKPI( cells, handler ){
            $.ajax({
                url : "sectorkpi",
                dataType : "JSON",
                contentType : "application/json",
                data : JSON.stringify( { technology : currentPage, cells : currentCells } ),
                method : "POST",
                success : function( response ){
                    handler(response);
                }
            });
            
        }
        
        function getSuffix(type){
            var suffix = "";
            var ERLS = ["CS_TRAFFIC_2G","CS_TRAFFIC_3G"];
            var MB = ["PS_TRAFFIC_2G","PS_TRAFFIC_3G","PS_TRAFFIC_4G"];
            var percentage = ["RAN_CALL_SETUP_SUCCESS_RATE_2G","RAN_CALL_SETUP_SUCCESS_RATE_3G","RAN_PS_ACCESSIBILITY_3G","ESTABLISHMENT_SUCCESS_RATE_4G"];
            var miliseconds = ["CALL_MINUTES_BETWEEN_DROP_2G","CALL_MINUTES_BETWEEN_DROP_3G","MINUTES_BETWEEN_PS_ABNORMAL_RELEASES_3G","MINUTES_BETWEEN_ERAB_ABNORMAL_RELEASES_4G"];

            if( jQuery.inArray(type,ERLS) > -1 ){
                suffix = "ERL";
            }else if( jQuery.inArray( type, MB ) > -1 ){
                suffix = "MB";
            }else if( jQuery.inArray(type,percentage) > -1 ){
                suffix = "%";
            }else if( jQuery.inArray(type,miliseconds) > -1 ){
                suffix = "ms";
            }else{
                suffix = "%";
            }

            return suffix;
        }
        
        function loadSectorKQITendencyChart( cells, handler ){
            $.ajax({
                url : "sectorkqichart",
                method : "POST",
                contentType : "application/json",
                dataType : "JSON",
                data : JSON.stringify( cells  ),
                success : function(response){
                    handler(response);
                }
            }); 
        }
        
        
        function loadKPITendecyChartData( cells, typeX ,handler ){
            $.ajax({
                url : "sectorkpichart",
                method : "POST",
                contentType : "application/json",
                dataType : "JSON",
                data : JSON.stringify( { "type" : typeX, "cells" : cells }  ),
                success : function(response){
                    handler(response,typeX);
                }
            });            
        }

        function loadKQITendecyChartData( cells, typeX ,handler ){
            $("#kqichart1").parent(".panel-body").find(".frameloading").fadeIn();
            $.ajax({
                url : "cellkqichart",
                method : "POST",
                contentType : "application/json",
                dataType : "JSON",
                data : JSON.stringify( { "type" : typeX, "cells" : cells }  ),
                success : function(response){
                    handler(response,typeX);
                }
            });
            
            $("#kqichart1").parent(".panel-body").find(".frameloading").fadeOut();
        }    
    
        function buildKPIGauge(config){
            
            var container = $(config.container);
            var kpis =  config.items;
            container.html("");
            $.each(kpis,function(i,v){
                
                var li = '<li><a href="#" class="kpi-item">'+
                                '<div class="panel panel-primary mpanel-child">'+                                                                                
                                  '<div class="panel-heading" style="text-align:center">'+
                                      '<h3 class="panel-title">'+v.title+'</h3>'+
                                  '</div>'+
                                    '<div class="panel-body">'+
                                        '<div class="gauge" id="'+v.id+'" style="min-width: 255px; max-width:400px; height: 180px; margin: 0 auto"></div>'+
                                    '</div>'+
                                '</div>'+
                              '</a></li>';
                
                container.append(li);
                gaugeIt("#"+v.id);
                
            });
            
        }
        
        function gaugeKPI( config ){
            var gaugeOptions  = {
                chart: {
                    type: 'gauge',
                    backgroundColor : 'rgba(0,0,0,0)',
                    plotBackgroundColor: 'rgba(0,0,0,0)',
                    plotBackgroundImage: null,
                    plotBorderWidth: 0,
                    plotShadow: false
                },

                title: {
                    text: ''
                },
	    	credits: {
                    enabled: false
                },
	        exporting: {
                    enabled: false
                },
                pane: {
                    startAngle: -150,
                    endAngle: 150,
                    background: [{
                        backgroundColor: {
                            linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                            stops: [
                                [0, '#FFF'],
                                [1, '#333']
                            ]
                        },
                        borderWidth: 0,
                        outerRadius: '109%'
                    }, {
                        backgroundColor: {
                            linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                            stops: [
                                [0, '#333'],
                                [1, '#FFF']
                            ]
                        },
                        borderWidth: 1,
                        outerRadius: '107%'
                    }, {
                        // default background
                    }, {
                        backgroundColor: '#DDD',
                        borderWidth: 0,
                        outerRadius: '105%',
                        innerRadius: '103%'
                    }]
                },

                // the value axis
                yAxis: {
                    min: 0,
                    max : config.max,
                    minorTickInterval: 'auto',
                    minorTickWidth: 1,
                    minorTickPosition: 'inside',
                    minorTickColor: '#666',

                    tickPixelInterval: 12,
                    tickWidth: 2,
                    tickPosition: 'inside',
                    tickColor: '#666',
                    labels: {
                        step: 2,
                        rotation: 'auto'
                    },
                    title: {
                        text: ''
                    },
                    plotBands: config.baseLine
                },

                series: [{
                    name: '',
                    data: config.data,
                    tooltip: {
                        animation : true,
                        backgroundColor : "rgba(26,89,145,1)",
                        borderColor: "#154c7d"
                    }
                }]
            };
            $(config.id).highcharts( gaugeOptions );              
        }
        
        function initClickFrameToggleEvent(){
            $(".toggle").click(function(evt){
                evt.preventDefault();
                if( isFrameOpen ) slideFrameDown();
                else slideFrameUp(0);
            });
        }
        

	function slideFrameDown()
	{
            isFrameOpen = false;
            $(document).find('.app-frame').stop().animate({bottom: ( 0 ), easing: 'easeOutBounce' });
            $(".doughnutTip").fadeOut("fast");
	}

	function slideFrameUp(additional)
	{       
            var elHeight = currentElementOnFrame.find(".mpanel").height();

            $(document).find('.app-frame').stop().animate({bottom: ( elHeight + 33 + additional ), easing: 'easeOutBounce' });
            isFrameOpen = true;
            $(".app-frame, .toggle").toggleClass("app-frame-shadow");
            
	}

	function rearrangeFrameHeight( additional )
	{
            var elHeight = currentElementOnFrame.find(".mpanel").height();
            $(document).find('.app-frame').stop().animate({bottom: ( elHeight + 33 + additional ) });	
	}
        

	function changeContent( origin, target)
	{
            var elementToReplace = origin;
            var elementToCome    = target;

            elementToReplace.fadeOut("fast").hide();
            elementToCome.fadeIn("slow");
            previousElementFrame = origin;
            currentElementOnFrame = elementToCome;
            rearrangeFrameHeight(0);
            $(".doughnutTip").fadeOut("fast");
	}

	function formatAlarmFrame( chartData ){
            $("#doughnutChart").html("");
            $("#doughnutChart").drawDoughnutChart( chartData );
	}
        
        function drawDoughnutChartByElem(elem,data){
            $(elem).html("");
            $(elem).drawDoughnutChart( data );            
        }

	function drawLineChart(container, data){	
            $(container).highcharts({
	    	title:{
			    text:''
                },
                legend : {
                  enabled: false  
                },
                tooltip: {
                    animation : true,
                    backgroundColor : "rgba(26,89,145,1)",
                    borderColor: "#154c7d",
                    style : {
                        color: '#fff',
                        fontSize: '12px',
                        padding: '8px'
                    }
                },
	    	chart : {
                    backgroundColor: '#05112c',
                        style: {
                        color: "#14295d"
                    },
                    type: 'area'
	    	},
	    	credits: {
                    enabled: false
                },
	        exporting: {
                    enabled: false
                },
	        xAxis: {
		      lineColor: '#14295d',
		      tickColor: '#14295d',
		      minorGridLineColor: '#14295d',
	          labels: {
	            style: {
	                color: '#14295d',
	                fontSize : "10px"
	            }
	          },
		      gridLineColor: "#142143",
	            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
	                'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
	        },
	        yAxis: {
                title: {
                        text: null
                 },
	            plotLines: [{
	                value: 0,
	                width: 1,
	                color: '#14295d'
	            }],
	          labels: {
	            style: {
	                color: '#14295d',
	                fontSize : "10px"
	            }
	          },
		      lineColor: '#14295d',
		      lineWidth: 1,
		      tickWidth: 1,
		      tickColor: '#14295d',
		      lineColor: '#14295d',
		      minorGridLineColor: '#14295d',
		      gridLineColor: "#142143",
		      min : 0 ,
                      max : 50,
                      tickInterval: 10,
                      
	        },
	        series: [{
	            name: 'XXXX',
	            data: [20.0, 28.9, 27.2, 31.5, 28.2, 30.5, 28.2, 30.5, 35.3, 18.3, 35.9, 37.6],
	            lineWidth : 0.5,
	            color : "#00d2ff",
                    fillColor: {
                       linearGradient: [0, 0, 0, 170],
                        stops: [
                            [0, "#00d2ff"],
                            [1, "rgba(2,0,0,0)"]
                        ]
                    }
	        }, {
	            name: 'YYYY',
	            data: [10.0, 15.8, 5.7, 11.3, 17.0, 22.0, 24.8, 24.1, 20.1, 14.1, 8.6, 2.5],
	            lineWidth : 0.5,
	            color : "#ffb400",
                    fillColor: {
                        linearGradient: [0, 0, 0, 170],
                        stops: [
                            [0, "#ffb400"],
                            [1, "rgba(2,0,0,0)"]
                        ]
                    }
	        }]
	    });	
	}

        function drawLineChartForKQI(container, data){	
            var chartOptions = {
	    	title:{
			    text:''
                },
                legend : {
                  enabled: false  
                },
                tooltip: {
                    animation : true,
                    backgroundColor : "rgba(26,89,145,1)",
                    borderColor: "#154c7d",
                    style : {
                        color: '#fff',
                        fontSize: '12px',
                        padding: '8px'
                    }
                },
	    	chart : {
                    backgroundColor: '#05112c',
                        style: {
                        color: "#14295d"
                    },
                    type: 'area'
	    	},
	    	credits: {
                    enabled: false
                },
	        exporting: {
                    enabled: false
                },
	        xAxis: {
		      lineColor: '#14295d',
		      tickColor: '#14295d',
		      minorGridLineColor: '#14295d',
	          labels: {
	            style: {
	                color: '#14295d',
	                fontSize : "10px"
	            }
	          },
		      gridLineColor: "#142143",
	            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
	                'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
	        },
	        yAxis: {
                title: {
                        text: null
                 },
	            plotLines: [{
	                value: 0,
	                width: 1,
	                color: '#14295d'
	            }],
	          labels: {
	            style: {
	                color: '#14295d',
	                fontSize : "10px"
	            }
	          },
		      lineColor: '#14295d',
		      lineWidth: 1,
		      tickWidth: 1,
		      tickColor: '#14295d',
		      minorGridLineColor: '#14295d',
		      gridLineColor: "#142143",
		      min : 0 ,
                      max : 50,
                      tickInterval: 10,
                      
	        },
	        series: []
	    };
            chartOptions.series.push({
	            name: 'XXXX',
	            data: [20.0, 28.9, 27.2, 31.5, 28.2, 30.5, 28.2, 30.5, 35.3, 18.3, 35.9, 37.6],
	            lineWidth : 0.5,
	            color : "#00d2ff",
                    fillColor: {
                       linearGradient: [0, 0, 0, 170],
                        stops: [
                            [0, "#00d2ff"],
                            [1, "rgba(2,0,0,0)"]
                        ]
                    }
	        });
            $(container).highcharts(chartOptions);	
	};
        
	$("body").on("click","a.frame-link",function(evt){
		evt.preventDefault();
		var dtype = $(this).data("type");
		if( dtype === "alarm" ){
                    var siteId = $(this).data("site");
                    events.alarm(siteId);
		}
		else if( dtype === "kpi" ){
                    events.kpi();
		}
		else if( dtype === "kqi" ){
                    events.kqi();
		}
                else if( dtype === "kqi_group" ){
                    var dataAspect = $(this).data("key");
                    events.kqiKey( dataAspect );
                }
                else if( dtype === "kpi_group" ){
                    var dataAspect = $(this).data("key");
                    events.kpiKey( dataAspect );
                }   
                else if( dtype==="celltdc" ){
                    var dataAspect = $(this).data("kpi");
                    var dataCell = $(this).data("cell");
                    events.kpiCell(dataCell,dataAspect);
                }else if( dtype==="kqi-cell" ){
                    var dataAspect = $(this).data("kqi");
                    var dataCell = $(this).data("cell");
                    events.kqiCell(dataCell,dataAspect);
                }
		else{
			alert("no frame defined");
		}
		
	});
        
        function normalizeKpiTab(){
            $(".kpi-tendencychart-container").stop().css({visibility:"hidden"}).fadeOut("fast");
            $(".tdccarousel").fadeIn("fast");
        }
        
        function normalizeKpiGaugePosition(){
            //make the sliding effect using jquery's anumate function '  
            $('ul.carousel-list').animate({'left' : 0},{queue:false, duration:500},function(){  
  
                //get the first list item and put it after the last list item (that's how the infinite effects is made) '  
                $('ul.carousel-list li:last').after($('ul.carousel-list li:first'));  
  
                //and get the left indent to the default -210px  
                $('ul.carousel-list').css({'left' : '-210px'});  
            });             
        }
        
        function gaugeIt( gauge ){
            $(gauge).highcharts({
                chart: {
                    type: 'gauge',
                    backgroundColor : 'rgba(0,0,0,0)',
                    plotBackgroundColor: 'rgba(0,0,0,0)',
                    plotBackgroundImage: null,
                    plotBorderWidth: 0,
                    plotShadow: false
                },

                title: {
                    text: ''
                },
	    	credits: {
                    enabled: false
                },
	        exporting: {
                    enabled: false
                },
                pane: {
                    startAngle: -150,
                    endAngle: 150,
                    background: [{
                        backgroundColor: {
                            linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                            stops: [
                                [0, '#FFF'],
                                [1, '#333']
                            ]
                        },
                        borderWidth: 0,
                        outerRadius: '109%'
                    }, {
                        backgroundColor: {
                            linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                            stops: [
                                [0, '#333'],
                                [1, '#FFF']
                            ]
                        },
                        borderWidth: 1,
                        outerRadius: '107%'
                    }, {
                        // default background
                    }, {
                        backgroundColor: '#DDD',
                        borderWidth: 0,
                        outerRadius: '105%',
                        innerRadius: '103%'
                    }]
                },

                // the value axis
                yAxis: {
                    min: 0,
                    max: 50,

                    minorTickInterval: 'auto',
                    minorTickWidth: 1,
                    minorTickLength: 10,
                    minorTickPosition: 'inside',
                    minorTickColor: '#666',

                    tickPixelInterval: 12,
                    tickWidth: 2,
                    tickPosition: 'inside',
                    tickLength: 10,
                    tickColor: '#666',
                    labels: {
                        step: 2,
                        rotation: 'auto'
                    },
                    title: {
                        text: ''
                    },
                    plotBands: [{
                        from: 0,
                        to: 12,
                        color: '#55BF3B' // green
                    }, {
                        from: 12,
                        to: 36,
                        color: '#DDDF0D' // yellow
                    }, {
                        from: 36,
                        to: 50,
                        color: '#DF5353' // red
                    }]
                },

                series: [{
                    name: '',
                    data: [22],
                    tooltip: {
                        animation : true,
                        backgroundColor : "rgba(26,89,145,1)",
                        borderColor: "#154c7d"
                    }
                }]
            }  );    
        }

	$(document).on('click',".back",function(evt){
            evt.preventDefault();
            changeContent( currentElementOnFrame , previousElementFrame );
	});
        
        $(document).on('click',".back-logical",function(evt){
            evt.preventDefault();
            rearrangeFrameHeight(45);
            
        });
        
        $(".back-to-gauge").click(function(evt){
            evt.preventDefault();
            $(".kpi-tendencychart-container").stop().css({visibility:"hidden"}).fadeOut("fast");
            $(".tdccarousel").fadeIn("fast");
            
	});
        
        function loadGoldenSite(){
            requestSites( urls.golden, drawGoldenSiteMarker );
        }

        function drawGoldenSiteMarker( data ){
            clearMarkers();
            var last ;
            $.each(data,function(index,site){

             // InfoWindow content
             var content = '<div id="iw-container">' +
                               '<div class="iw-content">' +
                                 '<table style="width:100%">'+
                                 '<tr><td>Site</td><td>:</td><td>'+site.siteName+'</td></tr>'+
                                 '<tr><td>Site ID</td><td>:</td><td>'+site.siteId+'</td></tr>'+
                                 '<tr><td>Address</td><td>:</td><td>'+site.address+'</td></tr>'+
                                 '<tr><td>CS traffic</td><td>:</td><td>Calculating...</td></tr>'+
                                 '<tr><td>PS traffic</td><td>:</td><td>Calculating...</td></tr>'
                               '</div>' +
                               '<div class="iw-bottom-gradient"></div>' +
                             '</div>';

                                     // A new Info Window is created and set content
             var infowindow = new google.maps.InfoWindow({
               content: content,
                    // Assign a maximum value for the width of the infowindow allows
                    // greater control over the various content elements
                    maxWidth: 230,
                    maxHeight : 230
             });

                var myLatLng = new google.maps.LatLng( site.latitude, site.longitude);
                var icn;

                switch ( site.severity ){

                    case "CRITICAL" : 
                        icn = icons.critical;
                        break;

                    case "MAJOR" : 
                        icn = icons.major;
                        break;

                    case "MINOR" : 
                        icn = icons.minor;
                        break;
                    case "NORMAL" : 
                        icn = icons.normal;
                        break;

                    default :
                        break;

                }

                var marker = new google.maps.Marker({
                  position: myLatLng,
                  map: map,
                  icon: icn
                });
                
                marker.siteId = site.siteId;
                
                markers.push( marker );
                
                google.maps.event.addListener(marker, 'mouseover', function() {
                    
                    $.ajax({
                       url : "sitetraffic/"+marker.siteId,
                       contentType : "application/json",
                       dataType : "JSON",
                       method : "GET",
                       success : function( traffic ){
                            var contentNew = '<div id="iw-container">' +
                                              '<div class="iw-content">' +
                                                '<table style="width:100%">'+
                                                '<tr><td>Site</td><td>:</td><td>'+site.siteName+'</td></tr>'+
                                                '<tr><td>Site ID</td><td>:</td><td>'+site.siteId+'</td></tr>'+
                                                '<tr><td>Address</td><td>:</td><td>'+site.address+'</td></tr>'+
                                                '<tr><td>CS traffic</td><td>:</td><td>'+traffic.csTraffic+' ERL</td></tr>'+
                                                '<tr><td>PS traffic</td><td>:</td><td>'+traffic.psTraffic+' MB</td></tr>'
                                              '</div>' +
                                              '<div class="iw-bottom-gradient"></div>' +
                                            '</div>'; 
                                    
                            infowindow.setContent(contentNew);
                                    
                       }
                    });
                    
                    infowindow.open(map,marker);
                });


                google.maps.event.addListener(marker, 'mouseout', function() {
                    infowindow.close();
                 });

                last = myLatLng;
                applyCustomInfoWindow(infowindow);
            });

            map.setCenter( last );
            map.setZoom(8);

        }


        function drawGoldenSiteMarkerSilent( data ){
             clearMarkers();
            var last ;
            $.each(data,function(index,site){

             // InfoWindow content
             var content = '<div id="iw-container">' +
                               '<div class="iw-content">' +
                                 '<table style="width:100%">'+
                                 '<tr><td>Site</td><td>:</td><td>'+site.siteName+'</td></tr>'+
                                 '<tr><td>Site ID</td><td>:</td><td>'+site.siteId+'</td></tr>'+
                                 '<tr><td>Address</td><td>:</td><td>'+site.address+'</td></tr>'+
                                 '<tr><td>CS traffic</td><td>:</td><td>Calculating...</td></tr>'+
                                 '<tr><td>PS traffic</td><td>:</td><td>Calculating...</td></tr>'
                               '</div>' +
                               '<div class="iw-bottom-gradient"></div>' +
                             '</div>';

                                     // A new Info Window is created and set content
             var infowindow = new google.maps.InfoWindow({
               content: content,
                    // Assign a maximum value for the width of the infowindow allows
                    // greater control over the various content elements
                    maxWidth: 230,
                    maxHeight : 230
             });

                var myLatLng = new google.maps.LatLng( site.latitude, site.longitude);
                var icn;

                switch ( site.severity ){

                    case "CRITICAL" : 
                        icn = icons.critical;
                        break;

                    case "MAJOR" : 
                        icn = icons.major;
                        break;

                    case "MINOR" : 
                        icn = icons.minor;
                        break;
                    case "NORMAL" : 
                        icn = icons.normal;
                        break;

                    default :
                        break;

                }

                var marker = new google.maps.Marker({
                  position: myLatLng,
                  map: map,
                  icon: icn
                });
                
                marker.siteId = site.siteId;
                
                markers.push( marker );
                
                google.maps.event.addListener(marker, 'mouseover', function() {
                    
                    $.ajax({
                       url : "sitetraffic/"+marker.siteId,
                       contentType : "application/json",
                       dataType : "JSON",
                       method : "GET",
                       success : function( traffic ){
                            var contentNew = '<div id="iw-container">' +
                                              '<div class="iw-content">' +
                                                '<table style="width:100%">'+
                                                '<tr><td>Site</td><td>:</td><td>'+site.siteName+'</td></tr>'+
                                                '<tr><td>Site ID</td><td>:</td><td>'+site.siteId+'</td></tr>'+
                                                '<tr><td>Address</td><td>:</td><td>'+site.address+'</td></tr>'+
                                                '<tr><td>CS traffic</td><td>:</td><td>'+traffic.csTraffic+' erl</td></tr>'+
                                                '<tr><td>PS traffic</td><td>:</td><td>'+traffic.psTraffic+' MB</td></tr>'
                                              '</div>' +
                                              '<div class="iw-bottom-gradient"></div>' +
                                            '</div>'; 
                                    
                            infowindow.setContent(contentNew);
                                    
                       }
                    });
                    
                    infowindow.open(map,marker);
                });


                google.maps.event.addListener(marker, 'mouseout', function() {
                    infowindow.close();
                 });

                last = myLatLng;
                applyCustomInfoWindow(infowindow);
            });

        }

        function loadGSMCell(){
           requestSites( urls.gsm, drawLogicalMarker );
        }

        function loadUMTSCell(){
            requestSites( urls.umts , drawLogicalMarker );
        }

        function loadLTECell(){
            requestSites( urls.lte, drawLogicalMarker );
        }

        function loadGSMCellSilent(){
           requestSitesSilent( urls.gsm, drawLogicalMarkerSilent );
        }

        function loadUMTSCellSilent(){
            requestSitesSilent( urls.umts , drawLogicalMarkerSilent );
        }

        function loadLTECellSilent(){
            requestSitesSilent( urls.lte, drawLogicalMarkerSilent );
        }

        function requestSites(pUrl,drawCallback){
            showLoading();
            jQuery.ajax({
               url: pUrl,
               dataType: 'JSON',
               async: true,
               type: 'GET',
               success: function (data, textStatus, jqXHR) {
                   drawCallback(data);
               }
            }).done(function() {
                hideLoading();
            });;             
        }

        function requestSitesSilent(pUrl,drawCallback){
            jQuery.ajax({
               url: pUrl,
               dataType: 'JSON',
               async: true,
               type: 'GET',
               success: function (data, textStatus, jqXHR) {
                   drawCallback(data);
               }
            });            
        }

        function drawLogicalMarker(data){
            clearMarkers();    
            var last ;
            //data = data.splice(0,100);
            
            $.each(data,function(index,sector){
                 // InfoWindow content
                 var content = '<div id="iw-container">' +
                                   '<div class="iw-content">' +
                                     '<table style="width:100%">'+
                                     '<tr><td>Site</td><td>:</td><td>'+sector.site.siteName+'</td></tr>'+
                                     '<tr><td>Site ID</td><td>:</td><td>'+sector.site.siteId+'</td></tr>'+
                                     '<tr><td>Address</td><td>:</td><td>'+sector.site.address+'</td></tr>'+
                                     '<tr><td>CS traffic</td><td>:</td><td>Calculating...</td></tr>'+
                                     '<tr><td>PS traffic</td><td>:</td><td>Calculating...</td></tr>'
                                   '</div>' +
                                   '<div class="iw-bottom-gradient"></div>' +
                                 '</div>';

                                         // A new Info Window is created and set content
                var infowindow = new google.maps.InfoWindow({
                   content: content
                });

                var myLatLng = new google.maps.LatLng( sector.site.latitude, sector.site.longitude);

                var clor = "";

                if( sector.severity === "CRITICAL" ){
                    clor = alarmColor.critical;
                }
                else if( sector.severity === "MAJOR" ){
                    clor = alarmColor.major;
                }else if( sector.severity === "MINOR" ){
                    clor = alarmColor.minor;
                }else{
                    clor = alarmColor.normal;
                }

                var sectorIcon = {
                  path: 'm0.5,0.5l53,30.2857c-11.4313,19.8149 -30.0151,27.7095 -53,30.2858l0,-60.5715z',
                  fillColor: clor ,
                  fillOpacity: 1,
                  scale: 0.35,
                  strokeColor: 'black',
                  strokeWeight: 2,
                  rotation: sector.azimut-150,
                  size : new google.maps.Size(24, 24)
                };
                
                var sectorMarker = new google.maps.Marker({
                   position: myLatLng,
                   icon: sectorIcon,
                   map: map
                });
                sectorMarker.setZIndex(1);

                var sectorInfowindow = new google.maps.InfoWindow({
                    content: content
                });

                google.maps.event.addListener(sectorMarker, 'mouseover', function() {
                    var sectorIconNew = {
                        path: 'm0.5,0.5l53,30.2857c-11.4313,19.8149 -30.0151,27.7095 -53,30.2858l0,-60.5715z',
                        fillColor: clor ,
                        fillOpacity: 1,
                        scale: 0.35,
                        strokeColor: clor,
                        strokeWeight: 2,
                        rotation: sector.azimut-150,
                        size : new google.maps.Size(24, 24)
                    };
                    sectorMarker.setIcon( sectorIconNew );
                    
                    var cellId = [];
                    
                    $.each(sector.cells,function(i,v){
                        cellId.push( v.cellName );
                    }); 
                   
                    $.ajax({
                       url : "sectortraffic",
                       contentType : "application/json",
                       dataType : "JSON",
                       method : "POST",
                       data : JSON.stringify( cellId ),
                       success : function( traffic ){
                            var contentNew = '<div id="iw-container">' +
                                              '<div class="iw-content">' +
                                                '<table style="width:100%">'+
                                                '<tr><td>Site</td><td>:</td><td>'+sector.site.siteName+'</td></tr>'+
                                                '<tr><td>Site ID</td><td>:</td><td>'+sector.site.siteId+'</td></tr>'+
                                                '<tr><td>Address</td><td>:</td><td>'+sector.site.address+'</td></tr>'+
                                                '<tr><td>CS traffic</td><td>:</td><td>'+traffic.csTraffic+' ERL</td></tr>'+
                                                '<tr><td>PS traffic</td><td>:</td><td>'+traffic.psTraffic+' MB</td></tr>'
                                              '</div>' +
                                              '<div class="iw-bottom-gradient"></div>' +
                                            '</div>'; 
                                    
                            infowindow.setContent(contentNew);
                                    
                       }
                    });                    
                    
                    infowindow.open(map,sectorMarker);
                });

                google.maps.event.addListener(sectorMarker, 'mouseout', function() {
                   sectorMarker.setIcon(sectorIcon);
                   infowindow.close();
                }); 

                google.maps.event.addListener(sectorMarker,'click',function(){
                   
                    events.logical();
                    isFrameOpen = true;
                    $("a[href=#alarm]").trigger("click");
                    normalizeKpiTab();
                    normalizeKpiGaugePosition();
                   
                    var cellId = [];
                   
                    if( sector.cellWithAlarms.length > 0 ){
                        $.each(sector.cellWithAlarms,function(i,v){
                            cellId.push( v.cellName );
                        });
                    }else{
                        $.each(sector.cells,function(i,v){
                            cellId.push( v.cellName );
                        });                       
                    }
                    
                    currentCells = cellId;

                    $.ajax({
                        url : "sectorAlarmSummary",
                        method : "POST",
                        data :JSON.stringify( cellId ),
                        contentType: 'application/json',
                        dataType : "JSON",
                        success : function( response ){
                           if( response !== undefined ){
                                var chartData = [{
                                    title: "Critical",
                                    value: response.critical,
                                    color: alarmColor.critical
                                  }, {
                                    title: "Major",
                                    value: response.major,
                                    color: alarmColor.major
                                  }, {
                                    title: "Minor",
                                    value: response.minor,
                                    color: alarmColor.minor
                                }];

                                drawDoughnutChartByElem("#doughnutChartSector",chartData);
                           }
                        }
                    });

                    $.ajax({
                        url : "sectoralarm",
                        method : "POST",
                        data :JSON.stringify( cellId ),
                        contentType: 'application/json',
                        success : function(response){
                          $("#sectoralarmlisttable > tbody").html("");
                          if( response !== undefined ){
                                $.each(response,function(i,v){
                                  var row = "<tr>"+
                                                "<td>"+v.siteId+"</td>"+
                                                "<td>"+v.siteName+"</td>"+
                                                "<td>"+v.severity+"</td>"+                                          
                                                "<td>"+v.node+"</td>"+
                                                "<td>"+v.alarmName+"</td>"+
                                                "<td>"+v.lastOccurence+"</td>"+
                                                "<td>"+v.ticketId+"</td>"+
                                                "<td>"+v.summary+"</td>"+
                                            "</tr>";
                                    $("#sectoralarmlisttable > tbody").append( row );
                                });
                            }else{
                                alert("Error");
                            }
                        }
                    });
                });

                markers.push( sectorMarker );        
                     
                var imageCenter = {
                  url: 'assets/img/lgc_center.png',
                  // The anchor for this image is the base of the flagpole at (0, 32).
                  anchor: new google.maps.Point(5, 5)
                };
                   
                //center marker   
                var centerMarker = new google.maps.Marker({
                  position: myLatLng,
                  map: map,
                  icon: imageCenter
                });  
                 
                centerMarker.setZIndex( sectorMarker.getZIndex() + 2 );
                centerMarker.siteId = sector.site.siteId;
                markers.push( centerMarker );
                 
                google.maps.event.addListener(centerMarker, 'mouseover', function() {
                   infowindow.open(map,centerMarker);
                });


                google.maps.event.addListener(centerMarker, 'mouseout', function() {
                    infowindow.close();
                });                
                    
                last = myLatLng;
                applyCustomInfoWindow(infowindow);

             });

             map.setCenter( last );
             map.setZoom(8);            

        }

        function drawLogicalMarkerSilent(data){
            clearMarkers();    
            
            $.each(data,function(index,sector){
                 // InfoWindow content
                 var content = '<div id="iw-container">' +
                                   '<div class="iw-content">' +
                                     '<table style="width:100%">'+
                                     '<tr><td>Site</td><td>:</td><td>'+sector.site.siteName+'</td></tr>'+
                                     '<tr><td>Site ID</td><td>:</td><td>'+sector.site.siteId+'</td></tr>'+
                                     '<tr><td>Address</td><td>:</td><td>'+sector.site.address+'</td></tr>'+
                                     '<tr><td>CS traffic</td><td>:</td><td>Calculating...</td></tr>'+
                                     '<tr><td>PS traffic</td><td>:</td><td>Calculating...</td></tr>'
                                   '</div>' +
                                   '<div class="iw-bottom-gradient"></div>' +
                                 '</div>';

                                         // A new Info Window is created and set content
                var infowindow = new google.maps.InfoWindow({
                   content: content
                });

                var myLatLng = new google.maps.LatLng( sector.site.latitude, sector.site.longitude);

                var clor = "";

                if( sector.severity === "CRITICAL" ){
                    clor = alarmColor.critical;
                }
                else if( sector.severity === "MAJOR" ){
                    clor = alarmColor.major;
                }else if( sector.severity === "MINOR" ){
                    clor = alarmColor.minor;
                }else{
                    clor = alarmColor.normal;
                }

                var sectorIcon = {
                  path: 'm0.5,0.5l53,30.2857c-11.4313,19.8149 -30.0151,27.7095 -53,30.2858l0,-60.5715z',
                  fillColor: clor ,
                  fillOpacity: 1,
                  scale: 0.35,
                  strokeColor: 'black',
                  strokeWeight: 2,
                  rotation: sector.azimut-150,
                  size : new google.maps.Size(24, 24)
                };
                
                var sectorMarker = new google.maps.Marker({
                   position: myLatLng,
                   icon: sectorIcon,
                   map: map
                });
                sectorMarker.setZIndex(1);

                var sectorInfowindow = new google.maps.InfoWindow({
                    content: content
                });

                google.maps.event.addListener(sectorMarker, 'mouseover', function() {
                    var sectorIconNew = {
                        path: 'm0.5,0.5l53,30.2857c-11.4313,19.8149 -30.0151,27.7095 -53,30.2858l0,-60.5715z',
                        fillColor: clor ,
                        fillOpacity: 1,
                        scale: 0.35,
                        strokeColor: clor,
                        strokeWeight: 2,
                        rotation: sector.azimut-150,
                        size : new google.maps.Size(24, 24)
                    };
                    sectorMarker.setIcon( sectorIconNew );
                    
                    var cellId = [];
                    
                    $.each(sector.cells,function(i,v){
                        cellId.push( v.cellName );
                    }); 
                   
                    $.ajax({
                       url : "sectortraffic",
                       contentType : "application/json",
                       dataType : "JSON",
                       method : "POST",
                       data : JSON.stringify( cellId ),
                       success : function( traffic ){
                            var contentNew = '<div id="iw-container">' +
                                              '<div class="iw-content">' +
                                                '<table style="width:100%">'+
                                                '<tr><td>Site</td><td>:</td><td>'+sector.site.siteName+'</td></tr>'+
                                                '<tr><td>Site ID</td><td>:</td><td>'+sector.site.siteId+'</td></tr>'+
                                                '<tr><td>Address</td><td>:</td><td>'+sector.site.address+'</td></tr>'+
                                                '<tr><td>CS traffic</td><td>:</td><td>'+traffic.csTraffic+' ERL</td></tr>'+
                                                '<tr><td>PS traffic</td><td>:</td><td>'+traffic.psTraffic+' MB</td></tr>'
                                              '</div>' +
                                              '<div class="iw-bottom-gradient"></div>' +
                                            '</div>'; 
                                    
                            infowindow.setContent(contentNew);
                                    
                       }
                    });                    
                    
                    infowindow.open(map,sectorMarker);
                });

                google.maps.event.addListener(sectorMarker, 'mouseout', function() {
                   sectorMarker.setIcon(sectorIcon);
                   infowindow.close();
                }); 

                google.maps.event.addListener(sectorMarker,'click',function(){
                  
                    events.logical();
                    isFrameOpen = true;
                    $("a[href=#alarm]").trigger("click");
                    normalizeKpiTab();
                    normalizeKpiGaugePosition();
                   
                    var cellId = [];
                   
                    if( sector.cellWithAlarms.length > 0 ){
                        $.each(sector.cellWithAlarms,function(i,v){
                            cellId.push( v.cellName );
                        });
                    }else{
                        $.each(sector.cells,function(i,v){
                            cellId.push( v.cellName );
                        });                       
                    }
                    
                    currentCells = cellId;

                    $.ajax({
                        url : "sectorAlarmSummary",
                        method : "POST",
                        data :JSON.stringify( cellId ),
                        contentType: 'application/json',
                        dataType : "JSON",
                        success : function( response ){
                           if( response !== undefined ){
                                var chartData = [{
                                    title: "Critical",
                                    value: response.critical,
                                    color: alarmColor.critical
                                  }, {
                                    title: "Major",
                                    value: response.major,
                                    color: alarmColor.major
                                  }, {
                                    title: "Minor",
                                    value: response.minor,
                                    color: alarmColor.minor
                                }];

                                drawDoughnutChartByElem("#doughnutChartSector",chartData);
                           }
                        }
                    });

                    $.ajax({
                        url : "sectoralarm",
                        method : "POST",
                        data :JSON.stringify( cellId ),
                        contentType: 'application/json',
                        success : function(response){
                          $("#sectoralarmlisttable > tbody").html("");
                          if( response !== undefined ){
                                $.each(response,function(i,v){
                                  var row = "<tr>"+
                                                "<td>"+v.siteId+"</td>"+
                                                "<td>"+v.siteName+"</td>"+
                                                "<td>"+v.severity+"</td>"+                                          
                                                "<td>"+v.node+"</td>"+
                                                "<td>"+v.alarmName+"</td>"+
                                                "<td>"+v.lastOccurence+"</td>"+
                                                "<td>"+v.ticketId+"</td>"+
                                                "<td>"+v.summary+"</td>"+
                                            "</tr>";
                                    $("#sectoralarmlisttable > tbody").append( row );
                                });
                            }else{
                                alert("Error");
                            }
                        }
                    });
                });

                markers.push( sectorMarker );        
                     
                var imageCenter = {
                  url: 'assets/img/lgc_center.png',
                  // The anchor for this image is the base of the flagpole at (0, 32).
                  anchor: new google.maps.Point(5, 5)
                };
                   
                //center marker   
                var centerMarker = new google.maps.Marker({
                  position: myLatLng,
                  map: map,
                  icon: imageCenter
                });  
                 
                centerMarker.setZIndex( sectorMarker.getZIndex() + 2 );
                centerMarker.siteId = sector.site.siteId;
                markers.push( centerMarker );
                 
                google.maps.event.addListener(centerMarker, 'mouseover', function() {
                   infowindow.open(map,centerMarker);
                });


                google.maps.event.addListener(centerMarker, 'mouseout', function() {
                    infowindow.close();
                });                
                    
                last = myLatLng;
                applyCustomInfoWindow(infowindow);

             });          

        }
        
        function applyCustomInfoWindow(infowindow){
            // *
            // START INFOWINDOW CUSTOMIZE.
            // The google.maps.event.addListener() event expects
            // the creation of the infowindow HTML structure 'domready'
            // and before the opening of the infowindow, defined styles are applied.
            // *
            google.maps.event.addListener(infowindow, 'domready', function() {

              // Reference to the DIV that wraps the bottom of infowindow
              var iwOuter = $('.gm-style-iw');
                iwOuter.addClass("arrow_box");

              /* Since this div is in a position prior to .gm-div style-iw.
               * We use jQuery and create a iwBackground variable,
               * and took advantage of the existing reference .gm-style-iw for the previous div with .prev().
              */
              var iwBackground = iwOuter.prev();

              // Removes background shadow DIV
              iwBackground.children(':nth-child(2)').css({'display' : 'none'});

              // Removes white background DIV
              iwBackground.children(':nth-child(4)').css({'display' : 'none'});

              // Moves the infowindow ..px to the right.
              iwOuter.parent().parent().css({left: '10px'});

              // Moves the shadow of the arrow 76px to the left margin.
              iwBackground.children(':nth-child(1)').attr('style', function(i,s){ return s + 'left: 30px !important;'});


              // Moves the arrow 76px to the left margin.
              iwBackground.children(':nth-child(3)').attr('style', function(i,s){ return s +'left: 90px !important;'});
              iwBackground.children(':nth-child(3)').parent().css( {display:'none'} );
              // Changes the desired tail shadow color.
              //iwBackground.children(':nth-child(3)').find('div').children().css({'box-shadow': 'rgba(0, 0, 0, 0.6) 0px 1px 6px','border':'1px solid #000','border-bottom':'0','opacity':'0.8712', 'z-index' : '1','background-color': '#37445e',position: 'relative'});

              // Reference to the div that groups the close button elements.
              var iwCloseBtn = iwOuter.next();

              // Apply the desired effect to the close button
              iwCloseBtn.css({opacity: '0', display: 'none'});

              // If the content of infowindow not exceed the set maximum height, then the gradient is removed.
              if($('.iw-content').height() < 140){
                $('.iw-bottom-gradient').css({display: 'none'});
              }
            });
          google.maps.event.addDomListener(window, 'load', null);            

        }

        function clearMarkers(){
            for (var i=0; i<markers.length;i++){
                markers[i].setMap(null);
            }
            markers = [];
        }

        function showLoading(){
            $("#content-wrapper > .loading").stop().removeClass("bounceOut").toggleClass("bounceIn").show();
        }

        function hideLoading(){
            $("#content-wrapper > .loading").stop().removeClass("bounceIn").toggleClass("bounceOut");
        }

        function createGMapElem(){
            map = new google.maps.Map(document.getElementById('map'), {
                zoom: 12,
                center: {lat: 55.68333333333333, lng: 12.566666666666666},
                panControl: false,
                zoomControl: false,
                mapTypeControl: false,
                scaleControl: false,
                streetViewControl: false,
                overviewMapControl: false
            });
        }

        function loadGoldenSiteSilent(){
            requestSitesSilent( urls.golden, drawGoldenSiteMarkerSilent );
        };
        
        $(document).on("click",".abs_news",function(evt){
            $("#logical").fadeOut("fast");
            $("#news-frame").css({visibility: "visible"}).fadeIn("slow");
            previousElementFrame =$("#news-frame");
            currentElementOnFrame = $("#news-frame");
            rearrangeFrameHeight(0);            
        });
        
        
        $(window).resize(function(){
            normalizeMapBasedOnScreenSize();
        });
        
        function normalizeMapBasedOnScreenSize(){
            var newheight = $(window).height()-95;
            $("section#content-wrapper").height(newheight);
        }
        

        var reloadAlarm = function(){
            newsAlarmTable.html("Updating...");
            $.ajax({
                url : "news/alarm",
                method : "GET",
                contentType: 'application/json',
                dataType: 'json',
                success : function(response){
                    newsAlarmTable.html("");
                    if( response !== undefined ){
                        $("#total_critical_alarm").html( response.length );
                        $.each( response , function(i,v){
                           var row = "<tr>"+
                                        "<td>"+(i+1)+"</td>"+
                                        "<td><a href='#' class='frame-link' data-type='alarm' data-site='"+v.siteId+"'>"+v.siteName+"</a></td>"+
                                        "<td>"+v.node+"</td>"+
                                        "<td>"+v.alarmName+"</td>"+
                                        "<td>"+v.ticketStatus+"</td>"+
                                    +"</tr>";
                           newsAlarmTable.append( row );
                        });
                    }
                    else{
                        alert( "error" );
                    }
                }
            });

        };
        
        var reloadKPI = function(){
            $.ajax({
                url : "news/kpi",
                method : "GET",
                dataType : "json",
                contentType : "application/json",
                success : function( response ){

                    if( response !== undefined ){
                        
                        var _2gcallMinutesBetweenDropVal = response.kpi2g.callMinutesBetweenDrop;
                        var _2grancallSetupSuccessRateVal = response.kpi2g.rancallSetupSuccessRate;
                        var _3gcallMinutesBetweenDropVal = response.kpi3g.callMinutesBetweenDrop;
                        var _3granminutesBetweenPSAbnormalReleasesVal = response.kpi3g.ranminutesBetweenPSAbnormalReleases;
                        var _3grancallSetupSuccessRateVal = response.kpi3g.rancallSetupSuccessRate;
                        var _3granpsaccessibilityVal = response.kpi3g.ranpsaccessibility;
                        var _4gestablishmentSuccessRateVal = response.kpi4g.establishmentSuccessRate;
                        var _4gminutesBetweenERABAbnormalReleasesVal = response.kpi4g.minutesBetweenERABAbnormalReleases;
                        
                        _2gCallMinutesBetweenDrop.html( _2gcallMinutesBetweenDropVal  );
                        _2gRanCallSetUpSuccessRateSpeech.html( _2grancallSetupSuccessRateVal + " %" );
                        _3gCallMinutesBetweenDrop.html( _3gcallMinutesBetweenDropVal );
                        _3gMinutesPSAbnormalReleases.html( _3granminutesBetweenPSAbnormalReleasesVal );
                        _3gRanCallSetUpSuccessRateSpeech.html( _3grancallSetupSuccessRateVal + " %" );
                        _3gRanPSAccessibility.html( _3granpsaccessibilityVal + " %" );
                        _4gEstablishmentSuccessRate.html( _4gestablishmentSuccessRateVal + " %" );
                        _4gMinutesBetweenERABAbnormal.html( _4gminutesBetweenERABAbnormalReleasesVal );
                        
                        _2gCallMinutesBetweenDropIndicator.removeClass("circle-critical");
                        _2gRanCallSetUpSuccessRateSpeechIndicator.removeClass("circle-critical");
                        _3gRanCallSetUpSuccessRateSpeechIndicator.removeClass("circle-critical");
                        _3gRanPSAccessibilityIndicator.removeClass("circle-critical");
                        _3gCallMinutesBetweenDropIndicator.removeClass("circle-critical");
                        _3gMinutesPSAbnormalReleasesIndicator.removeClass("circle-critical");
                        _4gEstablishmentSuccessRateIndicator.removeClass("circle-critical");
                        _4gMinutesBetweenERABAbnormalIndicator.removeClass("circle-critical");

                        _2gCallMinutesBetweenDropIndicator.removeClass("circle-normal");
                        _2gRanCallSetUpSuccessRateSpeechIndicator.removeClass("circle-normal");
                        _3gRanCallSetUpSuccessRateSpeechIndicator.removeClass("circle-normal");
                        _3gRanPSAccessibilityIndicator.removeClass("circle-normal");
                        _3gCallMinutesBetweenDropIndicator.removeClass("circle-normal");
                        _3gMinutesPSAbnormalReleasesIndicator.removeClass("circle-normal");
                        _4gEstablishmentSuccessRateIndicator.removeClass("circle-normal");
                        _4gMinutesBetweenERABAbnormalIndicator.removeClass("circle-normal");


                        if( _2gcallMinutesBetweenDropVal < response.kpi2g.baseLine1RANCallSetupSuccessRate ){
                            _2gCallMinutesBetweenDropIndicator.addClass("circle-critical");                           
                        }else{
                            _2gCallMinutesBetweenDropIndicator.addClass("circle-normal");
                        }
                        
                        if( _2grancallSetupSuccessRateVal < response.kpi2g.baseLine1CallMinutesBetweenDrop ){
                            _2gRanCallSetUpSuccessRateSpeechIndicator.addClass("circle-critical");
                            
                        }else{
                            _2gRanCallSetUpSuccessRateSpeechIndicator.addClass("circle-normal");
                        }

                        if( _3gcallMinutesBetweenDropVal < response.kpi3g.baseLine1CallMinutesBetweenDrop ){ 
                            _3gCallMinutesBetweenDropIndicator.addClass("circle-critical");
                            
                        }else{
                            _3gCallMinutesBetweenDropIndicator.addClass("circle-normal");
                        }
                        
                        if( _3grancallSetupSuccessRateVal < response.kpi3g.baseLine1RANCallSetupSuccessRate ){
                            _3gRanCallSetUpSuccessRateSpeechIndicator.addClass("circle-critical");
                          
                        }else{
                            _3gRanCallSetUpSuccessRateSpeechIndicator.addClass("circle-normal");
                        }
                        
                        if( _3granminutesBetweenPSAbnormalReleasesVal < response.kpi3g.baseLine1RANMinutesBetweenPSAbnormalReleases ){ 
                            _3gMinutesPSAbnormalReleasesIndicator.addClass("circle-critical");
                            
                        }else{
                            _3gMinutesPSAbnormalReleasesIndicator.addClass("circle-normal");
                        }        
                        
                        if( _3granpsaccessibilityVal < response.kpi3g.baseLine1RANPSAccessibility ){
                            _3gRanPSAccessibilityIndicator.addClass("circle-critical");
                           
                        }else{
                            _3gRanPSAccessibilityIndicator.addClass("circle-normal");
                        }        
                        
                        if( _4gestablishmentSuccessRateVal < response.kpi4g.baseLine1EstablishmentSuccessRate ){
                            _4gEstablishmentSuccessRateIndicator.addClass("circle-critical");
                             
                        }else{
                            _4gEstablishmentSuccessRateIndicator.addClass("circle-normal");
                        } 
                        
                        if( _4gminutesBetweenERABAbnormalReleasesVal < response.kpi4g.baseLine1MinutesBetweenERABAbnormalReleases ){
                            _4gMinutesBetweenERABAbnormalIndicator.addClass("circle-critical");                             
                        }else{
                            _4gMinutesBetweenERABAbnormalIndicator.addClass("circle-normal");  
                        } 
                        
                    }
                    else{
                        alert("error while parsing kqi data from server");
                    }

                }
            });            
        }


        var reloadKQI = function(){

            $.ajax({
                url : "news/kqi",
                method : "GET",
                dataType : "json",
                contentType : "application/json",
                success : function( response ){

                    if( response !== undefined ){
                        var videoStreamingSuccessRate = response.videoStreamingKQI.videoStreamingSuccessRate;
                        var videoStreamingStartDelay = response.videoStreamingKQI.videoStreamingStartDelay;
                        var pageBrowsingSuccessRate = response.pageBrowsingKQI.pageBrowsingSuccessRate;
                        var pageBrowsingDelay = response.pageBrowsingKQI.pageBrowsingDelay;

                        //push them zzz
                        videoStreamingStartDelayValue.html( videoStreamingStartDelay + " ms");
                        videoStreamingStartSuccessRateValue.html( videoStreamingSuccessRate + " %" );
                        pageBrowsingDelayValue.html( pageBrowsingDelay + " ms" );
                        pageBrowsingSuccessRateValue.html( pageBrowsingSuccessRate + " %" );

                        //change indicators base on kqi value
                        videoStreamingStartDelayIndicator.removeClass("circle-critical");
                        videoStreamingStartSuccessRateIndicator.removeClass("circle-critical");
                        pageBrowsingDelayIndicator.removeClass("circle-critical");
                        pageBrowsingSuccessRateIndicator.removeClass("circle-critical");
                        
                        videoStreamingStartDelayIndicator.removeClass("circle-normal");
                        videoStreamingStartSuccessRateIndicator.removeClass("circle-normal");
                        pageBrowsingDelayIndicator.removeClass("circle-normal");
                        pageBrowsingSuccessRateIndicator.removeClass("circle-normal");
                        
                        
                        
                        if( videoStreamingStartDelay > response.videoStreamingKQI.videoStreamingStartDelayBaseLine ){
                            videoStreamingStartDelayIndicator.addClass("circle-critical");
                        }
                        else{
                            videoStreamingStartDelayIndicator.addClass("circle-normal");
                        }

                        if( videoStreamingSuccessRate < response.videoStreamingKQI.videoStreamingSuccessRateBaseLine ){
                            videoStreamingStartSuccessRateIndicator.addClass("circle-critical");
                        }
                        else{
                            videoStreamingStartSuccessRateIndicator.addClass("circle-normal");
                        }

                        if( pageBrowsingDelay > response.pageBrowsingKQI.pageBrowsingDelayBaseLine ){
                            pageBrowsingDelayIndicator.addClass("circle-critical");
                        }
                        else{
                            pageBrowsingDelayIndicator.addClass("circle-normal");
                        }

                        if( pageBrowsingSuccessRate < response.pageBrowsingKQI.pageBrowsingSuccessRateBaseLine ){
                            pageBrowsingSuccessRateIndicator.addClass("circle-critical");
                        }
                        else{
                            pageBrowsingSuccessRateIndicator.addClass("circle-normal");
                        }
                    }
                    else{
                        alert("error while parsing kqi data from server");
                    }
                }
            });
        };
        
        var getKQITopWorstCells = function(kqi,ne,handler){
            $("#worst_cell_kqi").parent(".table-responsive").find(".frameloading").css({top:"50%",left:"20%"});
            $("#worst_cell_kqi").parent(".table-responsive").find(".frameloading").fadeIn();
            $.ajax({
                url : "news/kqi/"+kqi+"/"+ne,
                method : "GET",
                dataType : "JSON",
                success: function( response ){
                    handler(response);
                }
            });
            $("#worst_cell_kqi").parent(".table-responsive").find(".frameloading").fadeOut();
        }
       
       $("a.ne-link").click(function(evt){
           evt.preventDefault();
           $("a.ne-link").removeClass("ne-active");
           var ne = $(this).data("ne");
           currentKQINe = ne;
           getKQITopWorstCells(currentKQISelected,ne,function(response){
                $("#worst_cell_kqi > tbody").html("");
                $.each(response,function(i,v){
                    var row = "<tr>"+
                                "<td><a href='#' class='frame-link' data-type='kqi-cell' data-kqi='"+currentKQISelected+"' data-cell='"+v.cellName+"'>"+( v.cellName == null ? "CELL UNDEFINED" : v.cellName )+"</a></td>"+
                                "<td>"+v.value+"</td>"+
                            "</tr>";
                    $("#worst_cell_kqi > tbody").append( row );  
                });                
           });
           
           $(this).addClass("ne-active");
       });
        
	$(document).ready(function(){
            init();
            normalizeMapBasedOnScreenSize();
            
            loadGoldenSite();
            reloadAlarm();
            reloadKPI();
            reloadKQI();
            
            setInterval(reloadAlarm,60000);
            setInterval(reloadKPI(),60000);
            setInterval(reloadKQI,60000); 
            
            goldenSiteInterval = setInterval(loadGoldenSiteSilent,60000);
            
            $("#content-wrapper").append('<div class="loading"><img src="assets/img/hourglass.gif"/></div>');
            
            slideFrameUp(0);
            
        });
        
        
        
});