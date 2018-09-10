Highcharts.theme = {
    colors:["#5ab1ef",
            "#ffb980",
            "#d87a80",
            "#7fc481",
            "#ff5d7c",
            "#8d98b3",
            "#e5cf0d",
            "#97b552"
        ]
        
    }
// Apply the theme
Highcharts.setOptions(Highcharts.theme);

Highcharts.setOptions({
        chart: {
            backgroundColor: 'none'
        },
        title: {
            style: {
                color: '#666',
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
                    color: '#666',
                    useHTML: true // 可以去掉字体的模糊样式
                }
            },
            column: {
                borderRadius: 3, // 柱状图圆角设置
                borderWidth: 0,  // 柱子的边框线
                dataLabels: {
                    enabled: true,
                    color: '#666',
                    useHTML: true // 可以去掉字体的模糊样式
                }
            },
            pie: {
                cursor: 'pointer',
                showInLegend: true,
                dataLabels: {
                    color: '#666',
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
                    color: '#666',
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
                    color: '#777'
                }
            },
            title: {
                style: {
                    color: '#666'
                }
            }
        },
        yAxis: {
            gridLineWidth: 1,  // 网格线宽度
            gridLineColor: '#e6e6e6',  // 网格线颜色
            lineColor: '#aaa',
            tickColor: '#aaa',  // 刻度线颜色
            tickLength: 5,  // 刻度线长度
            labels: {
                style: {
                    fontSize: '13px',
                    fontFamily: 'Verdana, sans-serif',
                    color: '#777'
                }
            },
            title: {
                align: 'middle',
                style: {
                    color: '#666',
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
                color: '#666'
            },
            itemHoverStyle: {
                color: '#666'
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