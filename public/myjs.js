function dbInit()
{
    var db = openDatabase('testDB', '1.0', 'Test DB', 2 * 1024 * 1024);
    var msg;
    db.transaction(function (context) {
        context.executeSql('CREATE TABLE IF NOT EXISTS testTable (id unique, name)');
        context.executeSql('INSERT INTO testTable (id, name) VALUES (0, "Byron")');
        context.executeSql('INSERT INTO testTable (id, name) VALUES (1, "Casper")');
        context.executeSql('INSERT INTO testTable (id, name) VALUES (2, "Frank")');
    });

    db.transaction(function (context) {
        context.executeSql('SELECT * FROM testTable', [], function (context, results) {
            var len = results.rows.length, i;
            console.log('Got '+len+' rows.');
            for (i = 0; i < len; i++){
                console.log('id: '+results.rows.item(i).id);
                console.log('name: '+results.rows.item(i).name);
            }
        });
    });
}

$(function () {
    var audio = document.getElementById('audio_player');
    audio.pause();

    Highcharts.setOptions({
        global: {
            useUTC: false
        }
    });

    var chart;
    $('#container').highcharts({
        chart: {
            type: 'spline',
            backgroundColor: {
                linearGradient: [0, 0, 500, 500],
                stops: [
                    [0, 'rgb(255, 255, 255)'],
                    [1, 'rgb(200, 200, 255)']
                ]
            },
            animation: Highcharts.svg,
            marginRight: 10,
            events: {
                load:  function(){
                    var series = this.series[0];
                    var series1 = this.series[1];

                    $("#status").html("设备正在连接中......");
                    var ws = new WebSocket('ws://'+"192.168.43.189"+':81/', ['arduino']);//location.hostname
                    $("#bt").click(function(){
                        var arr={};
                        arr.P16=15;
                        arr.P2="P2";
                        ws.send(JSON.stringify(arr));
                        alert(JSON.stringify(arr));
                    })
                    ws.onopen = function(){$("#status").html('设备已连接');}
                    ws.onmessage = function (evt)
                    {
                        var data=JSON.parse(evt.data);

                        $("#time").html("时间:"+data.modPara.time);
                        $("#date").html("日期:"+data.modPara.date);
                        $("#dhttemp").html("环境温度:"+data.modPara.dhttemp);
                        $("#dhthumi").html("环境湿度:"+data.modPara.dhthumi);
                        $("#num").html("在线数量:"+data.modPara.num);
                        $("#adc").html("模拟采集:"+data.modPara.adc);

                        var pv="";
                        if(data.modPara.port===1) pv="开";
                        else pv="关";

                        $("#port").html("端口:"+pv);

                        $("#temp").html(data.dispPara.temp);
                        $("#humi").html(data.dispPara.humi);
                        $("#speed").html(data.dispPara.speed);
                        $("#pressure").html(data.dispPara.pressure);
                        $("#tm").html(data.dispPara.time);
                        $("#illum").html(data.dispPara.illum);
                        $("#concent").html(data.dispPara.concent);
                        $("#alarm").html(data.dispPara.alarm);

                        var x = (new Date()).getTime();
                        y=data.dispPara.temp;
                        series.addPoint([x, y], true, true);
                    };
                    ws.onerror = function(){$("#status").html('设备连接出错');}
                    ws.onclose = function(){ $("#status").html('设备连接关闭');}
                }
            }
        },
        title: {
            text: '实验室温度数据'
        },
        subtitle: {
            text: '环境温湿度',
            x: -20
        },
        xAxis: {
            type: 'datetime',
            tickPixelInterval: 50
        },

        yAxis: [{ // Primary yAxis
            labels: {
                formatter: function() {
                    return this.value +'°C';
                },
                style:
                {
                    color: '#89A54E'
                }
            },
            title: {
                text: 'Temperature',
                style: {
                    color: '#89A54E'
                }
            },
            opposite: true
        },{ // Primary yAxis
            labels: {
                formatter: function() {
                    return this.value +'%RH';
                },
                style:
                {
                    color: '#89A54E'
                }
            },
            title: {
                text: 'Temperature',
                style: {
                    color: '#89A54E'
                }
            },
            opposite: true
        }],
        tooltip: {
            shared: true
        },
        legend: {
            enabled: true
        },
        plotOptions:{
            spline:{
                lineWidth:1,
                states:{
                    hover:{
                        lineWidth:5
                    }
                },
                marker:{
                    enabled:true
                },
                enableMouseTracking: true
            }
        },
        series: [{
            name: '温度',
            data: (function() {
                // generate an array of random data
                var data = [],
                    time = (new Date()).getTime(),
                    i;

                for (i = -19; i <= 0; i++) {
                    data.push({
                        x: time + i * 1000,
                        y: i
                    });
                }
                return data;
            })(),
            tooltip: { valueSuffix: ' ℃' }
        },{
            name: '湿度',
            data: (function() {
                var data = [],
                    time = (new Date()).getTime(),
                    i;
                for (i = -19; i <= 0; i++) {
                    data.push({
                        x: time + i * 1000,
                        y:i
                    });
                }
                return data;
            })(),
            tooltip: { valueSuffix: ' ℃' }
        }]
    });
});
