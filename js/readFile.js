const filePath = './src/2012_05-HOUR.CSV';

export default new Promise((resolve, reject) => {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', filePath);
    xhr.send();
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            resolve(xhr.responseText);
        } 
    }
})
