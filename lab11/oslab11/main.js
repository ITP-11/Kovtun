const root = document.getElementById("root");
const fileNameInput = document.getElementById("fileNameInput");
const fileFolderInput = document.getElementById("fileFolderInput");
const fileSizeInput = document.getElementById("fileSizeInput");
const addButton = document.getElementById("sendFile");
const deleteButton = document.getElementById("deleteButton");
const deleteId = document.getElementById("deleteId");
const diskDiv = document.getElementById("diskDiv");
const defragmentationButton = document.getElementById("defragmentationButton");
const counterFreeSpace = document.getElementById("counterFreeSpace");
const blockSize = 4;
const disk = [];
disk.length = 44;
disk.fill(0);
class Block {
    constructor(name, type, size) {
        this.name = name;
        this.type = type;
        this.size = size;
    }
    name;
    folder;
    address;
    type;
    size;
    nextAddress;
    position="";
}

addButton.addEventListener("click", () => addFile({fileName: fileNameInput.value, folderName: fileFolderInput.value}, fileSizeInput.value));
deleteButton.addEventListener("click", () => removeFile(deleteId.value));

const getName = ({fileName, folderName }) => {
    if (folderName) {
        return `${folderName}/${fileName}`
    }
    return fileName
}

let hashTable = new Map();

function addFile(fileMetaData, size) {
    let previousAddress;
    const fileName = getName(fileMetaData);
    for(let i = 0; i<size; i+=blockSize) {
        const block = new Block(fileName, "data",size-i>blockSize ? blockSize : size-i);
        const address = findAddress();
        if (address === -1) {
            console.error('Disk has no space to record this file');
            return;
        }
        disk[address]=block;
        block.address = address;
        if(typeof (previousAddress) === "number")
            disk[previousAddress].nextAddress=address;
        if (i+1===size) {
            block.position = "EOF";
        }
        if(i===0) {
            block.position = 0;
            block.folder = fileMetaData.folderName;
            hashTable.set(fileName, address);
        } else {
            block.position = i;
        }
        
        previousAddress=address;
    }
    draw();
}

function findAddress() {
    let i=0;
    while (i<disk.length) {
        if(disk[i] === 0) {
        return i;
        }
        i++;
    }
    return -1;
}

function removeFile(fileName) {
    let deleteAddress = hashTable.get(fileName);
    if (deleteAddress === undefined) {
        console.error('Such file doesn\'t exist');
        draw();
        return
    }
    hashTable.delete(fileName);
    while (true) {
        const nextAddress = disk[deleteAddress].nextAddress;
        disk[deleteAddress] = 0;
        deleteAddress = nextAddress;
        if (deleteAddress === undefined) {
            draw();
            return;
        }
    }
}
defragmentationButton.addEventListener("click", defragmentation)
function defragmentation() {
    const nextAddresses = {};
    
    let left = 0;
    let right = 1;

    while (right < disk.length) {
        if (right == left) {
            right++;
        }
        if (disk[left] != 0) {
            left++;
            continue;
        }

        if (disk[right] == 0) {
            right++;
            continue;
        }

        const curr = disk[right];

        if (disk[right]) {
            nextAddresses[curr.nextAddress] = curr;
            disk[left] = curr;
            disk[right] = 0;
            if (nextAddresses[right]) {
                nextAddresses[right].nextAddress = left;
            }
            if (curr.position === 0) {
                hashTable.set(curr.name, left);
            }
        }
    }
    draw();
}

function getDestructionName(i) {
    if(disk[i].name.includes("/")) {
        const [folderName, fileName] = disk[i].name.split('/');
        return {folderName: folderName, fileName: fileName};
    }
    else return {fileName: disk[i].name} 
}


function freeSpace( ) {
    let freeSpace=disk.length*4;
    for(let i = 0; i<disk.length; i++) {
        if(disk[i]!==0) {
            freeSpace-=disk[i].size;
        }
    }
    counterFreeSpace.innerText =  `Свободно ${freeSpace} Кб`;
}
freeSpace()
//Отрисовка интерфейса

const getFiles = () => {
    const files = [];

    [...hashTable.keys()].forEach(fullPath => {
        if (fullPath.indexOf('/') > -1) {
            const [folderName, fileName] = fullPath.split('/')
            files.push({ fileName, folderName })
        } else {
            files.push({ fileName: fullPath, folderName: null })
        }
    })

    return files
}

const draw = () => {
    const files = getFiles();
    const folders = {};

    root.innerHTML = '';
    const list = document.createElement('ul');
    list.id = "list";
    root.appendChild(list);
    files.forEach(({ fileName, folderName }) => {
        const file = document.createElement('li');
        file.innerText = fileName
        if (folderName) {
            if (!folders[folderName]) {
                const folderWrapper = document.createElement('li');
                folderWrapper.className = "folderLi"
                const folderElement = document.createElement('ul');
                folderWrapper.innerText = folderName;
                folderWrapper.appendChild(folderElement);
                list.appendChild(folderWrapper);
                folders[folderName] = folderElement;
            }
            folders[folderName].appendChild(file)
        } else {
            list.appendChild(file)
        }
    })
    drawDisk();
    freeSpace();
}


function drawDisk() {
diskDiv.innerHTML = '';
for(let i = 0; i<disk.length; i++) {
    const div = document.createElement("div");
    div.className = "disk";
    if(disk[i]) {
        div.style.backgroundColor = "yellow";
        div.textContent = disk[i].name;
    }
    diskDiv.appendChild(div);
}    
}
