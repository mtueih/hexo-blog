const fs = require('fs');
const path = require('path');

function mergeFolder(sourceDir, targetDir) {
    const files = fs.readdirSync(sourceDir, { withFileTypes: true });

    files.forEach(file => {
        const sourcePath = path.join(sourceDir, file.name);
        const targetPath = path.join(targetDir, file.name);

        if (file.isDirectory()) {
            if (!fs.existsSync(targetPath)) {
                fs.mkdirSync(targetPath);
            }
            mergeFolder(sourcePath, targetPath);
        } else {
            if (!fs.existsSync(targetPath)) {
                fs.copyFileSync(sourcePath, targetPath);
            } else {
                console.warn(`File ${targetPath} already exists. Skipping ${sourcePath}.`);
            }
        }
    });
}

const publicDir = path.join(__dirname, 'public');
const imgDir = path.join(publicDir, 'img');
const unusedDir = path.join(publicDir, 'images', 'unused');
const cssDir = path.join(publicDir, 'css');
const jsDir = path.join(publicDir, 'js');
const stylesDir = path.join(publicDir, 'styles');
const scriptsDir = path.join(publicDir, 'scripts');

// 判断 public 文件夹存在且不为空
if (fs.existsSync(publicDir) && fs.readdirSync(publicDir).length > 0) {
    console.log(`Folder「${publicDir}」exists and is not empty.`);
} else {
    console.error(`Folder「${publicDir}」does not exist or is empty, Exit.`);
    process.exit(1);
}

// 删除 public/img 和 public/images/unused 文件夹
if (fs.existsSync(imgDir)) {
    fs.rmSync(imgDir, { recursive: true, force: true });
    console.log(`Folder「${imgDir}」removed.`);
}

if (fs.existsSync(unusedDir)) {
    fs.rmSync(unusedDir, { recursive: true, force: true });
    console.log(`Folder「${unusedDir}」removed.`);
}

// 重命名 public/css 和 public/js 文件夹
if (fs.existsSync(cssDir)) {
    if (!fs.existsSync(stylesDir)) {
        fs.renameSync(cssDir, stylesDir);
        console.log(`Folder「${cssDir}」renamed to「${stylesDir}」.`);
    } else {
        mergeFolder(cssDir, stylesDir);
        fs.rmSync(cssDir, { recursive: true, force: true });
        console.log(`Folder「${cssDir}」merged into「${stylesDir}」 and removed.`);
    }
}

if (fs.existsSync(jsDir)) {
    if (!fs.existsSync(scriptsDir)) {
        fs.renameSync(jsDir, scriptsDir);
        console.log(`Folder「${jsDir}」renamed to「${scriptsDir}」.`);
    } else {
        mergeFolder(jsDir, scriptsDir);
        fs.rmSync(jsDir, { recursive: true, force: true });
        console.log(`Folder「${jsDir}」merged into「${scriptsDir}」 and removed.`);
    }
}