let diameter;  // 扇形半径
let palette_size = { w: 0, h: 0 };
let palette = [];

let dataIndex = 0;

let total = 0;
function setup() {
    createCanvas(720, 720);
    background(224);


    diameter = Math.min(width, height) / 5 * 2.5;
    total = getTotal(dataIndex);
    palette = initPalette(Object.keys(data[dataIndex].regionInfo).length);
    palette_size.w = width / 18;
    palette_size.h = height / 48;
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

    // 画扇形  arc--3点钟方向开始计算，顺时针为+
    drawChart();

    // 调色板
    drawPalette();
}

const drawTitle = () => {
    noStroke();
    fill(0);

    textSize(35);
    text(generateTitle(data[dataIndex].timeInfo),
        width / 10, height / 23,
        width * 2 / 3, width * 2 / 3 / 5);
}

const drawChart = () => {
    stroke(50);
    strokeWeight(2);

    let currentStart = -PI / 2;  // 扇形起始
    let currentEnd = 0;  // 扇形终点
    let currentRadian = 0;  // 扇形弧度
    let paletteNo = 0;
    for (const key in data[dataIndex].regionInfo) {
        if (Object.hasOwnProperty.call(data[dataIndex].regionInfo, key)) {
            currentRadian = data[dataIndex].regionInfo[key] / total * 2 * PI;
            currentEnd = currentStart + currentRadian;

            // 扇形
            fill(palette[paletteNo].r, palette[paletteNo].g, palette[paletteNo].b);
            arc(width / 2, height / 2.7,
                diameter, diameter,
                currentStart, currentEnd,
                PIE);

            currentStart = currentEnd;
        }
        paletteNo++;
    }
}

const drawPalette = () => {
    for (let i = 0; i < Object.keys(data[dataIndex].regionInfo).length; i++) {
        // 调色板框框
        fill(palette[i].r, palette[i].g, palette[i].b);
        stroke(2);
        strokeWeight(1);

        rect(Math.floor(i / 6) * width / 4 + width / 8, (i % 6) * height / 20 + width * 41 / 60,
            palette_size.w, palette_size.h);

        // 调色板标题
        fill(0);
        noStroke();

        textSize(12)
        text(Object.keys(data[dataIndex].regionInfo)[i],
            Math.floor(i / 6) * width / 4 + width / 8 + palette_size.w + 5, (i % 6) * height / 20 + width * 41 / 60,
            140, 100)
    }
}

const getTotal = dataIndex => {
    let total = 0;
    for (const key in data[dataIndex].regionInfo) {
        if (Object.hasOwnProperty.call(data[dataIndex].regionInfo, key)) {
            total += data[dataIndex].regionInfo[key];
        }
    }
    return total;
}


/* 键盘交互 */
function keyPressed() {
    // 通过 '[', ']' 调整当前显示的数据
    if (key == ']') {
        dataIndex++;
        regularizeDataIndex();
        total = getTotal(dataIndex);
    }
    else if (key == '[') {
        dataIndex--;
        regularizeDataIndex();
        total = getTotal(dataIndex);
    }
    else if (key == 'c') {
        palette = initPalette(Object.keys(data[dataIndex].regionInfo).length);
    }
}

/* 防止数组下标越界 */
const regularizeDataIndex = () => {
    if (dataIndex >= data.length) dataIndex = 0;
    else if (dataIndex < 0) dataIndex = data.length - 1;
}

/* 随机调色板 */
const initPalette = len => {
    let palette = [];
    for (let i = 0; i < len; i++) {
        let color = { r: Math.random() * 255, g: Math.random() * 255, b: Math.random() * 255 };
        palette.push(color);
    }
    return palette;
}

/* 生成标题 */
const generateTitle = timeInfo => {
    return `墨尔本${timeInfo.Year}年${timeInfo.Month}月${timeInfo.Mdate}日${timeInfo.Hour}时人流统计图`;
}