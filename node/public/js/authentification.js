var config = {
    apiKey: "AIzaSyD1duOZhLJLjJqUp2Ja8Iug5UStmcwJHwM",
    authDomain: "mon-super-projet-de2f3.firebaseapp.com",
    databaseURL: "https://mon-super-projet-de2f3.firebaseio.com",
    projectId: "mon-super-projet-de2f3",
    storageBucket: "mon-super-projet-de2f3.appspot.com",
    messagingSenderId: "97436209942"
};
var socket = io.connect(document.URL);
socket.emit('join');

firebase.initializeApp(config);

const emailInput = document.getElementById('emailInput');
const passwordInput = document.getElementById('passwordInput');
const btnLogIn = document.getElementById('btnLogIn');
const btnSignUp = document.getElementById('btnSignUp');

// Log In
btnLogIn.addEventListener("click", e => {
    const email = emailInput.value;
    const password = passwordInput.value;
    const auth = firebase.auth();

    auth.signInWithEmailAndPassword(email, password);
});

// Log Out
btnLogOut.addEventListener("click", e => {
    firebase.auth().signOut();
});

// Create account
btnSignUp.addEventListener("click", e => {
    const email = emailInput.value;
    const password = passwordInput.value;
    const auth = firebase.auth();

    auth.createUserWithEmailAndPassword(email, password);
});


// socket.on('disco', function() {
// 	$("#buttons").show();
// 	$("#btnLogOut").show();
// });

// socket.on('connect', function() {
// 	$("#buttons").show();
// 	$("#btnLogOut").show();
// 	console.log("mdr");
// });


firebase.auth().onAuthStateChanged(firebaseUser => {
    if (firebaseUser) {
        console.log("co")
        $("#buttons").hide();
        $("#btnLogOut").show();
        // 	console.log(firebaseUser);
        // 	socket.on('connect', function(data) {
        // 		socket.emit('join', 'Hello World from client');
        // 	});

        // 	socket.on('broad', function(data) {
        // 		$('#future').html(data);
        // 	});
    }
    else {
        console.log("déco");
        $("#buttons").show();
        $("#btnLogOut").hide();
    }
});

//Action quand on clique sur le bouton du widget
$(document).on("click", ".gridster .option-button", function () {
    $(this).parent().parent().find("div.widget-options").toggleClass("visible").toggleClass("invisible");
    $(this).parent().parent().find("div.widget-content").toggleClass("invisible").toggleClass("visible");
});

$(document).on("click", ".gridster .close-button", function () {
    $(this).parent().parent().addClass("widgetremoving");
    gridster.remove_widget($('.widgetremoving'));
});

var createRequestData = function (service, urlOptions, widgetOptions) {
    return requestData = {
        'service': service,
        'urlOptions': urlOptions,
        'widgetOptions': widgetOptions
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
                    console.log(result);
                    $("#" + requestData.widgetOptions.id).html(result);
                    $("#" + requestData.widgetOptions.id + " form").on('submit', submitFunction);
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
        formData.forEach(function (key) {
            array[key.name] = key.value;
        });

        console.log(array);
        var requestData = createRequestData(service, array, {id: id});
        submitRequest(requestData);
    };

    socket.on('addwidget', function (html) {
        var optionButton = '<button class="option-button" style="position:relative;z-index:100;float:right;">&#9881;</button>';
        var closeButton = '<button class="close-button" style="position:relative;z-index:100;float:right;">&#128465;</button>';
        gridster.add_widget.apply(gridster, ['<li><div class="button">' + closeButton + optionButton + '</div>' + html + '</li>', 2, 2]);
        $(".widget form").on('submit', submitFunction);
    });

    $(".services-gallery .service .card").on('click', function () {
        console.log("click");
        var service = $(this).data("id");
        socket.emit('addwidget', service);
    });

});

