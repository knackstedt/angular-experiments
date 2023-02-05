// TODO: Replace with a schematic
// All template files:
// Template => Component Class name
// filetemplate => Component File name

const fs = require('fs');

const templateFiles = [
    'template.component.html',
    'template.component.scss',
    'template.component.ts'
]

const templateDir = "template";

const appRouter = 'src/app/component.registry.ts';

if (process.argv) {
    const target = process.argv[2];

    let targetPath = target.match(/(^.+)\/[^\/]+$/)[1]

    let outClassName = target.match(/\/([^\/]+)$/)[1];
    let outFileName = outClassName.replace(/(?=[^\/])[A-Z]/g, match => '-' + match.toLowerCase());

    // If the first letter is lowercase, force it to upper case.
    outClassName = /^[a-z]/.test(outClassName) ? outClassName.substr(0, 1).toUpperCase() + outClassName.substr(1) : outClassName;

    if (outFileName.startsWith('-')) outFileName = outFileName.substr(1);

    console.log({
        ComponentName: outClassName,
        FileName: outFileName
    });

    const outDir = __dirname + '/src/app/' + targetPath + '/';

    try {
        fs.mkdirSync(outDir + outFileName + '/');
    } catch (ex) { }

    for (let i = 0; i < templateFiles.length; i++) {
        let filePath = __dirname + '/' + templateDir + '/' + templateFiles[i];
        let fileString = fs.readFileSync(filePath, { encoding: 'utf8' });

        // strip the ts-ignore comment at the top.
        fileString = fileString.replace(/^[^\n]+\n/, '');
        // Replace the Template classname with the computed classname
        fileString = fileString.replace(/Template/g, outClassName);
        // Replace the template filename with the computed file name
        fileString = fileString.replace(/filetemplate/g, outFileName);

        // Output folder should exist
        if (!fs.existsSync(outDir)) fs.mkdirSync(outDir);

        // Target new folder should exist
        if (!fs.existsSync(outDir+ outFileName + '/')) fs.mkdirSync(outDir+ outFileName + '/');

        // Write the templated file
        fs.writeFileSync(outDir + outFileName + '/' + outFileName + templateFiles[i].match(/\..+$/), fileString, { encoding: 'utf8' });
    }

    try {
        let appRouterText = fs.readFileSync(appRouter, { encoding: 'utf8' });
        let lines = appRouterText.split('\n');


        let newRoute = `    { id: '${outClassName}', load: () => import('./${targetPath}/${outFileName}/${outFileName}.component') },`
        let injected = false;
        for (let i = 0; i < lines.length; i++) {
            let line = lines[i];
            if (/export const RegisteredComponents = \[/.test(line)) {
                lines.splice(i + 1, 0, newRoute);
                injected = true;
                break;
            }
        }
        if (injected) {
            fs.writeFileSync(appRouter, lines.join('\n'), { encoding: 'utf8' });
        }
    }
    catch (ex) {
        throw ex;
    }

    console.log("Successfully generated component template.");
}
