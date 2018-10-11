var socket = io.connect(window.location.host);
console.log(socket.emit('join'));

const emailInput = document.getElementById('emailInput');
const passwordInput = document.getElementById('passwordInput');
const btnLogIn = document.getElementById('btnLogIn');
const btnSignUp = document.getElementById('btnSignUp');

function LoginInfos() {
    // console.log("Login");
    var email = document.getElementById("emailInput").value;
    var password = document.getElementById("passwordInput").value;
    socket.emit('LoginInfos', {email, password});
};

function SignupInfos() {
    // console.log("Signup");
    var email = document.getElementById("emailInput").value;
    var password = document.getElementById("passwordInput").value;
    socket.emit('SignupInfos', {email, password});
};

//Action quand on clique sur le bouton du widget
$(document).on("click", ".gridster .option-button", function () {
    $(this).parent().parent().find("div.widget-options").toggleClass("visible").toggleClass("invisible");
    $(this).parent().parent().find("div.widget-content").toggleClass("invisible").toggleClass("visible");
});

$(document).on("click", ".gridster .close-button", function () {
    var selector = $(this).parent().parent();
    var object = widgetData($(selector).find("form"));
    //object
    socket.emit('removewidget', object);
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
            var selector = $(ui.$player.context);
            var object = widgetData($(selector).find("form"));
            object["positions"] = {
                col: $(selector).data("col"),
                row: $(selector).data("row"),
                sizex: $(selector).data("sizex"),
                sizey: $(selector).data("sizey"),
            };
            socket.emit('updatePosition', object);
        }
    }
}).data('gridster');

var widgetData = function (selector) {
    var service = $(selector).data("service");
    var id = $(selector).data("id");
    var formData = $(selector).serializeArray();
    var array = {};
    array["id"] = id;
    formData.forEach(function (key) {
        array[key.name] = key.value;
    });
    return {service: service, options: array};
};


$(document).ready(function () {
    var submitRequest = function (requestData) {
        console.log("on envoie");
        socket.emit('submit_form', requestData,
            function (result) {
                console.log("Reception:");
                if (result !== "") {
                    console.log("GOOD:");
                    console.log(requestData);
                    $("#" + requestData.options.id).html(result);
                    $("#" + requestData.options.id + " form").on('submit', submitFunction);
                } else {
                    console.log("ERROR:");
                    console.log(result);
                }
            });
    };

    var submitFunction = function (event) {
        if (event !== undefined)
            event.preventDefault();
        var data = widgetData(this);
        data["positions"] = {
            col: $(this).data("col"),
            row: $(this).data("row"),
            sizex: $(this).data("sizex"),
            sizey: $(this).data("sizey"),
        };
        submitRequest(data);
    };

    socket.on('addwidget', function (object) {
        var optionButton = '<button class="option-button" style="position:relative;z-index:100;float:right;">&#9881;</button>';
        var closeButton = '<button class="close-button" style="position:relative;z-index:100;float:right;">&#128465;</button>';
        console.log(object);
        if ("positions" in object && "col" in object.positions && "row" in object.positions && "sizex" in object.positions && "sizey" in object.positions) {
            console.log("positions found");
            gridster.add_widget.apply(gridster, ['<li><div class="button">' + closeButton + optionButton + '</div>' + object.html + '</li>',
                object.positions.sizex, object.positions.sizey, object.positions.col, object.positions.row,]);
        } else {
            console.log("positions not found");
            gridster.add_widget.apply(gridster, ['<li><div class="button">' + closeButton + optionButton + '</div>' + object.html + '</li>', 2, 2]);
            var id = "#" + object.id;
            object["positions"] = {
                col: $(id).parent().data("col"),
                row: $(id).parent().data("row"),
                sizex: $(id).parent().data("sizex"),
                sizey: $(id).parent().data("sizey"),
            };
            socket.emit('updatePosition', object);
        }
        /*setInterval(function(){ alert("Hello"); }, 3000);*/
        $("#" + object.id + "  form").on('submit', submitFunction);
        var refresh = function (id) {
            console.log("refresh " + id);
            if (id === undefined)
                clearInterval(uid);
            else if ($("#" + id).find("div.widget-options").hasClass("visible"))
                return;
            console.log($("#" + id + "  form").submit());
        };
/*        var uid = setInterval(refresh.bind(null, object.id), 3000);*/ //ça marche
    });

    $(".services-gallery .service .card").on('click', function () {
        console.log("click");
        var service = $(this).data("id");
        socket.emit('addwidget', service);
    });

});

