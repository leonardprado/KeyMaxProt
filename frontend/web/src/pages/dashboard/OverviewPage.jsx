import React, { useEffect } from 'react';
import Chart from 'react-apexcharts';
import { Card, Typography } from '@material-tailwind/react';

const barChartOptions = {
  series: [{
    name: "Sales",
    data: [50, 40, 300, 320, 500, 350, 200, 230, 500],
  }],
  chart: {
    type: "bar",
    height: 350,
    toolbar: {
      show: false,
    },
  },
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: "55%",
      endingShape: "rounded",
    },
  },
  dataLabels: {
    enabled: false,
  },
  stroke: {
    show: true,
    width: 2,
    colors: ["transparent"],
  },
  xaxis: {
    categories: ["Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct"],
  },
  yaxis: {
    title: {
      text: "$ (thousands)",
    },
  },
  fill: {
    opacity: 1,
  },
  tooltip: {
    y: {
      formatter: function (val) {
        return "$ " + val + " thousands";
      },
    },
  },
};

const lineChartOptions = {
  series: [{
    name: "Desktops",
    data: [10, 41, 35, 51, 49, 62, 69, 91, 148]
  }],
  chart: {
    height: 350,
    type: 'line',
    zoom: {
      enabled: false
    }
  },
  dataLabels: {
    enabled: false
  },
  stroke: {
    curve: 'smooth'
  },
  grid: {
    row: {
      colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
      opacity: 0.5
    },
  },
  xaxis: {
    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
  }
};

const pieChartOptions = {
  series: [44, 55, 13, 43, 22],
  chart: {
    width: 380,
    type: 'pie',
  },
  labels: ['Team A', 'Team B', 'Team C', 'Team D', 'Team E'],
  responsive: [{
    breakpoint: 480,
    options: {
      chart: {
        width: 200
      },
      legend: {
        position: 'bottom'
      }
    }
  }]
};

const OverviewPage = () => {
  useEffect(() => {


    // No need to manually render or destroy charts when using react-apexcharts
    // The Chart component handles this internally.
    // The options are passed directly to the Chart component in the JSX.
    return () => {};
  }, []);

  return (
    <div className="p-4">
      <Typography variant="h4" color="blue-gray" className="mb-4">
        Dashboard Overview
      </Typography>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Placeholder for charts */}
        <Card className="p-4">
          <Typography variant="h6" color="blue-gray">
            Bar Chart
          </Typography>
          <Chart options={barChartOptions} series={barChartOptions.series} type="bar" height={350} />
        </Card>
        <Card className="p-4">
          <Typography variant="h6" color="blue-gray">
            Line Chart
          </Typography>
          <Chart options={lineChartOptions} series={lineChartOptions.series} type="line" height={350} />
        </Card>
        <Card className="p-4">
          <Typography variant="h6" color="blue-gray">
            Pie Chart
          </Typography>
          <Chart options={pieChartOptions} series={pieChartOptions.series} type="pie" width={380} />
        </Card>
      </div>
    </div>
  );
};

export default OverviewPage;