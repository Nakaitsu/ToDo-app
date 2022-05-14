const clientHTTP = new XMLHttpRequest()

clientHTTP.get = (url, callback) => {
  clientHTTP.onreadystatechange = function() {
    if(clientHTTP.readyState === XMLHttpRequest.DONE && clientHTTP.status === 200) {
      callback(clientHTTP.responseText)
    }
  }

  clientHTTP.open('GET', url, true)
  clientHTTP.send(null)
}

module.exports = clientHTTP