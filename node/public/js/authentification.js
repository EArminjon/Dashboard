var socket = io.connect(document.URL);

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

//Ajoute le gridster
var gridster;
$(function () {
    gridster = $(".gridster ul").gridster({
        widget_base_dimensions: [100, 100],
        widget_margins: [5, 5],
        helper: 'clone',
        resize: {
            enabled: true
        }
    }).data('gridster');

    //ajoute un élement
    gridster.add_widget.apply(gridster, ['<li> <button class="delete-button" style="position:relative; z-index:100;float: right;">卐</button>' + widgets[0] + '</li>', 2, 2]);
    gridster.add_widget.apply(gridster, ['<li> <button class="delete-button" style="position:relative; z-index:100;float: right;">卐</button>' + widgets[1] + '</li>', 2, 2]);
    gridster.add_widget.apply(gridster, ['<li> <button class="delete-button" style="position:relative; z-index:100;float: right;">卐</button>' + widgets[2] + '</li>', 2, 2]);
});

//Action quand on clique sur le bouton du widget
$(document).on("click", ".gridster .delete-button", function () {
    var gridster = $(".gridster ul").gridster().data('gridster');
    console.log($(this).parent("li:first").attr('id'));
    console.log(gridster);
    $(this).parent().find("div.widget-options").toggleClass("visible").toggleClass("invisible");
    $(this).parent().find("div.widget-content").toggleClass("invisible").toggleClass("visible");
});

var createRequestData = function (service, widget, array) {
    return requestData = {
        'service': service,
        'widget': widget,
        'options': array,
    };
};

submitRequest = function (requestData) {
    console.log("on envoie");
    socket.emit('submit_form', requestData,
        function (error, result) {
            console.log("Reception:");
            if (error === "" && result.error === "") {
                console.log("GOOD:");
                console.log(result);
                console.log(requestData);
                $("#" + requestData.id).html(result.data);
            } else {
                console.log("ERROR:");
                console.log(result);
            }
        });
};

var requestData = createRequestData('weather', 'today', {
    'id': 'widget_3',
    'city': 'Paris',
    'degree': 'c'
});
submitRequest(requestData);