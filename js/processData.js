const filePath = './src/2012_05-HOUR.CSV';
let data = new Array();
new Promise((resolve, reject) => {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', filePath);
    xhr.send();
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            resolve(xhr.responseText);
        }
    }
}).then(res => {
    let resArr = res.split('\r\n');
    let keyNameArr = resArr[0].split(',');

    for (let i = 1; i < resArr.length - 1; i++) {  // 剔除掉 resArr 中最后一个
        let dataObj = { timeInfo: {}, regionInfo: {} };
        let dataArr = resArr[i].split(',');
        for (let j = 0; j < keyNameArr.length; j++) {
            if (j <= 6) dataObj.timeInfo[keyNameArr[j]] = dataArr[j];
            else dataObj.regionInfo[keyNameArr[j]] = parseInt(dataArr[j]);
        }
        data.push(dataObj);
    }

    localStorage.setItem('data', JSON.stringify(data));
})

console.log('p5.js 既不能 import 又不能异步引入自己的代码，我真是服了啊啊啊啊啊!!!');