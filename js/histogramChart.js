const data = JSON.parse(localStorage.getItem('data'));
let dataIndex = 0;

const regionNames = Object.keys(data[0].regionInfo);
let regionNamesSort;

let sortMode = false;


let axis_size;
let axis_pos;

function setup() {
    createCanvas(600, 600);
    background(224);

    axis_size = { w: width * .8, h: height * .85 };
    axis_pos = { x: width * .5 - axis_size.w / 2 + axis_size.w / 15, y: height * .5 - axis_size.h / 2 };

    // 操作提示
    alert("'[' ']'键切换时间，空格键切换默认显示&排序显示");
}

function draw() {
    background(224);
    // 画布边框
    fill(255, 100);
    strokeWeight(10);
    stroke(0, 100);
    rectMode(CORNER)
    rect(0, 0, width, height);



    /* 画图功能实现 */

    // 画标题
    drawTitle();

    // 画坐标轴、参照线
    drawAxis();

    // 画数据
    drawScaleSquare(dataIndex);
}

function keyPressed() {
    if (key == ']') {
        dataIndex++;
        regularizeDataIndex();
    } else if (key == '[') {
        dataIndex--;
        regularizeDataIndex();
    } else if (key == ' ') {
        sortMode = !sortMode;
    }
}

const regularizeDataIndex = () => {
    if (dataIndex >= data.length) dataIndex = 0;
    else if (dataIndex < 0) dataIndex = data.length - 1;
}


/* 画主图区、y轴刻度 */
const drawAxis = () => {
    fill(255);
    stroke(255);
    strokeWeight(0);

    // 主图区
    rect(axis_pos.x, axis_pos.y, axis_size.w, axis_size.h);
}

/* 根据数据生成坐标尺度、直方 */
const regionInterval = 6;  // 直方之间的间距
const axisHorizontal = 0.98;  // 纵轴占比
const subsectionNum = 10;  // x 轴分段数
const drawScaleSquare = dataIndex => {
    const rInfo = data[dataIndex].regionInfo;
    let tempRegionNames = [...regionNames];  // 只把值赋予新的变量，地址不给。 不这么做的话在排序时原数组的数据也将改变
    let tempRegionNamesSort = bubbleSort(tempRegionNames, rInfo);
    let maxNum = rInfo[tempRegionNamesSort[0]];
    let maxX = (Math.ceil(maxNum / 100) + 1) * 100;

    // 控制数值范围，根据当前数集的最大数据调整
    if (maxNum >= 1000) maxX = (Math.ceil(maxNum / 100) + 1) * 100;
    else if (maxNum >= 200 && maxNum < 1000) maxX = Math.ceil(maxNum / 100) * 100;
    else maxX = (Math.ceil(maxNum / 10) + 1) * 10;

    if (sortMode) {
        tempRegionNames = [...tempRegionNamesSort];
    }

    // 画 y 轴刻度
    stroke(100);
    strokeWeight(2);
    line(axis_pos.x, axis_pos.y,
        axis_pos.x, axis_pos.y + axis_size.h)
    for (let i = 0; i <= tempRegionNames.length; i++) {
        stroke(100);
        strokeWeight(2);
        line(axis_pos.x - 4, axis_pos.y + axis_size.h / tempRegionNames.length * i,
            axis_pos.x, axis_pos.y + axis_size.h / tempRegionNames.length * i);

        fill(100)
        stroke(100);
        strokeWeight(.1);
        textSize(8);
        text(tempRegionNames[i],
            axis_pos.x - 75, axis_pos.y + axis_size.h / tempRegionNames.length * i + 5,
            80, 50);
    }

    // x 轴信息
    for (let i = 0; i <= subsectionNum; i++) {
        if (i > 0) {
            stroke(230, 230, 240);
            strokeWeight(1);
            line(axis_pos.x + (axis_size.w * axisHorizontal) / subsectionNum * i, axis_pos.y,
                axis_pos.x + (axis_size.w * axisHorizontal) / subsectionNum * i, axis_pos.y + axis_size.h);
        }

        // x 轴数字
        fill(100);
        stroke(100);
        strokeWeight(.1);
        textSize(11);
        // rectMode(CORNER);
        text(maxX / subsectionNum * i,
            axis_pos.x + (axis_size.w * axisHorizontal) / subsectionNum * i - 8, axis_pos.y + axis_size.h + 6,
            50, 20);
    }

    // 柱子
    for (let i = 0; i < tempRegionNames.length; i++) {
        fill(80, 110, 200);
        noStroke();
        rectMode(CORNER);
        rect(axis_pos.x, axis_pos.y + axis_size.h / tempRegionNames.length * i + regionInterval / 2,
            (axis_size.w * axisHorizontal) * rInfo[tempRegionNames[i]] / maxX, axis_size.h / tempRegionNames.length - regionInterval)
    }
}



const bubbleSort = (arr, obj) => {  // 地址不变
    let newArr = [...arr];
    for (let i = 0; i < newArr.length - 1; i++) {
        for (let j = 0; j < newArr.length - 1 - i; j++) {
            if (obj[newArr[j]] < obj[newArr[j + 1]]) {
                let temp = newArr[j + 1];
                newArr[j + 1] = newArr[j];
                newArr[j] = temp;
            }
        }
    }
    return newArr;
}


/* 画标题 */
const drawTitle = () => {
    noStroke();
    fill(0);

    textSize(18);
    text(generateTitle(dataIndex),
        width / 4.3, height / 27,
        width * .9, height * .1);
}

/* 生成标题 */
const generateTitle = dataIndex => {
    return `墨尔本${data[dataIndex].timeInfo.Year}年${data[dataIndex].timeInfo.Month}月${data[dataIndex].timeInfo.Mdate}日${data[dataIndex].timeInfo.Hour}时人流柱状图`;
}