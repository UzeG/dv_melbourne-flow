let data = JSON.parse(localStorage.getItem('data'));
let dateIndex = 0;
let regionNames;
let regionIndex = 0;

let axis_size;
let axis_pos;

let axis_x_line_length = 5;


function setup() {
    createCanvas(700, 533);
    background(224);

    axis_size = { w: width * .8, h: height * .8 };
    axis_pos = { x: width * .5, y: height * .5 };

    data = processData();
    regionNames = Object.keys(data[0].regionInfo);

    // 操作提示
    alert("'[' ']'键切换时间，'-' '+'键切换地区");
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
    drawPointLine(dateIndex, regionIndex);
}


/* 处理数据为如下格式 */
// let arr = [
//     {
//         date: xx年xx月xx日
//         regionInfo: {
//             xxx地区名: [零点人流, 一点人流, ...],
//             xxx地区名:...
//         }
//     }
// ]
const processData = () => {
    let newData = [];
    let hour = 0;
    data.forEach(hourData => {
        if (hour == 0) {
            newData.push({
                date: { Year: hourData.timeInfo.Year, Month: hourData.timeInfo.Month, Mdate: hourData.timeInfo.Mdate },
                regionInfo: {}
            });
            for (const regionName in hourData.regionInfo) {
                if (Object.hasOwnProperty.call(hourData.regionInfo, regionName)) {
                    newData[newData.length - 1].regionInfo[regionName] = [];
                }
            }
        }
        for (const regionName in hourData.regionInfo) {
            if (Object.hasOwnProperty.call(hourData.regionInfo, regionName)) {
                newData[newData.length - 1].regionInfo[regionName].push(hourData.regionInfo[regionName]);
            }
        }

        hour++;
        if (hour == 24) hour = 0;
    })

    return newData;
}

function keyPressed() {
    if (key == ']') {
        dateIndex++;
        regularizeDateIndex();
    } else if (key == '[') {
        dateIndex--;
        regularizeDateIndex();
    } else if (key == '=') {
        regionIndex++;
        regularizeRegionIndex();
    } else if (key == '-') {
        regionIndex--;
        regularizeRegionIndex();
    }
}

const regularizeDateIndex = () => {
    if (dateIndex >= data.length) dateIndex = 0;
    else if (dateIndex < 0) dateIndex = data.length - 1;
}
const regularizeRegionIndex = () => {
    if (regionIndex >= regionNames.length) regionIndex = 0;
    else if (regionIndex < 0) regionIndex = regionNames.length - 1;
}


/* 画标题 */
const drawTitle = () => {
    noStroke();
    fill(0);

    textSize(18);
    text(generateTitle(dateIndex, regionIndex),
        width / 10, height / 23,
        width * .9, height * .1);
}

/* 画坐标轴、参照线 */
const drawAxis = () => {
    fill(255);
    stroke(255);
    strokeWeight(0);
    rectMode(CENTER);

    // 主图区
    rect(axis_pos.x, axis_pos.y, axis_size.w, axis_size.h);

    // x 轴刻度
    stroke(100);
    strokeWeight(2);
    line(axis_pos.x - axis_size.w / 2, axis_pos.y + axis_size.h / 2,
        axis_pos.x + axis_size.w / 2, axis_pos.y + axis_size.h / 2)
    for (let i = 0; i < 24; i++) {
        stroke(100);
        strokeWeight(2);
        line(axis_pos.x - axis_size.w / 2 + axis_size.w / 23 * i, axis_pos.y + axis_size.h / 2,
            axis_pos.x - axis_size.w / 2 + axis_size.w / 23 * i, axis_pos.y + axis_size.h / 2 + axis_x_line_length);

        // x 轴信息
        fill(100)
        stroke(100);
        strokeWeight(.1);
        textSize(10);
        rectMode(RADIUS);
        text(i,
            axis_pos.x - axis_size.w / 2 + axis_size.w / 23 * i - 4, axis_pos.y + axis_size.h / 2 + 10,
            20, 20);
    }

}

/* 根据数据生成点和线 */
const axisVertical = 0.98;  // 横轴占比
const ellipseRadius = 5;  // 原点直径
const subsectionNum = 10;  // y 轴分段数
const drawPointLine = (dateIndex, regionIndex) => {
    const rInfo = data[dateIndex].regionInfo[regionNames[regionIndex]];
    let maxNum = Math.max(...rInfo);
    // let minNum = Math.min(...rInfo);
    let maxY = (Math.ceil(maxNum / 100) + 1) * 100;

    // y 轴刻度
    for (let i = 0; i <= subsectionNum; i++) {
        if (i > 0) {
            stroke(230, 230, 240);
            strokeWeight(1);
            line(axis_pos.x - axis_size.w / 2, axis_pos.y + axis_size.h / 2 - (axis_size.h * axisVertical) / subsectionNum * i,
                axis_pos.x + axis_size.w / 2, axis_pos.y + axis_size.h / 2 - (axis_size.h * axisVertical) / subsectionNum * i);
        }

        // y 轴信息
        fill(100)
        stroke(100);
        strokeWeight(.1);
        textSize(12);
        rectMode(RADIUS);
        text(maxY / subsectionNum * i,
            axis_pos.x - axis_size.w / 2 - 32, axis_pos.y + axis_size.h / 2 - (axis_size.h * axisVertical) / subsectionNum * i - 5,
            50, 20)
    }

    for (let i = 0; i < rInfo.length; i++) {
        // 画点
        noFill();
        stroke(80, 110, 200);
        strokeWeight(2);
        ellipse(axis_pos.x - axis_size.w / 2 + axis_size.w / 23 * i, axis_pos.y + axis_size.h / 2 - rInfo[i] / maxY * (axis_size.h * axisVertical),
            ellipseRadius);

        // 连线
        if (i > 0) {
            strokeWeight(1);
            line(axis_pos.x - axis_size.w / 2 + axis_size.w / 23 * (i - 1), axis_pos.y + axis_size.h / 2 - rInfo[(i - 1)] / maxY * (axis_size.h * axisVertical),
                axis_pos.x - axis_size.w / 2 + axis_size.w / 23 * i, axis_pos.y + axis_size.h / 2 - rInfo[i] / maxY * (axis_size.h * axisVertical))
        }
    }
}

/* 生成标题 */
const generateTitle = (dateIndex, regionIndex) => {
    return `墨尔本${regionNames[regionIndex]}地区${data[dateIndex].date.Year}年${data[dateIndex].date.Month}月${data[dateIndex].date.Mdate}日人流变化统计图`;
}