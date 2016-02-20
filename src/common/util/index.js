function loadState() {
    var json = window.localStorage['imd']
    var defaultState = {
        exportFormat: 'hash',
        general: '',
        gist: '',
        lastSuccessfulGist: '',
        loading: false,
        newSectionId: '',
        sections: [],
        token: '',
        updating: false
    }
    return json ? {...defaultState, ...JSON.parse(json)} : defaultState
}


function utf8ToBase64(text) {
    return window.btoa(unescape(encodeURIComponent(text)))
}

function exportFile(text, filename) {
    var a = document.createElement('a')
    var base64 = utf8ToBase64(text)

    if ('download' in a) {
        a.href = 'data:text/markdown;base64,' + base64
        a.download = filename
        var event = document.createEvent('MouseEvents')
        event.initMouseEvent('click', true, true, window, 1, 0, 0, 0, 0,
                             false, false, false, false, 0, null)
                             a.dispatchEvent(event)
    }
    else if (typeof navigator.msSaveBlob == 'function') {
        navigator.msSaveBlob(new window.Blob([text], {
            type: 'text/markdown;charset=utf-8;'
        }), filename)
    }
    else {
        window.location.href =
            'data:application/octet-stream;base64,' + base64
    }
}

function store (namespace, data) {
    if (data) {
        return localStorage.setItem(namespace, JSON.stringify(data));
    }

    var store = localStorage.getItem(namespace);
    return (store && JSON.parse(store)) || [];
}

function storeTodoState(data) {
    return store('todo', data );
}

function storeTodoTags (data) {
    return store('todotags', data );
}

function readFile(file, afterRead){
    let reader = new FileReader();
    // 读完之后触发
    reader.onload  = (e) => {
        afterRead(e.target.result) 
    }
    reader.readAsText(file);
}

module.exports = {
    loadState,  exportFile, storeTodoState, storeTodoTags, readFile 
}
