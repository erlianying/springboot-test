// 图表样式初始化=============================
Highcharts.setOptions({
    chart: {
        backgroundColor: 'none'
    },
    title: {
        style: {
            color: '#fff',
            fontSize: '22px'
        }
    },
    colors: ['#00d9e1', '#e1b26f', '#f55971'],
    xAxis: {
        lineColor: '#447488',
        tickColor:　'#447488',
        labels: {
            style: {
                fontSize: '16px',
                fontFamily: 'Verdana, sans-serif',
                color: '#eee'
            }
        },
    },
    yAxis: {
        title: null,
        gridLineColor: '#03415a',
        labels: {
            style: {
                fontSize: '16px',
                fontFamily: 'Verdana, sans-serif',
                color: '#eee'
            }
        },
    },
    legend: {
        symbolPadding: 10,
        itemStyle: {  // 图例的文字样式
            color: '#eee',
            fontSize: '22px',
            fontWeight: 'normal'
        },
        itemHoverStyle: {
            color: '#eee',
            fontSize: '22px',
            fontWeight: 'normal'
        }
    },
    credits: {
        enabled: false
    },
    plotOptions: {
        pie: {
            cursor: 'pointer',
            borderWidth: 0,
            showInLegend: true,
            colors: ['#0db1ff', '#e1b26f', '#f06c80'],
            dataLabels: {
                enabled: true,
                distance: -20,
                useHTML: true,
                style: {
                    fontSize: '25px',
                    color:  '#fff'
                }
            }
        },
        column: {
            borderWidth: 0,
            borderRadius: 2,
            colors: ['#0096eb']
        }
    }
});
// 图表样式初始化=============================


// 未来10日线索指向情况  柱状图
$('#normalState1').highcharts({
    chart: {
        type: 'column',
        marginTop: 20
    },
    title: {
        text: null
    },
    xAxis: {
        categories: ['18日', '19日', '20日', '21日', '22日', '23日', '24日', '25日', '26日', '27日'],
        title: {
            enabled: false
        }
    },
    yAxis: {
        title: {
            text: null
        }
    },
    legend: {
        enabled: false
    },
    tooltip: {
        pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.percentage:.1f}%</b> ({point.y:,.0f} millions)<br/>'
    },
    series: [{
        name: null,
        // color: '#0aa6ef',
        data: [502, 635, 809, 947, 1402, 3634, 5268, 777, 888, 1504]
    }]
});


// 群体预警  气泡图
$('#normalState2').highcharts({
    chart: {
        type: 'bubble',
        zoomType: 'xy',
    },    
    colors: ['#41c2ff', '#18f7ff', '#8de158'],
    title: {
        text: null
    },
    series: [{
        name:'善心汇',
        // 每个气泡包含三个值，x，y，z；其中 x，y用于定位，z 用于计算气泡大小
        data: [[97, 36, 79], [94, 74, 60], [68, 76, 58], [64, 87, 56], [68, 27, 73], [74, 99, 42], [7, 93, 87], [51, 69, 40], [38, 23, 33], [57, 86, 31]]
    }, {
        name:'两参',
        data: [[25, 10, 87], [2, 75, 59], [11, 54, 8], [86, 55, 93], [5, 3, 58], [90, 63, 44], [91, 33, 17], [97, 3, 56], [15, 67, 48], [54, 25, 81]]
    }, {
        name:'E租宝',
        data: [[47, 47, 21], [20, 12, 4], [6, 76, 91], [38, 30, 60], [57, 98, 64], [61, 17, 80], [83, 60, 13], [67, 78, 75], [64, 12, 10], [30, 77, 82]]
    }]

});


// 地点预警  气泡图
$('#normalState3').highcharts({
    chart: {
        type: 'bubble',
        zoomType: 'xy',
    },
    colors: ['#41c2ff', '#18f7ff', '#fb5667'],
    title: {
        text: null
    },
    series: [{
        name:'善心汇',
        // 每个气泡包含三个值，x，y，z；其中 x，y用于定位，z 用于计算气泡大小
        data: [[97, 36, 79], [94, 74, 60], [68, 76, 58], [64, 87, 56], [68, 27, 73], [74, 99, 42], [7, 93, 87], [51, 69, 40], [38, 23, 33], [57, 86, 31]]
    }, {
        name:'两参',
        data: [[25, 10, 87], [2, 75, 59], [11, 54, 8], [86, 55, 93], [5, 3, 58], [90, 63, 44], [91, 33, 17], [97, 3, 56], [15, 67, 48], [54, 25, 81]]
    }, {
        name:'E租宝',
        data: [[47, 47, 21], [20, 12, 4], [6, 76, 91], [38, 30, 60], [57, 98, 64], [61, 17, 80], [83, 60, 13], [67, 78, 75], [64, 12, 10], [30, 77, 82]]
    }]

});


// 应急态 地点预警  气泡图
$('#emergentState1').highcharts({
    chart: {
        type: 'bubble',
        zoomType: 'xy',
        marginBottom: 100
    },    
    colors: ['#41c2ff', '#18f7ff', '#fb5667'],
    title: {
        text: null
    },
    legend: {
        y: 20
    },
    series: [{
        name:'天安门',
        // 每个气泡包含三个值，x，y，z；其中 x，y用于定位，z 用于计算气泡大小
        data: [[97, 36, 79], [94, 74, 60], [68, 76, 58], [64, 87, 56], [68, 27, 73], [74, 99, 42], [7, 93, 87], [51, 69, 40], [38, 23, 33], [57, 86, 31]]
    }, {
        name:'中南海',
        data: [[25, 10, 87], [2, 75, 59], [11, 54, 8], [86, 55, 93], [5, 3, 58], [90, 63, 44], [91, 33, 17], [97, 3, 56], [15, 67, 48], [54, 25, 81]]
    }, {
        name:'北京市局',
        data: [[47, 47, 21], [20, 12, 4], [6, 76, 91], [38, 30, 60], [57, 98, 64], [61, 17, 80], [83, 60, 13], [67, 78, 75], [64, 12, 10], [30, 77, 82]]
    }]

});



// 应急态  进京趋势分布  柱状图
$('#emergentState2').highcharts({
    chart: {
        type: 'column',
        marginBottom: 110  // 留出位置放图例
    },
    title: {
        text: null
    },
    xAxis: {
        categories: ['1月1日', '1月2日', '1月3日', '1月4日', '1月5日', '1月6日', '1月7日', '1月8日', '1月9日', '1月10日'],
        title: {
            enabled: false
        }
    },
    yAxis: {
        title: {
            text: null
        },
        plotLines: [{
            color: '#e28e10',
            width: 1,
            value: 90,
            zIndex: 2
        }]
    },
    legend: {
        enabled: false
    },
    tooltip: {
        // pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.percentage:.1f}%</b> ({point.y:,.0f} millions)<br/>'
    },
    series: [{
        name: '哈哈',
        borderWidth: 0, 
        borderRadius: 2, 
        // color: '#ffb980',
        data: [
        {y: 99},
        {y: 58},
        {y: 69},
        {y: 120, color: '#e1b26f'},
        {y: 45},
        {y: 180, color: '#f55971'},
        {y: 220, color: '#f55971'},
        {y: 140},
        {y: 60},
        {y: 88}
        ]
    }]
});




// 应急态  进京趋势分布  饼图
$('#emergentState3').highcharts({
    chart: {
        type: 'pie',
        marginTop: 20
    },
    title: {
        text: null
    },
    plotOptions: {
        pie: {
            cursor: 'pointer',
            borderWidth: 0,
            dataLabels: {
                enabled: true,
                format: '{point.percentage:.1f} %',
            },
            showInLegend: true
        }
    },
    legend: {
        align: 'center',
        layout: 'vertical',
        y: -20
    },
    series: [{
        name: null,
        size: '90%',
        innerSize: '50%',
        center: [100, 100],
        data: [
            ['住宿',   45],
            ['在京核录',   15],
            ['网吧上网',   33]
        ]
    }]
});


// 应急态  在京趋势分布  柱状图
$('#emergentState4').highcharts({
    chart: {
        type: 'column',
        marginBottom: 110  // 留出位置放图例
    },
    title: {
        text: null
    },
    xAxis: {
        categories: ['1月1日', '1月2日', '1月3日', '1月4日', '1月5日', '1月6日', '1月7日', '1月8日', '1月9日', '1月10日'],
        title: {
            enabled: false
        }
    },
    yAxis: {
        title: {
            text: null
        },
        plotLines: [{
            color: '#e28e10',
            // dashStyle: 'shortDash',  // 表示线样式
            width: 1,
            value: 90,
            zIndex: 2
        }]
    },
    legend: {
        enabled: false
    },
    tooltip: {
        // pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.percentage:.1f}%</b> ({point.y:,.0f} millions)<br/>'
    },
    series: [{
        name: '哈哈',
        borderWidth: 0, 
        borderRadius: 2, 
        data: [
        {y: 99},
        {y: 58},
        {y: 69},
        {y: 120, color: '#e1b26f'},
        {y: 45},
        {y: 180, color: '#f55971'},
        {y: 220, color: '#f55971'},
        {y: 140},
        {y: 60},
        {y: 88}
        ]
    }]
});




// 应急态  在京趋势分布  饼图
$('#emergentState5').highcharts({
    chart: {
        type: 'pie',
    },
    title: {
        text: null
    },
    plotOptions: {
        pie: {
            cursor: 'pointer',
            borderWidth: 0,
            dataLabels: {
                enabled: true,
                format: '{point.percentage:.1f} %'
            },
            showInLegend: true
        }
    },
    legend: {
        align: 'center',
        layout: 'vertical',
        y: -20
    },
    series: [{
        name: null,
        size: '90%',
        innerSize: '50%',
        data: [
            ['住宿',   45],
            ['在京核录',   15],
            ['网吧上网',   33]
        ]
    }]
});
