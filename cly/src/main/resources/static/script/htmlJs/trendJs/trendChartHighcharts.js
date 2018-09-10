// 进京情况监测及展示 按日统计 柱状图
$('#toBeijing-day-column').highcharts({
    chart: {
        type: 'column',
        marginTop: 20
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
            width: 2,
            value: 90,
            zIndex: 2
        }]
    },
    legend: {
        align: 'right',
        verticalAlign: 'top',
    },
    tooltip: {
        // pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.percentage:.1f}%</b> ({point.y:,.0f} millions)<br/>'
    },
    series: [{
        name: '哈哈',
        // color: '#ffb980',
        data: [
            {y: 99},
            {y: 58},
            {y: 69},
            {y: 120, color: '#eada0f'},
            {y: 45},
            {y: 180, color: '#ff0000'},
            {y: 220, color: '#ff0000'},
            {y: 140},
            {y: 60},
            {y: 88}
        ]
        // [99, 58, 69, 120, 45, 180, 220, 140, 60, 88]
    }]
});

// 进京情况监测及展示 按日统计 饼图
$('#toBeijing-day-pie').highcharts({
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
            dataLabels: {
                enabled: true,
                format: '{point.name}: <br>{point.percentage:.1f} %',
                style: {
                    color:  'black'
                }
            }
        }
    },
    series: [{
        name: null,
        data: [
            ['铁路订票',   45],
            ['民航进京',   15],
            ['长途场站闸机',   33],
            ['办理进京证',   7]
        ]
    }]
});

// 进京情况监测及展示 按时统计 柱状图
$('#toBeijing-time-column').highcharts({
    chart: {
        type: 'column',
        marginTop: 20
    },
    title: {
        text: null
    },
    xAxis: {
        categories: ['0时', '1时', '2时', '3时', '4时', '5时', '6时', '7时', '8时', '9时', '10时', '11时', '12时', '13时', '14时', '15时', '16时', '17时', '18时', '19时', '20时', '21时', '22时', '23时'],
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
        enabled: false,
        align: 'right',
        verticalAlign: 'top',
    },
    tooltip: {
        // pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.percentage:.1f}%</b> ({point.y:,.0f} millions)<br/>'
    },
    series: [{
        name: '哈哈',
        data: [1,2,4,2,3,5,6,9,4,2,7,5,3,6,5,8,4,6,8,1,5,8,4,6]
    }]
});

// 进京情况监测及展示 按时统计 饼图
$('#toBeijing-time-pie').highcharts({
    chart: {
        type: 'pie'
    },
    title: {
        text: null
    },
    plotOptions: {
        pie: {
            cursor: 'pointer',
            dataLabels: {
                enabled: true,
                format: '{point.name}: <br>{point.percentage:.1f} %',
                style: {
                    color:  'black'
                }
            }
        }
    },
    series: [{
        name: null,
        data: [
            ['铁路订票',   45],
            ['民航进京',   15],
            ['长途场站闸机',   33],
            ['办理进京证',   7]
        ]
    }]
});

// 在京情况监测及展示 按日统计 折线图
$('#inBeijing-day-line').highcharts({
    chart: {
        type: 'line',
        marginTop: 20
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
            // dashStyle: 'shortDash',
            width: 2,
            value: 90,
            zIndex: 2
        }]
    },
    legend: {
        align: 'right',
        verticalAlign: 'top',
    },
    tooltip: {
        // pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.percentage:.1f}%</b> ({point.y:,.0f} millions)<br/>'
    },
    series: [{
        name: '哈哈',
        // color: '#ffb980',
        data: [99, 58, 69, 120, 45, 180, 220, 140, 60, 88]
    }]
});

// 在京情况监测及展示 按日统计 柱状图
$('#inBeijing-day-column').highcharts({
    chart: {
        type: 'column',
        marginTop: 20
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
            // dashStyle: 'shortDash',
            width: 2,
            value: 90,
            zIndex: 2
        }]
    },
    legend: {
        align: 'right',
        verticalAlign: 'top',
    },
    tooltip: {
        // pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.percentage:.1f}%</b> ({point.y:,.0f} millions)<br/>'
    },
    series: [{
        name: '哈哈',
        // color: '#ffb980',
        data: [99, 58, 69, 120, 45, 180, 220, 140, 60, 88]
    }]
});

// 在京情况监测及展示 按日统计 饼图
$('#inBeijing-day-pie').highcharts({
    chart: {
        type: 'pie'
    },
    title: {
        text: null
    },
    plotOptions: {
        pie: {
            cursor: 'pointer',
            dataLabels: {
                enabled: true,
                format: '{point.name}: <br>{point.percentage:.1f} %',
                style: {
                    color:  'black'
                }
            }
        }
    },
    series: [{
        name: null,
        data: [
            ['铁路订票',   45],
            ['民航进京',   15],
            ['长途场站闸机',   33],
            ['办理进京证',   7]
        ]
    }]
});


// 在京情况监测及展示 按时统计 折线图
$('#inBeijing-time-line').highcharts({
    chart: {
        type: 'line',
        marginTop: 20
    },
    title: {
        text: null
    },
    xAxis: {
        categories: ['0时', '1时', '2时', '3时', '4时', '5时', '6时', '7时', '8时', '9时', '10时', '11时', '12时', '13时', '14时', '15时', '16时', '17时', '18时', '19时', '20时', '21时', '22时', '23时'],
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
        enabled: false,
        align: 'right',
        verticalAlign: 'top',
    },
    tooltip: {
        // pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.percentage:.1f}%</b> ({point.y:,.0f} millions)<br/>'
    },
    series: [{
        name: '哈哈',
        data: [1,2,4,2,3,5,6,9,4,2,7,5,3,6,5,8,4,6,8,1,5,8,4,6]
    }]
});

// 在京情况监测及展示 按时统计 柱状图
$('#inBeijing-time-column').highcharts({
    chart: {
        type: 'column',
        marginTop: 20
    },
    title: {
        text: null
    },
    xAxis: {
        categories: ['0时', '1时', '2时', '3时', '4时', '5时', '6时', '7时', '8时', '9时', '10时', '11时', '12时', '13时', '14时', '15时', '16时', '17时', '18时', '19时', '20时', '21时', '22时', '23时'],
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
        enabled: false,
        align: 'right',
        verticalAlign: 'top',
    },
    tooltip: {
        // pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.percentage:.1f}%</b> ({point.y:,.0f} millions)<br/>'
    },
    series: [{
        name: '哈哈',
        data: [1,2,4,2,3,5,6,9,4,2,7,5,3,6,5,8,4,6,8,1,5,8,4,6]
    }]
});

// 在京情况监测及展示 按时统计 饼图
$('#inBeijing-time-pie').highcharts({
    chart: {
        type: 'pie',
    },
    title: {
        text: null
    },
    plotOptions: {
        pie: {
            cursor: 'pointer',
            dataLabels: {
                enabled: true,
                format: '{point.name}: <br>{point.percentage:.1f} %',
                style: {
                    color:  'black'
                }
            }
        }
    },
    series: [{
        name: null,
        data: [
            ['铁路订票',   45],
            ['民航进京',   15],
            ['长途场站闸机',   33],
            ['办理进京证',   7]
        ]
    }]
});