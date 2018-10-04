(function() {
	var config = {
	  apiKey: "AIzaSyD1duOZhLJLjJqUp2Ja8Iug5UStmcwJHwM",
	  authDomain: "mon-super-projet-de2f3.firebaseapp.com",
	  databaseURL: "https://mon-super-projet-de2f3.firebaseio.com",
	  projectId: "mon-super-projet-de2f3",
	  storageBucket: "mon-super-projet-de2f3.appspot.com",
	  messagingSenderId: "97436209942"
};
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

	firebase.auth().onAuthStateChanged(firebaseUser => {
		if (firebaseUser) {
			console.log(firebaseUser);
			// window.location.href = "authent.html";
		}
		else {
			console.log("mdr");
		};
	})

}());