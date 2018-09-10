// 今日指向地点 柱状图
$('#todayPointPlace').highcharts({
    chart: {
        type: 'column',
        marginTop: 20
    },
    title: {
        text: null
    },
    xAxis: {
        categories: ['天安门', '中南海', '首长驻地', '使馆区', '市政府周边', '民政局', '其他'],
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
        align: 'right',
        verticalAlign: 'top',
        y: -15
    },
    tooltip: {
        // pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.percentage:.1f}%</b> ({point.y:,.0f} millions)<br/>'
    },
    series: [{
        name: '线索数量',
        color: '#ffb980',
        data: [99,58,69,120,45,180,220]
    }]
});

// 历史指向地点 柱状图
$('#pointPlace').highcharts({
    chart: {
        type: 'column',
        marginTop: 20
    },
    title: {
        text: null
    },
    xAxis: {
        categories: ['天安门', '中南海', '首长驻地', '使馆区', '市政府周边', '民政局', '其他'],
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
        align: 'right',
        verticalAlign: 'top',
        y: -15
    },
    tooltip: {
        // pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.percentage:.1f}%</b> ({point.y:,.0f} millions)<br/>'
    },
    series: [{
        name: '线索数量',
        data: [99,58,69,120,45,180,220]
    }]
});

// 指向群体占比 饼图
$('#startHighchart').highcharts({
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
                distance: 15,
                format: '{point.percentage:.0f} %',
                style: {
                    color:  'black'
                }
            }
        }
    },
    legend: {
        itemWidth: 110
    },
    series: [{
        name: null,
        data: [
            ['政策',   7],
            ['小区业主',   10],
            ['维权',   17],
            ['涉众型经济案件',   4],
            ['潜在利益群体',   7],
            ['企业职工',   7],
            ['利益受损',   3],
            ['拆迁',   35],
            ['案件',   3],
            ['其他',   7]
        ]
    }]
});


// 分类占比 饼图
$('#categoryProportion').highcharts({
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
                distance: 15,
                format: '{point.percentage:.0f} %',
                style: {
                    color:  'black'
                }
            }
        }
    },
    legend: {
        itemWidth: 110
    },
    series: [{
        name: null,
        data: [
            ['涉防类',   7],
            ['刑事治安案件类',   10],
            ['政治安全类',   17],
            ['敏感活动类',   4],
            ['暴恐类',   7],
            ['其他类',   7]
        ]
    }]
});
