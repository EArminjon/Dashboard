var socket = io.connect(window.location.host);
socket.emit('join', client);

//Action quand on clique sur le bouton du widget
$(document).on("click", ".gridster .option-button", function () {
    $(this).parent().parent().find("div.widget-options").toggleClass("visible").toggleClass("invisible");
    $(this).parent().parent().find("div.widget-content").toggleClass("invisible").toggleClass("visible");
});

$(document).on("click", ".gridster .close-button", function () {
    var selector = $(this).parent().parent();
    var service = widgetData($(selector).find("form"));
    // on ne récupère pas la position, on en a pas besoin
    socket.emit('removeWidget', service);
    $(selector).addClass("widgetremoving");
    gridster.remove_widget($('.widgetremoving'));
});

var gridster = $(".gridster ul").gridster({
    widget_base_dimensions: [100, 100],
    widget_margins: [5, 5],
    helper: 'clone',
    resize: {enabled: true},
    draggable: {
        /*start: function(event, ui) {
            console.log("start drag");
        },*/
        stop: function (event, ui) {
            var selector = $(ui.$player[0]);
            var dataset = ui.$player[0].dataset;
            var service = widgetData($(selector).find("form"));
            service.positions = new Position(
                dataset.col,
                dataset.row,
                dataset.sizex,
                dataset.sizey);
            socket.emit('updatePosition', service);
        }
    }
}).data('gridster');

var widgetData = function (selector) {
    var name = $(selector).data("service");
    var id = $(selector).data("id");
    var formData = $(selector).serializeArray();
    var array = {};
    array["id"] = id;
    formData.forEach(function (key) {
        array[key.name] = key.value;
    });
    return new Service(name, array, null);
};


var submitRequest = function (service) {
    console.log("on envoie");
    socket.emit('submit_form', service,
        function (result) {
            console.log("Reception:");
            if (result !== "") {
                console.log("GOOD:");
                /*console.log(service);*/
                $("#" + service.options.id).html(result);
                $("#" + service.options.id + " form").on('submit', submitFunction);
            } else {
                console.log("ERROR:");
                console.log(result);
            }
        });
};

var submitFunction = function (event) {
    if (event !== undefined)
        event.preventDefault();
    var service = widgetData(this);
    service.positions = new Position(
        $(this).data("col"),
        $(this).data("row"),
        $(this).data("sizex"),
        $(this).data("sizey"));
    submitRequest(service);
};

$(document).ready(function () {
    socket.on('addwidget', function (data) {
        /*console.log(object);*/
        var title = `<span class="widget-title">${data.Service.options.title}</span>`;
        var optionButton = '<button class="option-button" style="position:relative;z-index:100;float:right;">&#9881;</button>';
        var closeButton = '<button class="close-button" style="position:relative;z-index:100;float:right;">&#128465;</button>';
        /*console.log(object);*/
        if (data.Service.positions !== null) {
            console.log("positions found");
            gridster.add_widget.apply(gridster, [`<li><div class="button">${title}${closeButton}${optionButton}</div>${data.html}</li>`,
                data.Service.positions.sizex, data.Service.positions.sizey, data.Service.positions.col, data.Service.positions.row,]);
        } else {
            console.log("positions not found");
            gridster.add_widget.apply(gridster, [`<li><div class="button">${title}${closeButton}${optionButton}</div>${data.html}</li>`, 2, 2]);
            var id = "#" + data.Service.options.id;
            data.Service.positions = new Position(
                $(id).parent().data("col"),
                $(id).parent().data("row"),
                $(id).parent().data("sizex"),
                $(id).parent().data("sizey"));
            socket.emit('updatePosition', data.Service);
        }
        $("#" + data.Service.options.id + "  form").on('submit', submitFunction);
        var refresh = function (id) {
            console.log("refresh " + id);
            if (id === undefined)
                clearInterval(uid);
            else if ($("#" + id).find("div.widget-options").hasClass("visible"))
                return;
            console.log($("#" + id + "  form").submit());
        };
        /*var uid = setInterval(refresh.bind(null, data.Service.options.id), data.Service.options.refresh * 1000); //ça marche*/
    });

    $(".services-gallery .service .card").on('click', function () {
        console.log("click");
        var service = $(this).data("id");
        socket.emit('addwidget', service);
    });

});

