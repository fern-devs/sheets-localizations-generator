import { program } from 'commander';
import { generateLocalizations } from "./src/commands/generate-localizations";

program.version('1.0.0');
program.description('Localization generator for Google Sheets');

program
    .command("generate-localizations")
    .description("Generate localizations for a given sheet")
    .argument("<sheet-id>", "The ID of the sheet to generate localizations for")
    .argument("<sheet-name>", "The name of the sheet to generate localizations for")
    .option("-o, --output-path <path>", "The path to save the localizations", "./locales")
    .action(async (sheetId, sheetName, options) => {
        await generateLocalizations(sheetId, sheetName, options.outputPath);
        console.log('Localizations generated successfully');
    })

program.parse(process.argv);
