export default {
    parser(str) {
        if(!str) return {};

        str = decodeURIComponent(str);
        let objCookie = {};

        str.split(';').map(item => {
            let prop = item.split('=');
            objCookie[prop[0].trim()] = prop[1].trim()
        })

        return objCookie || {};
    } ,

    get(name , cookie) {
        let objCookie = !cookie && process.client ? this.parser(document.cookie) : this.parser(cookie);
        return objCookie[name];
    } ,

    set(name , value , exdays = -1) {
        let date = new Date();
        date.setTime(date.getTime() + (exdays * 24 * 60 * 60 * 1000));
        let expires = "expires=" + date.toUTCString();
        if(process.client) document.cookie = name + "=" + value + ";" + expires + ";path=/";
    } ,

    remove(name) {
        if(process.client) document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    }
}