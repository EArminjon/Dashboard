var socket = io.connect(document.URL);
socket.emit('join');

const emailInput = document.getElementById('emailInput');
const passwordInput = document.getElementById('passwordInput');
const btnLogIn = document.getElementById('btnLogIn');
const btnSignUp = document.getElementById('btnSignUp');

function LoginInfos() {
    // console.log("Login");
    var email = document.getElementById("emailInput").value;
    var password = document.getElementById("passwordInput").value;
    socket.emit('LoginInfos', { email, password });
};

function SignupInfos() {
    // console.log("Signup");
    var email = document.getElementById("emailInput").value;
    var password = document.getElementById("passwordInput").value;
    socket.emit('SignupInfos', { email, password });
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

var createRequestData = function (service, options) {
    return requestData = {
        'service': service,
        'options': options,
    };
};

var gridster;
gridster = $(".gridster ul").gridster({
    widget_base_dimensions: [100, 100],
    widget_margins: [5, 5],
    helper: 'clone',
    resize: {enabled: true},
}).data('gridster');

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
        var service = $(this).data("service");
        var id = $(this).data("id");
        var formData = $(this).serializeArray();
        var array = {};
        array["id"] = id;
        formData.forEach(function (key) {
            array[key.name] = key.value;
        });

        console.log(array);
        var requestData = createRequestData(service, array);
        submitRequest(requestData);
    };

    socket.on('addwidget', function (objet) {
        var optionButton = '<button class="option-button" style="position:relative;z-index:100;float:right;">&#9881;</button>';
        var closeButton = '<button class="close-button" style="position:relative;z-index:100;float:right;">&#128465;</button>';

        gridster.add_widget.apply(gridster, ['<li><div class="button">' + closeButton + optionButton + '</div>' + objet.html + '</li>', 2, 2]);
        $("#" + objet.id + "  form").on('submit', submitFunction);
    });

    $(".services-gallery .service .card").on('click', function () {
        console.log("click");
        var service = $(this).data("id");
        socket.emit('addwidget', service);
    });

});

