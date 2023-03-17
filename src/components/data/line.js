export default {
    color: ['#e72ccc', '#666', '#5470c6', '#ccc', '#ddd', '#aaa', '#ee6666', '#73c0de', '#3ba272', '#fc8452', '#9a60b4', '#ea7ccc'],
    title: {
        text: "" /*"Title"*/ ,
        left: "center",
        top: "top",
        textStyle: {
            fontFamily: 'Inter, "Helvetica Neue", Arial, sans-serif',
            fontSize: 14
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