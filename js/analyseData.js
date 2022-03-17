import readCsvAsync from './readFile.js';

let DataArr = new Array();
await readCsvAsync.then(res => {
    let resArr = res.split('\r\n');
    let keyNameArr = resArr[0].split(',');

    for (let i = 1; i < resArr.length; i++) {
        let dataObj = new Object();
        let dataArr = resArr[i].split(',');
        for (let j = 0; j < keyNameArr.length; j++) {
            dataObj[keyNameArr[j]] = dataArr[j];
        }
        DataArr.push(dataObj);
    }
})

export default DataArr;