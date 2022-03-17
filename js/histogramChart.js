const data = JSON.parse(localStorage.getItem('data'));

function setup() {
    createCanvas(720, 720);
    background(224);
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
}