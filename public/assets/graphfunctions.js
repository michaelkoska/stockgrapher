const API_KEY = "NM1Y1V5Z1ZNGMQ66";
//svg width and height will need to be changed for dynamic/responsiveness
var svgWidth = 600;
var svgHeight = 1000;
var barWidth = 2;
 
//as of now, this is a simple app and only symbol and time series have relevance
class InputValues {
	constructor(timeSeries, symbol){
		this.timeSeries = timeSeries;
		this.symbol = symbol;
	}
}

//this will grab the input data and send an API request
d3.select("form")
	.on("submit", function(){
		d3.event.preventDefault();
		var newInput = getInputValues();
		var data = getData(newInput);
	})


function getData({timeSeries, symbol}){
	var url = `https://www.alphavantage.co/query?function=${timeSeries}&symbol=${symbol}&apikey=${API_KEY}`
	axios
		.get(url)
		.then((response) => {
			getClosePrices(response.data, timeSeries);
			return response.data;
		})
		.catch((error) => {
			console.log(error);
		})
}

function getInputValues(){
		var symbol = d3.select("input").property("value");
		var timeSeries = d3.select("select").property("value");
		return new InputValues(timeSeries, symbol);
	}

function getClosePrices(data, timeSeries){
	var occurrence = (timeSeries === "TIME_SERIES_DAILY") ? "Time Series (Daily)" : (timeSeries === "TIME_SERIES_WEEKLY") ? "Weekly Time Series" : "Monthly Time Series";
	//occurence is used to find the key because the key is not built well
	//for a good string build--Weekly and Monthly are prepended in the key
	//while daily is appended at the end--if types are added, then finding
	//a way to look up the key more dynamically should be reconsidered
	var priceData = [];

	//because the key is a date, the will be constantly changing
	//this probably is not the fastest way, but it is a sure-fire way to work
	//at this time, I am unable to find a better way
	var objectSize = Object.keys(data[occurrence]).length;
	var closePrice = data[occurrence][Object.keys(data[occurrence])[objectSize - 1]]["4. close"];
	for(let i = objectSize; i > 0; i--){
		priceData.push(data[occurrence][Object.keys(data[occurrence])[objectSize - i]]["4. close"]);
	}

	var maxPrice = Math.max.apply(Math, priceData)
	var minPrice = Math.min.apply(Math, priceData);

	graphSVG(priceData, maxPrice, minPrice);
}

function graphSVG(d, max, min){
	console.log(max)
	console.log(min)
	var barHeightUnit = 1000 / (max - min);
	console.log(barHeightUnit)
	d3.selectAll("rect")
		.remove();
	//here is a good spot to have a function return screensize to determing svg size
	d3.select("svg")
		.attr("height", svgHeight)
		.attr("width", svgWidth)
	  .selectAll("rect")
	  .data(d)
		.enter()
		.append("rect")
			.attr("height", function(d){
				return (d - min) * barHeightUnit;
			})
			.attr("width", barWidth)
			.attr("y", function(d){
				console.log(d);
				return svgHeight - ((d - min) * barHeightUnit);
			})
			.attr("x", function(d, i){
				return barWidth * i;
			})
			.attr("fill", "purple");
}
