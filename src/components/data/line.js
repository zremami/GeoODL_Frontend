export default {
    color: [
        '#e3b605' /*upper*/,
        '#e3b605' /*lower*/,
        /*'#f7e452' mean,*/
        '#79ed81' /*min*/,
        '#ed7979' /*max*/,
        '#73c0de' /*precipitation*/,
        '#b32291' /*prediction*/,
        '#666' /*real*/ 
    ],
    title: {
        text: "" /*"Title"*/ ,
        left: "center",
        top: "top",
        textStyle: {
            fontFamily: 'Inter, "Helvetica Neue", Arial, sans-serif',
            fontSize: 18
        },
    },
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'cross',
            animation: true,
        },
    },
    legend: {
        orient: "horizontal",
        left: "center",
        top: "bottom",
        data: []
    },
    grid: {
        left: '10%',
        right: '10%',
        bottom: '15%',
        containLabel: false
    },
    toolbox: {
        show: true,
        orient: 'vertical',
        left: 'right',
        top: 'center',
        feature: {
            mark: { show: true },
            dataView: { show: true, readOnly: false },
            magicType: { show: true, type: ['line', 'bar'] },
            restore: { show: true },
            saveAsImage: { show: true },
            dataZoom: { show: true },
            brush: { show: true },
        }
    },
    xAxis: [{
        type: 'category',
        axisTick: {
            alignWithLabel: false
          },
        data: [], /* [2012, 2013, 2014, 2015, 2016]*/
        axisLabel: {
            formatter: function (timestamp, idx) {
                var date = new Date(timestamp);
                return idx === 0
                ? timestamp
                : [date.getMonth() + 1, date.getDate()].join('-');
            }
        },
        boundaryGap: true
    }],
    yAxis: [
        {
        type: 'value',
        name: '', /*'X Axis'*/ 
        }
    ],
    series: []
};