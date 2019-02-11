var channelsTable
var channelsList = []
var likedVideos = []
var GoogleAuth
var SCOPE = 'https://www.googleapis.com/auth/youtube https://www.googleapis.com/auth/youtube.force-ssl https://www.googleapis.com/auth/youtubepartner https://www.googleapis.com/auth/youtube.readonly'

function handleClientLoad() {
    // Load the API's client and auth2 modules.
    // Call the initClient function after the modules load.
    gapi.load('client:auth2', initClient)
}

function initClient() {
    // Retrieve the discovery document for version 3 of YouTube Data API.
    // In practice, your app can retrieve one or more discovery documents.
    var discoveryUrl = 'https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest'

    // Initialize the gapi.client object, which app uses to make API requests.
    // Get API key and client ID from API Console.
    // 'scope' field specifies space-delimited list of access scopes.
    gapi.client.init({
        'apiKey': 'AIzaSyBGjeEkTzTDTglXFQSCSxXqtB5-Hj7V6BA',
        'discoveryDocs': [discoveryUrl],
        'clientId': '53217466192-ml4t4nksq7kragj93v5797ffup9ujgbi.apps.googleusercontent.com',
        'scope': SCOPE
    }).then(function () {
        GoogleAuth = gapi.auth2.getAuthInstance()

        // Listen for sign-in state changes.
        GoogleAuth.isSignedIn.listen(updateSigninStatus)

        // Handle initial sign-in state. (Determine if user is already signed in.)
        var user = GoogleAuth.currentUser.get()
        setSigninStatus()
        // Call handleAuthClick function when user clicks on
        //      "Sign In/Authorize" button.
        $('#sign-in-or-out-button').click(function () {
            handleAuthClick()
        })
        $('#revoke-access-button').click(function () {
            revokeAccess()
        })

        $('#main-btn').click(function () {
            handleAuthClick()
        })
        
    })
}


function handleAuthClick() {
    if (GoogleAuth.isSignedIn.get()) {
        // User is authorized and has clicked 'Sign out' button.
        GoogleAuth.signOut()
    } else {
        // User is not signed in. Start Google auth flow.
        GoogleAuth.signIn()
    }
}

function revokeAccess() {
    GoogleAuth.disconnect()
}

// UI compatible version- alternate to handleAuthClick()
function handleLoginClick(){
    if (GoogleAuth.isSignedIn.get()) {
        // User is authorized and has clicked 'Sign out' button.
        GoogleAuth.signOut()
        // for now do nothin
    } else {
        // User is not signed in. Start Google auth flow.
        GoogleAuth.signIn()
    }
}

function setSigninStatus(isSignedIn) {
    var user = GoogleAuth.currentUser.get()
    var isAuthorized = user.hasGrantedScopes(SCOPE)
    if (isAuthorized) {

        // if it is on callencer/link
        if( window.location.href.split('/').length == 5   )
        {
            // do nothing
            // remove flex from main container though
            //$("#main_container").removeClass("main_body")
        }
        else{
            $('#main_container').html("<div id=\"main_body\" class=\"main_body\"></div>")
            $("#main_body").html(`
            <h3>Your link is generated</h3>

                <div class="link-container input-group mb-3">
                    <input id="link-input" readonly type="text" class="form-control link-input" placeholder="Link" >
                    <div  class="input-group-append">
                    <button id="clipboard-btn" class="btn btn-outline-secondary  clipboard-btn" type="button">
                        <img class="clipboard-icon" src="/images/clipboard-with-pencil-.svg" />
                        Copy
                    
                    </button>
                    </div>
                </div> 
                </a><a href="#" id="a-sharedlink" target="blank">Go To Link</a>  


               `)
            $("#main_body").append("<a href=\"#\" id=\"main-btn\">DEBG- Sign Out</a>")
            $('#main-btn').click(function () {
                handleAuthClick()
            })
        }
        //$('#sign-in-or-out-button').html('Sign out')
        //$('#revoke-access-button').css('display', 'inline-block')
        //$('#auth-status').html('You are currently signed in and have granted ' +
        //    'access to this app.')
        getData() //load channel list, subscription list and user profile
        //$(".authenicate-request-text").hide()
        //$(".link-container").show()
    } else {
        $('#main_container').html("<div id=\"main_body\" class=\"main_body\"></div>")
        $("#main_body").html("<button id=\"main-btn\"  class=\"main_body-btn center-block\"><img class height=\"60px\" style=\" color: #fff;\"  width=\"56px\" src=\"/images/play-button.svg\" > LET\'S DO IT </button><p class=\"main_body-text\"> Share Subscribed Channels </p>   ")
        $('#main-btn').click(function () {
            handleAuthClick()
        })
        //$('#sign-in-or-out-button').html('Sign In/Authorize')
        //$('#revoke-access-button').css('display', 'none')
        //$('#auth-status').html('You have not authorized this app or you are ' +
        //    'signed out.')

        //$(".authenicate-request-text").show()
        //$(".link-container").hide()
    }
}

function updateSigninStatus(isSignedIn) {
    setSigninStatus()
}
function getSubscribedList(pageToken) {
    // Example 2: Use gapi.client.request(args) function
    var request = gapi.client.request({
        'method': 'GET',
        'path': '/youtube/v3/subscriptions',
        'params': { 'part': 'snippet', 'mine': 'true', 'maxResults': 50, pageToken }
    })
    // Execute the API request.
    request.execute(function (response) {
        console.log(response.items)
        response.items.forEach(channel => {
            let c = {
                channelId: channel.snippet.resourceId.channelId,
                // LENGTH CHECKS,
                description:channel.snippet.description.length>80?channel.snippet.description.substring(0,80)+"...":channel.snippet.description,
                title: channel.snippet.title > 35? channel.snippet.title.substring(0,35)+"...":channel.snippet.title
            }
            channelsList.push(c)
        })
        // channelsList = channelsList.concat(response.items)
        if (response.nextPageToken)
            getSubscribedList(response.nextPageToken)
        else {
            var user = GoogleAuth.currentUser.get()
            var profile = user.getBasicProfile()
            let userid = profile.getId()
            fetch('/channels', {
                method: 'POST',
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify({ userid, channelsList })
            })
                .then(response => response.json())
                .then(data => { console.log(data) })
                .catch(err => {
                    console.error(err)
                })
        }
    })
}
function getLikedVideos(pageToken) {
    // Example 2: Use gapi.client.request(args) function
    var request = gapi.client.request({
        'method': 'GET',
        'path': '/youtube/v3/videos',
        'params': { 'part': 'snippet', 'myRating': 'like', 'maxResults': 50, pageToken }
    })
    // Execute the API request.
    request.execute(function (response) {
        likedVideos = likedVideos.concat(response.items)
        if (response.nextPageToken)
            getLikedVideos(response.nextPageToken)
        else
            console.log(likedVideos)
    })
}
function getData() {
    getUserProfile()
    //getLikedVideos()
    getSubscribedList()
    getSharedLink()
}

function getSharedLink() {
    var user = GoogleAuth.currentUser.get()
    var profile = user.getBasicProfile()
    let data = {
        userid: profile.getId(),
        name: profile.getName(),
        imageUrl: profile.getImageUrl(),
        email: profile.getEmail()
    }
    $('#link-input').attr(  'value', $(location).attr('origin')+'/channels/' + data.userid)
    $('#a-sharedlink').attr('href', '/channels/' + data.userid)
    $('#txt-sharedlink').text($(location).attr('protocol')+$(location).attr('host')+'/channels/' + data.userid)
}

function getUserProfile() {
    var user = GoogleAuth.currentUser.get()
    var profile = user.getBasicProfile()
    let data = {
        userid: profile.getId(),
        name: profile.getName(),
        imageUrl: profile.getImageUrl(),
        email: profile.getEmail()
    }
    fetch('/accounts', {
        method: 'POST',
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(response => response.json())
        .then(data => { console.log(data) })
        .catch(err => {
            console.error(err)
        })
}