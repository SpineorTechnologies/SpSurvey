angular.module('spApp')
    .service('gaugeService', function() {
        this.GenerateChart = function(percentage) {
           // console.log(percentage)
            if (percentage !== undefined) {
                var needle;
                (function() {
                    var barWidth, chart, chartInset, degToRad, repaintGauge, height, margin, numSections, padRad, percToDeg, percToRad, percent, radius, sectionIndx, svg, totalPercent, width;
                    percent = percentage / 100;
                    numSections = 1;
                    sectionPerc = 1 / numSections / 2;
                    padRad = 0;
                    chartInset = 0;
                    // Orientation of gauge:
                    totalPercent = .75;

                    el = d3.select('.chart-gauge');
                   // console.log(d3.select('.chart-gauge'))
                    margin = {
                        top: 100,
                        right: 60,
                        bottom: 30,
                        left: 130
                    };
                    width = (el[0][0].offsetWidth - margin.left - margin.right);
                    height = width;
                    radius = Math.min(width, height) / 2;
                    barWidth = 40 * width / 300;
                   // console.log(radius, 'radius', barWidth)
                        /*
                          Utility methods 
                        */
                    percToDeg = function(perc) {
                        return perc * 360;
                    };
                    percToRad = function(perc) {
                        return degToRad(percToDeg(perc));
                    };
                    degToRad = function(deg) {
                        return deg * Math.PI / 180;
                    };
                    // Create SVG element
                    svg = el.append('svg').attr('width', width + margin.left + margin.right).attr('height', height + margin.top + margin.bottom);
                    // Add layer for the panel
                    chart = svg.append('g').attr('transform', "translate(" + ((width + margin.left) / 2) + ", " + ((height + margin.top) / 2) + ")");
                    chart.append('path').attr('class', "arc chart-filled");
                    chart.append('path').attr('class', "arc chart-empty");
                    valueText = chart.append("text")
                        .attr('id', "Value")
                        .attr("font-size", 16)
                        .attr("text-anchor", "middle")
                        .attr("dy", ".5em")
                        .style("fill", '#ffa12d');
                    formatValue = d3.format('1%');
                    arc2 = d3.svg.arc().outerRadius(radius - chartInset).innerRadius(radius - chartInset - (barWidth + 20))
                    arc1 = d3.svg.arc().outerRadius(radius - chartInset).innerRadius(radius - chartInset - (barWidth + 20))
                    repaintGauge = function(perc) {
                        var next_start = totalPercent;
                        arcStartRad = percToRad(next_start);
                        arcEndRad = arcStartRad + percToRad(perc / 2);
                        next_start += perc / 2;
                        arc1.startAngle(arcStartRad).endAngle(arcEndRad);
                        arcStartRad = percToRad(next_start);
                        arcEndRad = arcStartRad + percToRad((1 - perc) / 2);
                        arc2.startAngle(arcStartRad + padRad).endAngle(arcEndRad);
                        chart.select(".chart-filled").attr('d', arc1);
                        chart.select(".chart-empty").attr('d', arc2);
                    }
                    chart.append("text")
                        .text(function() {
                            return 'Poor';
                        })
                        .attr('id', 'scale0')
                        .attr('transform', "translate(" + (-((width / 2))) + ", " + ((20)) + ")")
                        .attr("font-size", 15)
                        .style("fill", "#a3a3a3");
                  //  console.log(el[0][0].offsetLeft)
                    chart.append("text")
                        .text(function() {
                            return 'Very Good';
                        })
                        .attr('id', 'scale1')
                        .attr('transform', "translate(" + (((width) / 2) - margin.right) + ", " + ((20)) + ")")
                        .attr("font-size", 15)
                        .style("fill", "#a3a3a3");
                    var Needle = (function() {
                        /** 
                         * Helper function that returns the `d` value
                         * for moving the needle
                         **/
                        var recalcPointerPos = function(perc) {
                            var centerX, centerY, leftX, leftY, rightX, rightY, thetaRad, topX, topY, textX, textY;
                            thetaRad = percToRad(perc / 2);
                            centerX = 0;
                            centerY = 0;
                            textX = -(self.len + 45) * Math.cos(thetaRad);
                            textY = -(self.len + 45) * Math.sin(thetaRad);
                            topX = centerX - this.len * Math.cos(thetaRad);
                            topY = centerY - this.len * Math.sin(thetaRad);
                            leftX = centerX - this.radius * Math.cos(thetaRad - Math.PI / 2);
                            leftY = centerY - this.radius * Math.sin(thetaRad - Math.PI / 2);
                            rightX = centerX - this.radius * Math.cos(thetaRad + Math.PI / 2);
                            rightY = centerY - this.radius * Math.sin(thetaRad + Math.PI / 2);
                            return "M " + leftX + " " + leftY + " L " + topX + " " + topY + " L " + rightX + " " + rightY;
                        };

                        function Needle(el) {
                            this.el = el;
                            this.len = width / 2;
                           // console.log(width)
                            this.radius = this.len / 10;
                        }
                        Needle.prototype.render = function() {
                            this.el.append('circle').attr('class', 'needle-center').attr('cx', 0).attr('cy', 0).attr('r', this.radius);
                            return this.el.append('path').attr('class', 'needle').attr('d', recalcPointerPos.call(this, 0));
                        };
                        Needle.prototype.moveTo = function(perc) {
                            var self, oldValue = this.perc || 0;
                            this.perc = perc;
                            self = this;
                            // Reset pointer position
                            this.el.transition().delay(100).ease('quad').duration(200).select('.needle').tween('reset-progress', function() {
                                return function(percentOfPercent) {
                                    var progress = (1 - percentOfPercent) * oldValue;
                                    repaintGauge(progress);
                                    return d3.select(this).attr('d', recalcPointerPos.call(self, progress));
                                };
                            });
                            this.el.transition().delay(300).ease('bounce').duration(1500).select('.needle').tween('progress', function() {
                                return function(percentOfPercent) {
                                    var progress = percentOfPercent * perc;
                                    var thetaRad = percToRad(progress / 2);
                                    var textX = -(self.len + 45) * Math.cos(thetaRad);
                                    var textY = -(self.len + 45) * Math.sin(thetaRad);
                                    valueText.text(formatValue(progress)).attr('transform', "translate(" + (textX) + "," + textY + ")")
                                    repaintGauge(progress);
                                    return d3.select(this).attr('d', recalcPointerPos.call(self, progress));
                                };
                            });
                        };
                        return Needle;
                    })();
                    needle = new Needle(chart);
                    needle.render();
                    needle.moveTo(percent);
                })();
            }
        };
        this.regressionChart = function(datas) {
        	var element=document.getElementById('regression_chart');
            var height = element.offsetHeight;
            var width = element.offsetWidth;
            var margin = { top: 20, right: 20, bottom: 50, left: 20 };

            // formatters for axis and labels
            var currencyFormat = d3.format("0");
            var decimalFormat = d3.format("0.2f");

            var svg = d3.select(".regression_chart")
                .append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom);
                // .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            svg.append("g")
                .attr("class", "y axis");

            svg.append("g")
                .attr("class", "x axis");

            var xScale = d3.scale.ordinal()
                .rangeRoundBands([-(margin.left + 5), width], 1);

            var yScale = d3.scale.linear()
                .range([height, margin.top]);

            var xAxis = d3.svg.axis()
                .scale(xScale)
                .orient("bottom");

            function make_y_axis() {
                return d3.svg.axis()
                    .scale(yScale)
                    .orient("left")
                    .ticks(5)
            }

            var div = d3.select("body").append("div")
                .attr("class", "tooltip")
                .style("opacity", 0);
            var yAxis = d3.svg.axis()
                .scale(yScale)
                .orient("left");
            (function() {
                var data = datas;
                var xLabels = data.map(function(d) {
                    return d['yearmonth']; })
                xScale.domain(xLabels);
                yScale.domain([0, Math.round(d3.max(data, function(d) {
                    return parseFloat(d['value']); }))]);

                var line = d3.svg.line()
                    .x(function(d) {
                        return xScale(d['yearmonth']); })
                    .y(function(d) {
                        return yScale(d['value']); });
                svg.append("g")
                    .attr("class", "grid")
                    .attr("transform", "translate(" + margin.left + ",0)")
                    .call(make_y_axis()
                        .tickSize(-width + margin.top, 0, 0)
                        .tickFormat("")
                    )
                svg.append("path")
                    .datum(data)
                    .attr("class", "line")
                    .attr("d", line);
                svg.selectAll("dot")
                    .data(data)
                    .enter().append("circle")
                    .attr("r", 6)
                    .attr("stroke-width", "2")
                    .attr("stroke", "#00a0aa")
                    .attr("fill", "#fff")
                    .attr("cx", function(d) {
                        return xScale(d['yearmonth']); })
                    .attr("cy", function(d) {
                        return yScale(d['value']); })
                    .on("mouseover", function(d) {
                        div.transition()
                            .duration(200)
                            .style("opacity", .9);
                        div.html((d.value) + "<br/>" + d.yearmonth)
                            .style("left", (d3.event.pageX) + "px")
                            .style("top", (d3.event.pageY - 28) + "px");
                    })
                    .on("mouseout", function(d) {
                        div.transition()
                            .duration(500)
                            .style("opacity", 0);
                    });
                svg.select(".x.axis")
                    .attr("transform", "translate(0," + (height) + ")")
                    .call(xAxis.tickValues(xLabels.filter(function(d, i) {
                        // if (i % 12 == 0)	
                        return d;
                    })))
                    .selectAll("text")
                    .style("text-anchor", ",middle")
                    .attr("fill", "#909090");
                    // .attr("transform", function(d) {
                    //     return "rotate(-45)";
                    // });
                svg.select(".y.axis")
                    .attr("transform", "translate(" + (margin.left + 5) + ",0)")
                    .attr("fill", "#909090")
                    .call(yAxis.tickFormat(currencyFormat));

                // chart title
                // svg.append("text")
                // 	.attr("x", (width + (margin.left + margin.right) )/ 2)
                // 	.attr("y", 0 + margin.top)
                // 	.attr("text-anchor", "middle")
                // 	.style("font-size", "16px")
                // 	.style("font-family", "sans-serif")
                // 	.text("USD/EURO Exhange Rate");

                // x axis label
                // svg.append("text")
                // 	.attr("x", (width + (margin.left + margin.right) )/ 2)
                // 	.attr("y", height + margin.bottom)
                // 	.attr("class", "text-label")
                // 	.attr("text-anchor", "middle")
                // 	.text("Year-Month");

                // get the x and y values for least squares
                var xSeries = d3.range(1, xLabels.length + 1);
                var ySeries = data.map(function(d) {
                    return parseFloat(d['value']); });
                var leastSquaresCoeff = leastSquares(xSeries, ySeries);
                // apply the reults of the least squares regression
                var x1 = xLabels[0];
                var y1 = leastSquaresCoeff[0] + leastSquaresCoeff[1];
                var x2 = xLabels[xLabels.length - 1];
                var y2 = leastSquaresCoeff[0] * xSeries.length + leastSquaresCoeff[1];
                var trendData = [
                    [x1, y1, x2, y2]
                ];

                var trendline = svg.selectAll(".trendline")
                    .data(trendData);

                trendline.enter()
                    .append("line")
                    .attr("class", "trendline")
                    .attr("x1", function(d) {
                        return xScale(d[0]); })
                    .attr("y1", function(d) {
                        return yScale(d[1]); })
                    .attr("x2", function(d) {
                        return xScale(d[2]); })
                    .attr("y2", function(d) {
                        return yScale(d[3]); })
                    .attr("stroke", "#feab45")
                    .attr("stroke-dasharray", '15, 5')
                    .attr("stroke-width", 1);

                // // display equation on the chart
                // svg.append("text")
                // 	.text("eq: " + decimalFormat(leastSquaresCoeff[0]) + "x + " + 
                // 		decimalFormat(leastSquaresCoeff[1]))
                // 	.attr("class", "text-label")
                // 	.attr("x", function(d) {return xScale(x2) - 60;})
                // 	.attr("y", function(d) {return yScale(y2) - 30;});

                // // display r-square on the chart
                // svg.append("text")
                // 	.text("r-sq: " + decimalFormat(leastSquaresCoeff[2]))
                // 	.attr("class", "text-label")
                // 	.attr("x", function(d) {return xScale(x2) - 60;})
                // 	.attr("y", function(d) {return yScale(y2) - 10;});
            })();


            // returns slope, intercept and r-square of the line
            function leastSquares(xSeries, ySeries) {
                var reduceSumFunc = function(prev, cur) {
                    return prev + cur; };

                var xBar = xSeries.reduce(reduceSumFunc) * 1.0 / xSeries.length;
                var yBar = ySeries.reduce(reduceSumFunc) * 1.0 / ySeries.length;

                var ssXX = xSeries.map(function(d) {
                        return Math.pow(d - xBar, 2); })
                    .reduce(reduceSumFunc);

                var ssYY = ySeries.map(function(d) {
                        return Math.pow(d - yBar, 2); })
                    .reduce(reduceSumFunc);

                var ssXY = xSeries.map(function(d, i) {
                        return (d - xBar) * (ySeries[i] - yBar); })
                    .reduce(reduceSumFunc);

                var slope = ssXY / ssXX;
                var intercept = yBar - (xBar * slope);
                var rSquare = Math.pow(ssXY, 2) / (ssXX * ssYY);

                return [slope, intercept, rSquare];
            }
        }
    });
