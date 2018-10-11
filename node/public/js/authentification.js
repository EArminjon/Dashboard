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
    $(this).parent().parent().addClass("widgetremoving");
    gridster.remove_widget($('.widgetremoving'));
});

var createRequestData = function (service, options, position) {
    return requestData = {
        'service': service,
        'options': options,
        'position': position,
    };
};

var gridster = $(".gridster ul").gridster({
    widget_base_dimensions: [100, 100],
    widget_margins: [5, 5],
    helper: 'clone',
    resize: {enabled: true},
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

    socket.on('addwidget', function (objet) {
        var optionButton = '<button class="option-button" style="position:relative;z-index:100;float:right;">&#9881;</button>';
        var closeButton = '<button class="close-button" style="position:relative;z-index:100;float:right;">&#128465;</button>';
        console.log(objet);
        if ("positions" in objet && "col" in objet.positions && "row" in objet.positions && "sizex" in objet.positions && "sizey" in objet.positions) {
            console.log("positions found");
            gridster.add_widget.apply(gridster, ['<li><div class="button">' + closeButton + optionButton + '</div>' + objet.html + '</li>',
                objet.positions.sizex, objet.positions.sizey, objet.positions.col, objet.positions.row, ]);
        } else {
            console.log("positions not found");
            gridster.add_widget.apply(gridster, ['<li><div class="button">' + closeButton + optionButton + '</div>' + objet.html + '</li>', 2, 2]);
        }
        $("#" + objet.id + "  form").on('submit', submitFunction);
    });

    $(".services-gallery .service .card").on('click', function () {
        console.log("click");
        var service = $(this).data("id");
        socket.emit('addwidget', service);
    });

});

