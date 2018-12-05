module.exports.checkPlatformKey = function(key, platform) {
    if(key == null) {
        return ""
    }
    if(key.startsWith("platform.")) {
        key = key.replace("platform.", "")
        var platformKey = platform + "."
        if(key.startsWith(platformKey)) {
            return key.replace(platformKey, "")
        } else {
            return ""
        }
    } else {
        return key
    }
}