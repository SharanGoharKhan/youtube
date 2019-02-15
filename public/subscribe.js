function createResource(properties) {
    var resource = {};
    var normalizedProps = properties;
    for (var p in properties) {
        var value = properties[p];
        if (p && p.substr(-2, 2) == '[]') {
            var adjustedName = p.replace('[]', '');
            if (value) {
                normalizedProps[adjustedName] = value.split(',');
            }
            delete normalizedProps[p];
        }
    }
    for (var p in normalizedProps) {
        // Leave properties that don't have values out of inserted resource.
        if (normalizedProps.hasOwnProperty(p) && normalizedProps[p]) {
            var propArray = p.split('.');
            var ref = resource;
            for (var pa = 0; pa < propArray.length; pa++) {
                var key = propArray[pa];
                if (pa == propArray.length - 1) {
                    ref[key] = normalizedProps[p];
                } else {
                    ref = ref[key] = ref[key] || {};
                }
            }
        };
    }
    return resource;
}

function removeEmptyParams(params) {
    for (var p in params) {
        if (!params[p] || params[p] == 'undefined') {
            delete params[p];
        }
    }
    return params;
}

function executeRequest(request, cb) {
    request.execute(function (response) {
        if (response.error)
            alert('Couldnt subscribe')
        else {
            cb()
        }
    });
}

function buildApiRequest(requestMethod, path, params, properties, cb) {
    params = removeEmptyParams(params);
    var request;
    if (properties) {
        var resource = createResource(properties);
        request = gapi.client.request({
            'body': resource,
            'method': requestMethod,
            'path': path,
            'params': params
        });
    } else {
        request = gapi.client.request({
            'method': requestMethod,
            'path': path,
            'params': params
        });
    }
    executeRequest(request, cb);
}

/***** END BOILERPLATE CODE *****/


function defineRequest(channelId, item_id) {
    // See full sample for buildApiRequest() code, which is not 
    // specific to a particular API or API method.
    if (GoogleAuth && !GoogleAuth.isSignedIn.get()) GoogleAuth.signIn()
    else {
        UnsubscribeButton = UnsubscribeButton.bind({ channelId })
        if ($('#' + channelId).attr('class') === 'sub-btn') {
            buildApiRequest('POST',
                '/youtube/v3/subscriptions',
                { 'part': 'snippet' },
                {
                    'snippet.resourceId.kind': 'youtube#channel',
                    'snippet.resourceId.channelId': channelId
                }, UnsubscribeButton);
        }
        else {
            SubscribeButton = SubscribeButton.bind({ channelId })
            buildApiRequest('DELETE',
                '/youtube/v3/subscriptions',
                { 'id': item_id }, null, SubscribeButton);
        }
    }

}

function UnsubscribeButton() {
    $(("#" + this.channelId)).attr('class', 'subbed-btn');
    $(("#" + this.channelId)).text('SUBSCRIBED');
}

function SubscribeButton() {
    $(("#" + this.channelId)).attr('class', 'sub-btn');
    $(("#" + this.channelId)).text('SUBSCRIBE');
}