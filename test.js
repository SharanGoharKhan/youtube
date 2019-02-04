// // function getdata() {
// //     t.items.forEach(function (item) {
// //         console.log(item.snippet.title)
// //     })
// // }

// // getdata()
// <script>
//         var GoogleAuth
//         function onSignIn(googleUser) {
//             gapi.load('client:auth2', _ => {
//                 gapi.client.init({
//                     'API_Key':'AIzaSyByZI3DUPG3RU1v7DsuUDS6DTBeyu7zqi8',
//                     'clientId': '1067553310367-e2s3t0r2spk8q97anr08ht2mqll4ocdi.apps.googleusercontent.com',
//                     'scope': ['https://www.googleapis.com/auth/youtube, https://www.googleapis.com/auth/youtube.force-ssl, https://www.googleapis.com/auth/youtube.readonly, https://www.googleapis.com/auth/youtubepartner'],
//                     'discoveryDocs': ['https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest']
//                 }).then(function () {
//                     GoogleAuth = gapi.auth2.getAuthInstance();

//                     // Listen for sign-in state changes.
//                     GoogleAuth.isSignedIn.listen(updateSigninStatus);
//                 });
//             })
//             var profile = googleUser.getBasicProfile();
//             console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
//             console.log('Name: ' + profile.getName());
//             console.log('Image URL: ' + profile.getImageUrl());
//             console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
//         }
//         function signOut() {
//             var auth2 = gapi.auth2.getAuthInstance();
//             auth2.signOut().then(function () {
//                 console.log('User signed out.');
//             });
//         }
//         //1067553310367-e2s3t0r2spk8q97anr08ht2mqll4ocdi.apps.googleusercontent.com
//         //916695427896-q289hhiid0e5gnun5agb2c1srke8d6id.apps.googleusercontent.com
//         // Google Auth object.
//         //gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().id_token
//         function onYoutubeList() {
//             // Example 2: Use gapi.client.request(args) function

//             var request = gapi.client.request({
//                 'method': 'GET',
//                 'path': '/youtube/v3/subscriptions',
//                 'params': {
//                     'part': 'snippet,contentDetails',
//                     'mine': 'true',
//                     'key': 'AIzaSyByZI3DUPG3RU1v7DsuUDS6DTBeyu7zqi8'
//                 }
//             });
//             // Execute the API request.
//             request.execute(function (response) {
//                 console.log(response);
//             });
//         }
//     </script>