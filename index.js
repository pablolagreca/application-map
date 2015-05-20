function onWindowLoaded() {

    /**
     * Resize browser element on window resize.
     * 
     * @method resize
     */
    function resize() {
        var canvas = document.getElementById("canvas1");
        var graphDIV = document.getElementById("graph");
        if (graphDIV === null) {
            graphDIV = document.getElementById("graphinline");
        }
        var toolsDIV = document.getElementById("tools");

        canvas.width = graphDIV.clientWidth;
        canvas.height = graphDIV.clientHeight;
        graphEditor.resizeContent(canvas.width, canvas.height);
    }

    /**
     * Converts a number to a hex value.
     * 
     * @method byte2Hex
     * @param {Number} n Number to convert.
     * @return {String} Hexadecimal result string.
     */
    function byte2Hex(n) {
        var nybHexString = "0123456789ABCDEF";
        return String(nybHexString.substr((n >> 4) & 0x0F, 1)) + nybHexString.substr(n & 0x0F, 1);
    }

    /**
     * Convert the given RGB Values to a Hex color string.
     * 
     * @method rgb2Color
     * @param {Number} r Red value.
     * @param {Number} g Green value.
     * @param {Number} b Blue value.
     * @return {String} Hex color value.
     */
    function rgb2Color(r,g,b) {
        return '#' + byte2Hex(r) + byte2Hex(g) + byte2Hex(b);
    }

    /**
     * Convert a number to a hex value.
     * 
     * @method hex
     * @param {Number} x Number.
     * @return {String} Hexadecimal value.
     */
    function hex(x) {
        return ("0" + parseInt(x, 10).toString(16)).slice(-2);
    }

    /**
     * Converts a given RGB String to a Hex color string.
     * 
     * @method rgb2hex
     * @param {String} rgb RGB String to convert.
     * @return {String} Resulting Hex color value.
     */
    function rgb2hex(rgb) {
        if (/^#[0-9A-F]{6}$/i.test(rgb)) { 
            return rgb;
        }
    
        rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
        return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
    }
    
    /**
     * Assigns the color given by the background style of the div to the selected GraphItems as a fillcolor.
     * 
     * @method assignFillColor
     */
    function assignFillColor(ev) {
        var formatmap = new JSG.commons.Map();
        formatmap.put(JSG.graph.attr.FormatAttributes.FILLCOLOR, rgb2hex(ev.target.style.backgroundColor));
        graphEditor.getInteractionHandler().applyFormatMap(formatmap);
    }
    
    /**
     * Create a color palette at the bottom of the window and assign a handler to each color entry.
     * 
     * @method createColorPalette
     * @param {String} label Label before palette.
     * @param {Function} clickHandler Handler to call, if a color div is clicked.
     */
    function createColorPalette(label, clickHandler) {
        var frequency1 = 0.1, 
            frequency2 = 0.2, 
            frequency3 = 0.3, 
            center = 128, 
            width = 127, 
            len = 60;
        var i;

        var palette = document.getElementById("palette");

        for (i = 0; i < len; ++i) {
            var red = Math.sin(frequency1 * i) * width + center;
            var grn = Math.sin(frequency2 * i) * width + center;
            var blu = Math.sin(frequency3 * i) * width + center;

            var divColor = document.createElement("div");
            divColor.style.width = "20px";
            divColor.style.height = "20px";
            divColor.style.cssFloat = "left";
            divColor.style.background = rgb2Color(red, grn, blu);
            divColor.addEventListener("click", clickHandler);

            palette.appendChild(divColor);
        }
    }





    // create a graph editor and attach it to the canvas element
    graphEditor = new JSG.ui.GraphEditor("canvas1");
    // create a graph and attach it to the graph editor
    graphEditor.setGraph(new JSG.graph.model.Graph());
    // create color palette for fill operation
    createColorPalette("Fill Color:", assignFillColor);
    // initial resize
    setTimeout(resize, 1);

    //PLG: layout
    var config = new ARAC.layout.force.ForceLayoutConfig();
    config.nodeDistance = 2500;
    config.layerDistance = 2000;
    config.iterations = 120;
    var aracGraph = new JSG.aracadapter.AracGraphAdapter(graphEditor.getGraph());
    ARAC.layout.apply(aracGraph, config);

    graphEditor.getGraphSettings().setGridVisible(false)
    graphEditor.getGraphSettings().setScaleVisible(false)
    graphEditor.setDisplayMode(JSG.ui.graphics.DisplayMode.ENDLESS)

    //graphEditor.activateViewMode(JSG.graph.model.settings.ViewMode.READ_ONLY)

    AppMap.loadServers()

    graphEditor.invalidate()

    window.onload = window.onresize = resize;
}

/**
 * Handler for copy button. Simply calls appropriate utility function of the
 * interaction handler
 *
 * @method copySelection
 */
function copySelection() {
    graphEditor.getInteractionHandler().copySelection();
}

/**
 * Handler for cut button. Simply calls appropriate utility function of the
 * interaction handler
 *
 * @method cutSelection
 */
function cutSelection() {
    graphEditor.getInteractionHandler().cutSelection();
}

/**
 * Handler for paste button. Simply calls appropriate utility function of the
 * interaction handler
 *
 * @method paste
 */
function paste() {
    graphEditor.getInteractionHandler().paste();
}

/**
 * Handler for delete button. Simply calls appropriate utility function of the
 * interaction handler
 *
 * @method deleteSelection
 */
function deleteSelection() {
    graphEditor.getInteractionHandler().deleteSelection();
}

/**
 * Handler for undo button. Simply calls appropriate utility function of the
 * interaction handler
 *
 * @method undo
 */
function undo() {
    graphEditor.getInteractionHandler().undo();
}

/**
 * Handler for redo button. Simply calls appropriate utility function of the
 * interaction handler
 *
 * @method redo
 */
function redo() {
    graphEditor.getInteractionHandler().redo();
}

/**
 * Handler for create line button. Activates an interaction to enable the drawing mode.
 *
 * @method createLine
 */
function createLine() {
    graphEditor.getInteractionHandler().setActiveInteraction(new JSG.graph.interaction.CreateEdgeInteraction(new JSG.graph.model.Edge()));
}

/**
 * Handler for create rect button. Activates an interaction to enable the drawing mode.
 *
 * @method createRect
 */
function createRect() {
    graphEditor.getInteractionHandler().setActiveInteraction(new JSG.graph.interaction.CreateNodeInteraction(new JSG.graph.model.shapes.RectangleShape()));
}

/**
 * Handler for create text button. Activates an interaction to enable the drawing mode.
 *
 * @method createText
 */
function createText() {
    graphEditor.getInteractionHandler().setActiveInteraction(new JSG.graph.interaction.CreateNodeInteraction(new JSG.graph.model.shapes.RectangleShape(), "Label"));
}

/**
 * Handler for create rect button. Activates an interaction to enable the drawing mode.
 *
 * @method createRect
 */
function createEllipse() {
    graphEditor.getInteractionHandler().setActiveInteraction(new JSG.graph.interaction.CreateNodeInteraction(new JSG.graph.model.shapes.EllipseShape()));
}

/**
 * Handler for create polyline or polygon button. Activates an interaction to enable the drawing mode.
 *
 * @method createPolyline
 * @param {boolean} closed True to create a polygon, otherwise a polyline.
 */
function createPolyline(closed) {
    var polynode = new JSG.graph.model.Node(new JSG.graph.model.shapes.PolygonShape());
    polynode.setItemAttribute(JSG.graph.attr.ItemAttributes.CLOSED, closed);
    graphEditor.getInteractionHandler().setActiveInteraction(new JSG.graph.interaction.CreatePolyLineInteraction(polynode));
}

/**
 * Handler for create polyline or polygon button. Activates an interaction to enable the drawing mode.
 *
 * @method createBezier
 * @param {boolean} closed True to create a closed bezier shape, otherwise a bezier curve.
 */
function createBezier(closed) {
    var polynode = new JSG.graph.model.Node(new JSG.graph.model.shapes.BezierShape());
    polynode.setItemAttribute(JSG.graph.attr.ItemAttributes.CLOSED, closed);
    graphEditor.getInteractionHandler().setActiveInteraction(new JSG.graph.interaction.CreateBezierInteraction(polynode));
}

/**
 * Handler for edit button. Simply calls appropriate utility function of the
 * interaction handler
 *
 * @method edit
 */
function edit() {
    graphEditor.getInteractionHandler().editSelection();
}

/**
 * Handler for alignemnt buttons. Simply calls appropriate utility function of the
 * interaction handler
 *
 * @method align
 * @param {JSG.graph.command.Alignment} flag Alignment type to execute.
 */
function align(flag) {
    graphEditor.getInteractionHandler().alignSelection(flag);
}

/**
 * Handler for order buttons. Simply calls appropriate utility function of the
 * interaction handler
 *
 * @method order
 * @param {JSG.graph.command.ChangeItemOrder} flag Order type to execute.
 */
function order(flag) {
    graphEditor.getInteractionHandler().changeDrawingOrderSelection(flag);
}

var AppMap = {
    ServerManager: function()
    {
        this.serversMap = {}
        this.getServers = function() {
            var servers = []
            for (var property in this.serversMap) {
                if (this.serversMap.hasOwnProperty(property)) {
                    servers.push(this.serversMap[property])
                }
            }
            return servers
        }
        this.addServer = function(server)
        {
            if (server.hasOwnProperty(server.getIp()))
            {
                throw "server with " + server.getIp() + " already exists";
            }
            this.serverMap[server.getIp()] = server;
        }
        this.getServer = function(hostIp) {
            if (this.serversMap.hasOwnProperty(hostIp)) {
                return this.serversMap[hostIp]
            }
            return null
        }
        this.getOrCreateServer = function(hostIp) {
            var server = this.getServer(hostIp)
            if (server == null) {
                server = new AppMap.Server(hostIp)
                this.serversMap[hostIp] = server
            }
            return server
        }
    },
    Service: function(owner, serviceType, connectionType, servicePort, host) {
        this.owner = owner
        this.type = serviceType
        this.connectionType = connectionType
        this.port = servicePort
        this.host = host;
        this.addresses = []
        this.consumers = []
        this.addConsumer = function(consumer) {
            this.consumers.push(consumer)
        }
        this.addAddress = function(address) {
            this.addresses.push(address)
        }
    },
    Consumer: function(owner, service)
    {
        this.owner = owner
        this.service = service
        this.addresses = []
        this.addAddress = function(address) {
            this.addresses.push(address)
        }
    },
    Server: function(serverIp)
    {
        this.type = AppMap.ServerType.OTHER
        this.ip = serverIp;
        this.services = [];
        this.applications = []
        this.getIp = function() {
            return this.ip;
        }
        this.addApplication = function(application) {
            this.applications.push(application)
        }
        this.addService = function(service) {
            this.services.push(service);
        }
        this.makeMuleServer = function() {
            this.type = AppMap.ServerType.MULE
            return this
        }
        this.isMuleServer = function() {
            return this.type === AppMap.ServerType.MULE;
        }
        this.findService = function(resourceType, port) {
            if (this.type == AppMap.ServerType.MULE) {
                alert('this should not happen')
            }
            var foundService = null
            this.services.forEach(function(service, index, array) {
                if (service.type === resourceType && service.port === port) {
                    foundService = service
                }
            })
            return foundService
        }
        this.findOrCreateService = function(resourceType, connectionType, port, destination) {
            //HTTP - 8080 - /path
            //JMS - 61616 - input
            var allServices = []
            if (this.type === AppMap.ServerType.MULE) {
                for (i = 0; i < this.applications.length; i++) {
                    allServices = allServices.concat(this.applications[i].services)
                }
            }
            else {
                allServices = allServices.concat(this.services)
            }
            for (i = 0; i < allServices.length; i++) {
                var service = allServices[i]
                if (service.type === resourceType && service.port === port) {
                    service.addAddress(destination)
                    return service;
                }
            }
            var newService = new AppMap.Service(this, resourceType, connectionType, port, this.ip)
            newService.addAddress(destination)
            this.services.push(newService)
            return newService
        }
    },
    Application: function(appName) {
        this.providedServices = []
        this.consumedServices = []
        this.appName = appName
        this.addService = function(providedService) {
            this.providedServices.push(providedService);
        };
        this.addConsumedService = function(consumedService) {
            this.consumedServices.push(consumedService)
        };
        this.findOrCreateConsumer = function(consumedService, destination) {
            var foundConsumer = null
            this.consumedServices.forEach(function(consumer, index, array) {
                if (consumer.service === consumedService) {
                    foundConsumer = consumer
                }
            })
            if (foundConsumer) {
                foundConsumer.addAddress(destination)
            } else {
                foundConsumer = new AppMap.Consumer(this, consumedService)
                foundConsumer.addAddress(destination)
                this.consumedServices.push(foundConsumer)
            }
            return foundConsumer
        }
        this.findOrCreateService = function(type, connectionType, port, destination, host) {
            var foundService = null
            this.providedServices.forEach(function(service, index, array) {
                if (service.type === type && service.port === port) {
                    foundService = service
                }
            })
            if (foundService) {
                foundService.addAddress(destination)
                foundService.connectionType = connectionType
            } else {
                foundService = new AppMap.Service(this, type, connectionType, port, host)
                foundService.addAddress(destination)
                this.providedServices.push(foundService)
            }
            return foundService
        }
    },
    serverManager: null,
    loadServers: function() {
        // graphEditor.layout.LayoutManager = function() {};
        // graphEditor.layout.LayoutManager.prototype.createConstraintsForLayout = function(a) {
        //     switch (a) {
        //         return ARAC.layout.defaultConfigStore.get("Force-CenterPoints").copy()
        //     }
        // };

        if (AppMap.serverManager == null) {
            AppMap.serverManager = new AppMap.ServerManager()
        }

        var graph = graphEditor.getGraph();

        var serverMap = {}

        $.ajax({
            url: "http://localhost:9090/metadata"
        }).done(function(data) {

            //NEW CODE TO CREATE DOMAIN
            var server = AppMap.serverManager.getOrCreateServer(data.serverIp)
            var oldServerType = server.type
            server.makeMuleServer()
            var applications = data.apps
            for (var i = 0; i < applications.length; i++) {
                var application = applications[i]
                var domainApp = new AppMap.Application(application.appName)
                for (var j = 0; j < application.externalConnections.length; j++) {
                    var externalConnection = application.externalConnections[j]
                    if (externalConnection.type === AppMap.Connection.Type.OUTBOUND) {
                        //consuming service
                        var consumedService = AppMap.locateOrCreateService(externalConnection);
                        domainApp.findOrCreateConsumer(consumedService, externalConnection.destination)
                    } else {
                        //publishing new service
                        if (oldServerType === AppMap.ServerType.OTHER) {
                            //Promote service to app if already exists
                            var nonMuleServices = server.services
                            var foundService = null
                            var foundServiceIndex = -1
                            for (i = 0; i < nonMuleServices.length; i++) {
                                var nonMuleService = nonMuleServices[i]
                                if (nonMuleService.port === externalConnection.port
                                    && nonMuleService.type === externalConnection.resourceType) {
                                    foundService = nonMuleService
                                    foundServiceIndex = i
                                    break;
                                }
                            }
                            if (foundService) {
                                domainApp.addService(foundService)
                                foundService.addAddress(externalConnection.destination)
                                foundService.connectionType = externalConnection.connectionType
                                server.services.splice(foundServiceIndex, 1)
                            } else {
                                domainApp.findOrCreateService(externalConnection.resourceType, externalConnection.type, externalConnection.port, externalConnection.destination, externalConnection.host)
                            }
                        } else {
                            domainApp.findOrCreateService(externalConnection.resourceType, externalConnection.type, externalConnection.port, externalConnection.destination, externalConnection.host)
                        }
                        if (externalConnection.type === AppMap.Connection.Type.CONSUMER) {
                            //If the pusblish service consume from another host then create the resource in the host
                            var serviceOwnerServer = AppMap.serverManager.getOrCreateServer(externalConnection.host);
                            serviceOwnerServer.findOrCreateService(externalConnection.resourceType, externalConnection.type, externalConnection.port, externalConnection.destination)
                        }
                    }
                }
                server.addApplication(domainApp)
            }

            AppMap.drawServers(graphEditor, this.serverManager)

            graphEditor.invalidate()

            //PLG: layout
            var config = new ARAC.layout.force.ForceLayoutConfig()
            config.nodeDistance = 7500
            config.layerDistance = 7000
            config.iterations = 120
            var aracGraph = new JSG.aracadapter.AracGraphAdapter(graphEditor.getGraph())
            ARAC.layout.apply(aracGraph, config)

            graphEditor.invalidate()
          })
          .fail(function() {
            alert( "error" );
          })
    },
    locateOrCreateService: function(externalConnection) {
        var server = AppMap.serverManager.getOrCreateServer(externalConnection.host)
        return server.findOrCreateService(externalConnection.resourceType, externalConnection.type, externalConnection.port, externalConnection.destination)
    },
    drawServers: function(graphEditor, serverManager) {
        var graph = graphEditor.getGraph()

        createServiceNode = function(parent, service, position, totalNumber) {
            service.node = new JSG.graph.model.Node(new JSG.graph.model.shapes.RectangleShape())
            AppMap.createLabel(service.node, service.type + " (" + service.port + ") "  + service.addresses)
            service.node.setSize(new JSG.graph.expr.NumberExpression(0, "Parent!WIDTH * 0.9"), new JSG.graph.expr.NumberExpression(0, "Parent!HEIGHT / " + totalNumber*2));
            service.node.getPin().setCoordinate(new JSG.graph.expr.NumberExpression(0, "Parent!WIDTH * 0.5"),
                new JSG.graph.expr.NumberExpression(0, "1000 + HEIGHT / 2  + HEIGHT * " + (position - 1)))
            parent.addItem(service.node)
            if (service.owner instanceof AppMap.Server) {
                if (service.type === AppMap.ServiceType.FTP) {
                    AppMap.createImageNode(service.node, "resources/icons/folder.png", true)
                } else if (service.type === AppMap.ServiceType.JMS) {
                    AppMap.createImageNode(service.node, "resources/icons/broker.png", true)
                }
            }
        }

        createApplicationNode = function(server, application, position, totalNumber) {
            application.node = new JSG.graph.model.Node(new JSG.graph.model.shapes.RectangleShape())
            application.node.setSize(new JSG.graph.expr.NumberExpression(0, "Parent!WIDTH * 0.9"), new JSG.graph.expr.NumberExpression(0, "Parent!HEIGHT / " + totalNumber*2));
            application.node.getPin().setCoordinate(new JSG.graph.expr.NumberExpression(0, "Parent!WIDTH * 0.5"),
                new JSG.graph.expr.NumberExpression(0, "1000 + HEIGHT / 2  + HEIGHT * " + (position - 1)))
            AppMap.createTopLabel(application.node, application.appName)
            server.node.addItem(application.node)
            application.providedServices.forEach(function(service, index, array) {
                createServiceNode(application.node, service, index + 1, array.length)
            })
        }

        createServerNodesAndServices = function(server) {
            server.node = AppMap.createServerNode(server)
            graph.addItem(server.node)
            if (server.isMuleServer()) {
                var applications = server.applications;
                applications.forEach(function(application, index, array) {
                    createApplicationNode(server, application, index + 1, array.length)
                })
            } else {
                var services = server.services
                services.forEach(function(service, index, array) {
                    createServiceNode(server.node, service, index + 1, array.length)
                })
            }
        }

        createLink = function(sourceNode, targetNode, label) {
            var portSource = sourceNode.addCenterPort()
            var portTarget = targetNode.addCenterPort()
            var edge = new JSG.graph.model.Edge()
            edge.setSourcePort(portSource)
            edge.setTargetPort(portTarget)
            edge.getFormat().setLineArrowEnd(JSG.graph.attr.FormatAttributes.ArrowStyle.ARROW)
            graph.addItem(edge)
            if (label) {
                AppMap.createLabel(edge, label)
            }
        }

        createLinksForConsumers = function(server) {
            if (server.isMuleServer()) {
                server.applications.forEach(function(application, index, array) {
                    application.consumedServices.forEach(function(consumer, index, array) {
                        createLink(consumer.owner.node, consumer.service.node, consumer.addresses.join())
                    })
                })
            }
        }

        createLinksForServiceConsumers = function(server) {
            if (server.isMuleServer()) {
                server.applications.forEach(function(application, index, array) {
                    application.providedServices.forEach(function(service, index, array) {
                        if (service.connectionType === AppMap.Connection.Type.CONSUMER) {
                            var server = AppMap.serverManager.getServer(service.host)
                            var remoteService = server.findService(service.type, service.port)
                            createLink(remoteService.node, service.node, service.addresses.join())
                        }
                    })
                })
            }
        }

        var servers = this.serverManager.getServers();

        servers.forEach(function(server, index, array) {
            createServerNodesAndServices(server)
        })

        servers.forEach(function(server, index, array) {
            createLinksForConsumers(server)
            createLinksForServiceConsumers(server)
        })
    },
    createServerNode: function(server) {
        var node = new JSG.graph.model.Node(new JSG.graph.model.shapes.RectangleShape())
        AppMap.createTopLabel(node, server.getIp())
        // node.getPin().setCoordinate(3000, 3000);
        node.setSize(10000, 10000);

        node.getFormat().setFillColor("#68d9d0");
        node.getFormat().setShadowOffsetX(200);
        node.getFormat().setShadowOffsetY(200);

        if (server.isMuleServer())
        {
            AppMap.createImageNode(node, "resources/icons/mule.png")
        } else {
            AppMap.createImageNode(node, "resources/icons/server.png")
        }
        return node;
    },
    createImageNode: function(parent, imageSource, rightPosition) {
        var imageNode = new JSG.graph.model.Node(new JSG.graph.model.shapes.RectangleShape())
        imageNode.getFormat().setPattern(imageSource);
        imageNode.getFormat().setLineStyle(JSG.graph.attr.FormatAttributes.LineStyle.NONE);
        imageNode.getFormat().setFillStyle(JSG.graph.attr.FormatAttributes.FillStyle.PATTERN);
        imageNode.setSize(new JSG.graph.expr.NumberExpression(0, "Parent!WIDTH * 0.2"), new JSG.graph.expr.NumberExpression(0, "Parent!WIDTH * 0.2"));
        if (rightPosition) {
            imageNode.getPin().setCoordinate(new JSG.graph.expr.NumberExpression(0, "Parent!WIDTH"), new JSG.graph.expr.NumberExpression(0));
        }
        parent.addItem(imageNode)
    },
    createLabel: function(node, content) {
        var newLabel = node.addLabel();
        newLabel.getTextFormat().setFontSize(7);
        newLabel.getTextFormat().setFontName("Verdana");
        newLabel.setText(content);
        newLabel.setTextInfoCache(false);
        newLabel.evaluate();
        return newLabel;
    },
    createTopLabel: function(node, content) {
        var newLabel = node.addLabel();
        newLabel.getTextFormat().setFontSize(7);
        newLabel.getTextFormat().setFontName("Verdana");
        newLabel.setText(content);
        newLabel.setTextInfoCache(false);
        newLabel.setItemAttribute(JSG.graph.attr.ItemAttributes.SELECTIONMODE, JSG.graph.attr.consts.SelectionMode.NONE);
        newLabel.getPin().setCoordinate(new JSG.graph.expr.NumberExpression(0, "Parent!WIDTH * 0.5"), new JSG.graph.expr.NumberExpression(0, "Parent!HEIGHT"));
        newLabel.getPin().setLocalCoordinate(new JSG.graph.expr.NumberExpression(0, "WIDTH * 0.5"), new JSG.graph.expr.NumberExpression(0, "Parent!HEIGHT * 0.5"));
        newLabel.evaluate();
        return newLabel;
    }

}

AppMap.ServiceType = {
    JMS: 'JMS',
    HTTP: 'HTTP',
    DB: 'DB',
    FTP: 'FTP'
};

AppMap.Connection = {
    Type: {
        CONSUMER: 'CONSUMER',
        PRODUCER: 'PRODUCER',
        OUTBOUND: 'OUTBOUND'
    }
};

AppMap.ServerType = {
    MULE: 'MULE',
    OTHER: 'OTHER'
}



