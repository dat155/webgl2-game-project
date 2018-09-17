/**
 * WARNING!
 * Synchronous XMLHttpRequest on the main thread is deprecated because of its detrimental effects to the end user’s experience. For more help http://xhr.spec.whatwg.org/
 *
 * @param { String } url
 * @returns { String }
 */
export default function fetchShaderSource(url) {
    const request = new XMLHttpRequest();

    request.overrideMimeType('text/plain');

    request.open('GET', url, false);  // 'false' makes the request synchronous
    request.send(null);
    
    if (request.status === 200) {
        return request.responseText;
    } else {
        throw new Error('Unable to fetch shader source. ' + request.status + ': ' + request.statusText);
    }
}