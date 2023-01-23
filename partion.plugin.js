var d3Partition = function(selector, json2,twidth,theight,showLinesOfCodeInTitle,expandOnClick,notification) {
     

    var width = (twidth)?twidth:selector.parent().width(), // svg width
        height = (theight)?theight:selector.parent().height(), // svg height
        expandOnClick = (typeof(expandOnClick) == "undefined" || expandOnClick)?true:false,
        showLinesOfCodeInTitle = (typeof(showLinesOfCodeInTitle) == "undefined" || showLinesOfCodeInTitle)?true:false,
        dr = 4, // default point radius
        off = 15, // cluster hull offset
        expand = {}, // expanded clusters
        data, net, force, hullg, hull, linkg, link, nodeg, node;
    var max_link_thickness = 0;
    var circle_color = ["#ffff33","#1ad1ff","#078707","#e6ccff","#00ffbf","#ff4d4d"];


    var json=JSON.parse(JSON.stringify(json2));
    var groupKeywords = {};
    json.groups.forEach(group => groupKeywords[group.group] = group.keywords.map(k => k.keyWord));

    var curve = d3.svg.line()
        .interpolate("cardinal-closed")
        .tension(.85);

    //var fill = d3.scaleOrdinal(d3.schemeCategory10);//d3.scale.category20c();
    var fill = d3.scale.category20c();
    
    function noop() {
        return false;
    }

    function nodeid(n) {
        return n.size ? "_g_" + n.group : n.name;
    }

    function linkid(l) {
        var u = nodeid(l.source),
            v = nodeid(l.target);
        return u < v ? u + "|" + v : v + "|" + u;
    }

    function getGroup(n) {
        return n.group;
    }

    // constructs the network to visualize
    function network(data, prev, index, expand) {
        expand = expand || {};
        var gm = {}, // group map
            nm = {}, // node map
            lm = {}, // link map
            gn = {}, // previous group nodes
            gc = {}, // previous group centroids
            nodes = [], // output nodes
            links = []; // output links

        // process previous nodes for reuse or centroid calculation
        if (prev) {
            prev.nodes.forEach(function(n) {
                var i = index(n),
                    o;
                if (n.size > 0) {
                    gn[i] = n;
                    n.size = 0;
                } else {
                    o = gc[i] || (gc[i] = { x: 0, y: 0, count: 0 });
                    o.x += n.x;
                    o.y += n.y;
                    o.count += 1;
                }
            });
        }

        // determine nodes
        for (var k = 0; k < data.nodes.length; ++k) {
            var n = data.nodes[k],
                i = index(n),
                l = gm[i] || (gm[i] = gn[i]) || (gm[i] = { group: i, size: 0, nodes: [] });
            // console.log("n:",n)

            if (expand[i]) {
                // the node should be directly visible
                nm[n.name] = nodes.length;
                nodes.push(n);
                if (gn[i]) {
                    // place new nodes at cluster location (plus jitter)
                    n.x = gn[i].x + Math.random();
                    n.y = gn[i].y + Math.random();
                }
            } else {
                // the node is part of a collapsed cluster
                if (l.size == 0) {
                    // if new cluster, add to set and position at centroid of leaf nodes
                    nm[i] = nodes.length;
                    nodes.push(l);
                    if (gc[i]) {
                        l.x = gc[i].x / gc[i].count;
                        l.y = gc[i].y / gc[i].count;
                    }
                }
                l.nodes.push(n);
            }
            // always count group size as we also use it to tweak the force graph strengths/distances
            l.size += 1;
            n.group_data = l;
        }

        for (i in gm) { gm[i].link_count = 0; }

        // determine links

        for (k = 0; k < data.links.length; ++k) {
            var e = data.links[k],
                u = index(e.source),
                v = index(e.target);
            if (u != v) {
                gm[u].link_count++;
                gm[v].link_count++;
            }
            u = expand[u] ? nm[e.source.name] : nm[u];
            v = expand[v] ? nm[e.target.name] : nm[v];
            var i = (u < v ? u + "|" + v : v + "|" + u),
                l = lm[i] || (lm[i] = { source: u, target: v, size: 0,context:e });
            l.size += 1;
            if(l.size > max_link_thickness)
                max_link_thickness = l.size;
        }
        for (i in lm) { links.push(lm[i]); }

        return { nodes: nodes, links: links };
    }

    function convexHulls(nodes, index, offset) {
        var hulls = {};

        // create point sets
        for (var k = 0; k < nodes.length; ++k) {
            var n = nodes[k];
            if (n.size) continue;
            var i = index(n),
                l = hulls[i] || (hulls[i] = []);
            l.push([n.x - offset, n.y - offset]);
            l.push([n.x - offset, n.y + offset]);
            l.push([n.x + offset, n.y - offset]);
            l.push([n.x + offset, n.y + offset]);
        }

        // create convex hulls
        var hullset = [];
        for (i in hulls) {
            hullset.push({ group: i, path: d3.geom.hull(hulls[i]) });
        }

        return hullset;
    }

    function drawCluster(d) {
        return curve(d.path); // 0.8
    }

    // --------------------------------------------------------
    // var lookup = { F: "Fn", A: "Attr" };
    var min;
    var max = 0;
    var tMax = 15;
    var tMin = 0;

    function findRange(json) {
        var myNodes = json.nodes;
        for (var i = 0; i < myNodes.length; i++) {
            if (min === undefined) {
                min = myNodes[i].eloc;
            }
            if (myNodes[i].eloc < min) {
                min = myNodes[i].eloc;
            }
            if (myNodes[i].eloc > max) {
                max = myNodes[i].eloc;
            }

        }
    }

    function convertRange(input) {
       var percent,output;
        if(max != min)
        {
            percent = (input - min) / (max - min);
            output = percent * (tMax - tMin) + tMin;
        }
        else
        {
            output = e.math.convertToRange([1,max],[1,5],input);  
        }
        
        return output;
    }
    //---------------------------------------------------------

    var body = d3.select(selector[0]);
    body.select("svg").remove();
    var vis = body.append("svg")
        .attr("width", width)
        .attr("height", height)
        .call(d3.behavior.zoom()
            .scaleExtent([.5, 5])
            .on("zoom", redraw))
        .append('g');


    // build the arrow.
    vis.append("defs").append("marker")
        .attr({
            "id": "arrow",
            "viewBox": "0 -5 10 10",
            "refX": 5,
            "refY": 0,
            "markerWidth": 4,
            "markerHeight": 4,
            "orient": "auto"
        })
        .append("path")
        .attr("d", "M0,-5L10,0L0,5")
        .attr("class", "arrowHead");

    function redraw() {
        vis.attr("transform",
            "translate(" + d3.event.translate + ")" + " scale(" + d3.event.scale + ")");
    }

    function drawData(json) {
        data = json;
        findRange(data);
        for (var i = 0; i < data.links.length; ++i) {
            var o = data.links[i];
            o.source = data.nodes[o.source];
            o.target = data.nodes[o.target];
        }
        
        if(!expandOnClick)
            json.groups.forEach((d)=>expand[d.group]=true);

        hullg = vis.append("g").attr('class',"hull");
        linkg = vis.append("g").attr('class',"link");
        nodeg = vis.append("g").attr('class',"node");


        init();

        vis.attr("opacity", 1e-6)
            .transition()
            .duration(1000)
            .attr("opacity", 1);
    };

    
    drawData(json);

    function init() {
        if (force) force.stop();

        net = network(data, net, getGroup, expand);

        force = d3.layout.force()
            .nodes(net.nodes)
            .links(net.links)
            .size([width, height])
            .linkDistance(function(l, i) {
                var n1 = l.source,
                    n2 = l.target;
                // larger distance for bigger groups:
                // both between single nodes and _other_ groups (where size of own node group still counts),
                // and between two group nodes.
                //
                // reduce distance for groups with very few outer links,
                // again both in expanded and grouped form, i.e. between individual nodes of a group and
                // nodes of another group or other group node or between two group nodes.
                //
                // The latter was done to keep the single-link groups ('blue', rose, ...) close.
                return 30 +
                    Math.min(20 * Math.min((n1.size || (n1.group != n2.group ? n1.group_data.size : 0)),
                            (n2.size || (n1.group != n2.group ? n2.group_data.size : 0))), -30 +
                        30 * Math.min((n1.link_count || (n1.group != n2.group ? n1.group_data.link_count : 0)),
                            (n2.link_count || (n1.group != n2.group ? n2.group_data.link_count : 0))),
                        100);
                //return 150;
            })
            .linkStrength(function(l, i) {
                return 1;
            })
            .gravity(0.1) // gravity+charge tweaked to ensure good 'grouped' view (e.g. green group not smack between blue&orange, ...
            .charge(-600) // ... charge is important to turn single-linked groups to the outside
            .friction(0.5) // friction adjusted to get dampened display: less bouncy bouncy ball [Swedish Chef, anyone?]
            .start();


        hullg.selectAll("path.hull").remove();
        hull = hullg.selectAll("path.hull")
            .data(convexHulls(net.nodes, getGroup, off))
            .enter().append("path")
            .attr("class", "hull")
            .attr("d", drawCluster)
            .style("fill", function(d) {
                return fill(d.group);//circle_color[d.group]
            })
            .on("click", function(d) {
                /*expand[d.group] = false;
                init();*/
            });
        hull.append("title")
            .text(d=>groupKeywords[d.group]);


        link = linkg.selectAll("line.link").data(net.links, linkid);
        link.exit().remove();
        link.enter()
            .append("line")
            .attr("class", d=>{
              var dashed=d.context.source.type=='A' || d.context.target.type=='A';
              return `link ${dashed?'dashed':''} `
            })
            .attr("x1", function(d) {
                return d.source.x;
            })
            .attr("y1", function(d) {
                return d.source.y;
            })
            .attr("x2", function(d) {
                return d.target.x;
            })
            .attr("y2", function(d) {
                return d.target.y;
            })
            .style("stroke-width",d=> d.context.value!=-1?e.math.convertToRange([1,max_link_thickness],[1,10],d.size):0);


        //----------------------------------------------------------------

        // Create the groups under svg

        var gnodes = nodeg.selectAll('g.gnode').data(net.nodes, nodeid)
        gnodes.exit().remove();
        gnodes.enter()
            .append('g')
            .attr("transform", function(d) {
                return "translate(" + d.x + "," + d.y + ")";
            })
            .attr('class',d=>`gnode ${d.type=='A'?"triangle":"circle"}`)

        .call(force.drag);

        // Add one circle in each group
        var node = gnodes;

        gnodes.filter('.circle').append("circle")
            .attr("class", function(d) {
                return "node" + (d.size ? "" : " leaf");
            })
            .attr("r", function(d) {
                if(d.size ? d.size + dr : dr + 1 + convertRange(d.eloc))
                {
                    d.r =d.size ? d.size + dr : dr + 1 + convertRange(d.eloc);
                }

                if(!d.r)
                    d.r = dr + 1 + convertRange(d.eloc);
                // return 20; //Set Static size to disable loc
                return d.r;
            })
            .style("cursor", function(d) {
                if(expandOnClick)
                {
                    return "pointer";
                }
                else
                {
                    if(parseInt(d.group) == 1)
                        return "pointer";
                }
            })
            .style("fill", function(d) {
                if(expandOnClick)
                {
                    return fill(d.group);//circle_color[d.group];
                }
                else
                {
                    if(parseInt(d.group) == 1)
                        return fill(d.group);//circle_color[d.group]; 
                    else
                        return '#ffffff';
                }
            })
            .style("stroke", function(d) {
                return fill(d.group);//circle_color[d.group]
            })
            .on("click", function(d) {
                if(expandOnClick)
                {
                    expand[d.group] = !expand[d.group];
                    init();
                }
                else
                {
                    e.notify(notification,d);
                }
            });

        var triangle = d3.svg.symbol().type('triangle-up').size(50);

          gnodes
          .filter('.triangle')
          .append("path")
          .attr("d",triangle)
          .style("fill", function(d) {
              return fill(d.group);
          });

        // Append the labels to each group
        var labels = gnodes.append("text")
            .attr("text-anchor", "middle")
            .attr("alignment-baseline", "central")
            .attr("dy", d => {
              if(d.type=='A')
                return -8;
              else
                return (d.r)?(-d.r - 4):-4;
            })
            .text(function(d) {
                if (d.actualname != undefined) {
                    return d.actualname;
                } else {
                    //console.log("d:",d);
                    return groupKeywords[d.group][0];
                }
            });

        node.append("title").text(function(d) {
            if (d.actualname != undefined) {
                if(d.type=="A")
                    return `Attr: ${d.actualname}`;
                else
                {
                    var temp_text = (showLinesOfCodeInTitle)?"Lines of code : "+d.eloc:"sig :"+d.name;
                    return ` Fn: ${d.actualname} \n ${temp_text} `;
                }
            } else {
                //console.log("d:",d);
                return groupKeywords[d.group];
            }
        });

        force.on("tick", function() {
            if (!hull.empty()) {
                hull.data(convexHulls(net.nodes, getGroup, off))
                    .attr("d", drawCluster);
            }

            link.attr("x1", function(d) {
                    return d.source.x;
                })
                .attr("y1", function(d) {
                    return d.source.y;
                })
                .attr("x2", function(d) {
                    return d.target.x;
                })
                .attr("y2", function(d) {
                    return d.target.y;
                });

            /*    node.attr("cx", function(d) { return d.x; })
                    .attr("cy", function(d) { return d.y; });*/
            gnodes.attr("transform", function(d) {
                return "translate(" + d.x + "," + d.y + ")";
            });
        });
    }


};
