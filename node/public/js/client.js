const socket = io.connect(window.location.host);
socket.emit('join', client);

//Action quand on clique sur le bouton du widget
$(document).on("click", ".gridster .option-button", function () {
    $(this).parent().parent().find("div.widget-options").toggleClass("visible").toggleClass("invisible");
    $(this).parent().parent().find("div.widget-content").toggleClass("invisible").toggleClass("visible");
});

$(document).on("click", ".gridster .close-button", function () {
    let selector = $(this).parent().parent();
    let service = widgetData($(selector).find("form"));
    // on ne récupère pas la position, on en a pas besoin
    socket.emit('removeWidget', service);
    $(selector).addClass("widgetremoving");
    gridster.remove_widget($('.widgetremoving'));
});

let gridster = $(".gridster ul").gridster({
    widget_base_dimensions: [100, 100],
    widget_margins: [5, 5],
    helper: 'clone',
    resize: {
        enabled: true,
        stop: function (e, ui, $widget) {
            let selector = $($widget);
            let dataset = $widget[0].dataset;
            let service = widgetData($(selector).find("form"));
            service.positions = new Position(
                Number(dataset.col),
                Number(dataset.row),
                Number(dataset.sizex),
                Number(dataset.sizey));
            socket.emit('updatePosition', service);
        },
    },
    draggable: {
        /*start: function(event, ui) {
            console.log("start drag");
        },*/
        stop: function (event, ui) {
            let selector = $(ui.$player[0]);
            let dataset = ui.$player[0].dataset;
            let service = widgetData($(selector).find("form"));
            service.positions = new Position(
                Number(dataset.col),
                Number(dataset.row),
                Number(dataset.sizex),
                Number(dataset.sizey));
            socket.emit('updatePosition', service);
        }
    }
}).data('gridster');

function widgetData(selector) {
    var name = $(selector).data("service");
    var id = $(selector).data("id");
    var formData = $(selector).serializeArray();
    var array = {};
    array["id"] = id;
    formData.forEach(function (key) {
        array[key.name] = key.value;
    });
    return new Service(name, array, null);
}


var submitRequest = function (service) {
    console.log("on envoie");
    socket.emit('submit_form', service,
        function (result) {
            console.log("Reception:");
            if (result !== "") {
                console.log("GOOD:");
                /*console.log(service);*/
                let selector = `#${service.options.id}`;
                let safe = $(selector).parent();
                $(selector).remove();
                safe.append(result);
                $(safe).find(".widget-title").html(service.options.title);
                $(safe).find("form").on('submit', submitFunction);
            } else {
                console.log("ERROR:");
                console.log(result);
            }
        });
};

function submitFunction(event) {
    if (event !== undefined)
        event.preventDefault();
    let service = widgetData(this);
    let selector = $(this).parent().parent().parent();
    service.positions = new Position(
        $(selector).data("col"),
        $(selector).data("row"),
        $(selector).data("sizex"),
        $(selector).data("sizey"));
    /*    console.log(service.positions);*/
    submitRequest(service);
}

$(document).ready(function () {
    socket.on('addWidget', function (data) {
        var title = `<span class="widget-title">${data.Service.options.title}</span>`;
        var optionButton = '<button class="option-button" style="position:relative;z-index:1;float:right;">&#9881;</button>';
        var closeButton = '<button class="close-button" style="position:relative;z-index:1;float:right;">&#128465;</button>';
        /*        console.log(data.Service.positions);*/
        if (data.Service.positions !== null) {
            console.log("positions found");
            gridster.add_widget.apply(gridster, [`<li><div class="button">${title}${closeButton}${optionButton}</div>${data.html}</li>`,
                data.Service.positions.sizex, data.Service.positions.sizey, data.Service.positions.col, data.Service.positions.row,]);
            let selector = `#${data.Service.options.id}`;
            $(selector).parent().attr("data-col", data.Service.positions.col);
            $(selector).parent().attr("data-row", data.Service.positions.row);
            $(selector).parent().attr("data-sizex", data.Service.positions.sizex);
            $(selector).parent().attr("data-sizey", data.Service.positions.sizey);
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

    $(".dashboard-header li.nav-item").on('click', function () {
        console.log("click");
        var service = $(this).data("id");
        socket.emit('addwidget', service);
    });

    $('#logoutbutton').on('click', function () {
        window.location = '/logout';
    });

});

