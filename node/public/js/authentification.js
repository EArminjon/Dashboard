var config = {
    apiKey: "AIzaSyD1duOZhLJLjJqUp2Ja8Iug5UStmcwJHwM",
    authDomain: "mon-super-projet-de2f3.firebaseapp.com",
    databaseURL: "https://mon-super-projet-de2f3.firebaseio.com",
    projectId: "mon-super-projet-de2f3",
    storageBucket: "mon-super-projet-de2f3.appspot.com",
    messagingSenderId: "97436209942"
};
var socket = io.connect(document.URL);

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

        // 	socket.on('messages', function(data) {
        // 		alert(data);
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