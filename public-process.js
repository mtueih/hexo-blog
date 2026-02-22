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

function getHtmlFiles(dir) {
    let htmlFiles = [];
    const files = fs.readdirSync(dir, { withFileTypes: true });
    files.forEach(file => {
        const filePath = path.join(dir, file.name);
        if (file.isDirectory()) {
            htmlFiles = htmlFiles.concat(getHtmlFiles(filePath));
        } else if (file.name.endsWith('.html')) {
            htmlFiles.push(filePath);
        }
    });
    return htmlFiles;
}

// 判断 public 文件夹存在且不为空
const publicDir = path.join(__dirname, 'public');

if (fs.existsSync(publicDir) && fs.readdirSync(publicDir).length > 0) {
    console.log(`Folder「${publicDir}」exists and is not empty.`);
} else {
    console.error(`Folder「${publicDir}」does not exist or is empty, Exit.`);
    process.exit(1);
}

// 删除 public/img 和 public/images/unused 文件夹
const imgDir = path.join(publicDir, 'img');
const unusedDir = path.join(publicDir, 'images', 'unused');

if (fs.existsSync(imgDir)) {
    fs.rmSync(imgDir, { recursive: true, force: true });
    console.log(`Folder「${imgDir}」removed.`);
}

if (fs.existsSync(unusedDir)) {
    fs.rmSync(unusedDir, { recursive: true, force: true });
    console.log(`Folder「${unusedDir}」removed.`);
}

// 重命名 public/css 和 public/js 文件夹
const cssDir = path.join(publicDir, 'css');
const stylesDir = path.join(publicDir, 'styles');

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

const jsDir = path.join(publicDir, 'js');
const scriptsDir = path.join(publicDir, 'scripts');

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

const htmlFiles = getHtmlFiles(publicDir);

htmlFiles.forEach(file => {
    let content = fs.readFileSync(file, 'utf-8');
    content = content.replace(/href="\/css\//g, 'href="/styles/');
    content = content.replace(/src="\/js\//g, 'src="/scripts/');
    fs.writeFileSync(file, content, 'utf-8');
    console.log(`Updated paths in「${file}」.`);
});