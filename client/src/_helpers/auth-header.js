export function authHeader() {
    // return authorization header with jwt token
    let user = JSON.parse(localStorage.getItem('user'));
    let udid = window.navigator.userAgent.replace(/\D+/g, '');

    let nAgt = navigator.userAgent;
    let browserName = navigator.appName;
    let nameOffset, verOffset;

    if ((verOffset = nAgt.indexOf("OPR/")) != -1) {
        browserName = "Opera";
    }
    else if ((verOffset = nAgt.indexOf("Opera")) != -1) {
        browserName = "Opera";
    }
    else if ((verOffset = nAgt.indexOf("MSIE")) != -1) {
        browserName = "Microsoft Internet Explorer";
    }
    else if ((verOffset = nAgt.indexOf("Chrome")) != -1) {
        browserName = "Chrome";
    }
    else if ((verOffset = nAgt.indexOf("Safari")) != -1) {
        browserName = "Safari";
    }
    else if ((verOffset = nAgt.indexOf("Firefox")) != -1) {
        browserName = "Firefox";
    }
    else if ((nameOffset = nAgt.lastIndexOf(' ') + 1) <
        (verOffset = nAgt.lastIndexOf('/'))) {
        browserName = nAgt.substring(nameOffset, verOffset);
    }
    let headers = { 'Content-Type': 'application/json', 'api-key': 1, 'udid': udid, 'device-type': browserName };

    if (user && user.access_token) {
        headers.authorization = user.access_token;
    }
    return headers
}