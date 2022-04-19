const main = document.getElementById("main");
const segmentTable = document.getElementById("segmentTable");
const physicTable = document.getElementById("physicTable");
const pageFaultCounterDOM = document.getElementById("page-fault-counter");
let pageFaultCounter=0;
let Counter=0;
const autoBtn = document.getElementById("auto-btn");
let autoCheck = 1;
autoBtn.addEventListener("click", autoChoose);
let interval;

function autoChoose() {
    if (autoCheck===1) {
        autoCheck = -1;
        interval = setInterval(()=> {
            return makeProcess(Math.floor(Math.random()*pages.length));
        }, 501);
    }
    else {
        clearInterval(interval);
        autoCheck = 1;
    }
}

function drawMainMenu() {
    const addBtn = document.createElement("button");
    const nameLabel = document.createElement("label");
    const sizeLabel = document.createElement("label");
    const sizeInput = document.createElement("input");
    const nameInput = document.createElement("input");
    nameLabel.innerText = `Название`;
    addBtn.innerText = "Добавить процесс";
    sizeLabel.innerText = "Размер процесса (КБ)"
    addBtn.addEventListener("click", () =>addProcess(nameInput.value, sizeInput.value));
    nameLabel.appendChild(nameInput);
    sizeLabel.appendChild(sizeInput);
    main.appendChild(sizeLabel);
    main.appendChild(nameLabel);
    main.appendChild(addBtn);

}
drawMainMenu();

const physicMemory = [];
physicMemory.length = 30;
for (let i =0;i<physicMemory.length;i++)
    physicMemory[i]=0;


class page {

    name;
    address;
    appeals=0;
    physicSize=1;
    size;
}

let pages = [];
function addProcess(name, size) {
    let j=0;
    for(let i = 0; i<size; i+=4) {
        pages.push(new page());
        pages[pages.length-1].name=`${name}_${j}`;
        pages[pages.length-1].size = size-i >= 4 ? 4 : size-i;
        findSpace(pages[pages.length-1]);
        j++;
    }
    redrawSegmentTable();
    redrawPhysicTable();
}

function findSpace(process) {
    let i=0;
    let freeMemory;
    let iStart;
    while (i<physicMemory.length) {
        freeMemory = true;
        iStart=i;
        while (i<process.physicSize+iStart) {
            if(physicMemory[i]===0) {
                i++;
            }
            else {
                freeMemory = false;
                break;
            }
        }
        if(i===process.physicSize+iStart && freeMemory === true) {
            i-=process.physicSize;
            process.address = i;
            for(i; i<process.physicSize+iStart; i++) {
                physicMemory[i]=process.name;
            }
            break;
        }
        i++;
    }
}


function redrawSegmentTable() {
        if(document.getElementById("mainDiv"))
    segmentTable.removeChild(document.getElementById("mainDiv"));
    const mainDiv = document.createElement("div");
    mainDiv.id = "mainDiv";
    for(let i = 0; i<pages.length; i++) {
        mainDiv.appendChild(createSegment(pages[i], i));
    }
    segmentTable.appendChild(mainDiv);
}

function createSegment(process, i) {
    const div = document.createElement("div");
    div.innerText = `Страница ${process.name} - ${process.size}Кб`;
    const deleteButton = document.createElement("button");
    deleteButton.id = process.name;
    deleteButton.innerText = "Выполнить";
    deleteButton.addEventListener("click", () => makeProcess(i))
    div.appendChild(deleteButton);
    return div
}

async function makeProcess( i) {
    Counter++;
    // let useId=i;
    if(pages[i].address) {
        pages[i].appeals++;
        await highLight(i);
    }
    else {
        let ind = pageFault(i);
        redrawPhysicTable();
        await highLight(ind);
    }
    pageFaultCounterDOM.innerText = `Количество вызвовов page fault: ${pageFaultCounter}, page fault/all=${Math.round(pageFaultCounter/Counter*100)}%`
    //redrawSegmentTable();
}

async function highLight(i) {
    //await wait(50);
    let test = document.getElementById(`ph${pages[i].name}`);
    test.style.backgroundColor = "green";
    await wait(500);
    test.style.backgroundColor = "yellow";
}

function pageFault(ind) {
    pageFaultCounter++;
    let min = Infinity;
    let index;
    for (let i = 0; i<pages.length; i++) {
        if(pages[i].appeals < min && Number.isInteger(pages[i].address)) {
            min = pages[i].appeals;
            index=i;
        }
    }
    pages[ind].address =pages[index].address;
    pages[ind].appeals++;
    physicMemory[pages[ind].address]=pages[ind].name;
    pages[index].address = undefined;

    return ind;
}

function wait(ms)  {
    return new Promise( resolve => {
        setTimeout(()=> {resolve('')} ,ms );
    })
}

function redrawPhysicTable() {
    if(physicTable.childElementCount>0)
        physicTable.removeChild(document.getElementById("physicMainDiv"));
    const mainDiv = document.createElement("div");
    mainDiv.id = "physicMainDiv";
    for (let i = 0; i<physicMemory.length; i++) {
        drawPhysicDiv(i, mainDiv);
    }
    physicTable.appendChild(mainDiv)
}

function drawPhysicDiv(i, mainDiv) {
    const div = document.createElement("div");
    div.className = "physicDiv"
    if(physicMemory[i]===0) {
        div.style.backgroundColor = "white";
    }
    else {
        div.style.backgroundColor = "yellow";
        div.innerText = `${physicMemory[i]}`;
        div.id = "ph"+physicMemory[i];
    }
    mainDiv.appendChild(div);
}



