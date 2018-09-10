Highcharts.theme = {
    colors:["#5ab1ef",
            "#ffb980",
            "#d87a80",
            "#7fc481",
            "#E43254",
            "#eca5c2",
            "#e5cf0d",
            "#97b552",
            "#4bcdec",
            "#cdaee8"
        ]
        
    }

// 浅色皮肤时，文字颜色为黑色
var textColor = '#fff';
var skin = localStorage.getItem('defaultLink');
if(skin == 'lightSkin'){
    textColor = '#000'
};


// Apply the theme
Highcharts.setOptions(Highcharts.theme);
Highcharts.setOptions({
        chart: {
            backgroundColor: 'none'
        },
        title: {
            style: {
                color: textColor,
                fontSize: '18px'
            }
        },
        credits: {
            enabled: false
        },
        plotOptions: {  // 数据列配置
            bar: {
                borderRadius: 3, // 柱状图圆角设置
                borderWidth: 0,  // 柱子的边框线
                dataLabels: {
                    enabled: true,
                    color: textColor,
                    useHTML: true // 可以去掉字体的模糊样式
                }
            },
            column: {
                borderRadius: 3, // 柱状图圆角设置
                borderWidth: 0,  // 柱子的边框线
                dataLabels: {
                    enabled: true,
                    color: textColor,
                    useHTML: true // 可以去掉字体的模糊样式
                }
            },
            pie: {
                cursor: 'pointer',
                showInLegend: true,
                borderWidth: 0,
                dataLabels: {
                    color: textColor,
                    useHTML: true, // 可以去掉字体的模糊样式
                    style: {
                        fontWeight: '100'
                    }
                }
            },
            line: {
                dataLabels: {
                    enabled: true          // 开启数据标签
                },
                enableMouseTracking: true, // 关闭鼠标跟踪，对应的提示框、点击事件会失效
                dataLabels: {
                    color: textColor,
                    useHTML: true // 可以去掉字体的模糊样式
                }
            }
        },
        xAxis: {
            gridLineWidth: 0,  // 网格线宽度
            lineColor: '#aaa',  // 轴线颜色
            tickColor: '#aaa',
            // tickmarkPlacement: 'on', 刻度线位置
            labels: {
                style: {
                    fontSize: '13px',
                    fontFamily: 'Verdana, sans-serif',
                    color: textColor
                }
            },
            title: {
                style: {
                    color: textColor
                }
            }
        },
        yAxis: {
            gridLineWidth: 1,  // 网格线宽度
            gridLineColor: '#3F6175',  // 网格线颜色
            lineColor: '#aaa',
            tickColor: '#aaa',  // 刻度线颜色
            tickLength: 5,  // 刻度线长度
            labels: {
                style: {
                    fontSize: '13px',
                    fontFamily: 'Verdana, sans-serif',
                    color: textColor
                }
            },
            title: {
                align: 'middle',
                style: {
                    color: textColor,
                    fontSize: '16px'
                }
            }
        }, 
        legend: {
            enabled: true,  // 是否显示图例
            symbolHeight: 12,  // 图例的图标大小 
            symbolWidth: 12,
            symbolRadius: 3,  // 图例的图标圆角
            y: 10,
            itemStyle: {  // 图例的文字样式
                color: textColor
            },
            itemHoverStyle: {
                color: textColor
            }
        },
        exporting: {
            enabled: false // 是否显示导出按钮
        },
        tooltip: {
            style: {
                fontSize: '13px'
            }
        }
    })