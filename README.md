# sheets-localizations-generator

A tool to generate localization files from Google Sheets. This project extracts localization strings from a given Google Sheet and outputs files ready for integration into your application.

## Installation

Ensure you have Bun installed. Then, install the project dependencies by running:

```bash
bun install
```

## Usage

This tool uses Commander.js for command-line argument parsing. To generate localizations, run the following command:

```bash
bun index.ts generate-localizations <sheet-id> <sheet-name> [--output-path <path>]
```

Replace `<sheet-id>` with the actual ID of your Google Sheet and `<sheet-name>` with the name of the sheet that contains localization strings. Optionally, use `--output-path` to specify a custom output directory (default is `./locales`).

Example:
```bash
bun index.ts generate-localizations 1A2B3C4D5E MySheet -o ./output
```

On successful execution, you will see: "Localizations generated successfully".

## Запуск из релиза

В релизе доступна предварительно собранная версия localizator.js, предназначенная для запуска с помощью Node.js. Вы можете скачать её на странице релизов этого репозитория. Для использования скачанного файла выполните:

```bash
node localizator.js generate-localizations <sheet-id> <sheet-name> [--output-path <path>]
```

Это позволяет запускать инструмент без необходимости предварительной сборки через Bun.

## Google Cloud Service Account Setup

This project requires a Google Cloud service account to access the Google Sheet. Follow these steps to generate and configure the required key file:

1. **Access Google Cloud Console:**
   Visit: [Google Cloud Console](https://console.cloud.google.com/)

2. **Create or Select a Project:**
   Create a new project or select an existing one.

3. **Navigate to Credentials:**
   In the left sidebar, go to `APIs & Services` → `Credentials`.

4. **Create a Service Account:**
   Click `Create credentials` → `Service account`, then fill in the service account details and click `Create`.

5. **Assign Permissions:**
   During the process, assign the `Viewer` role to the service account.

6. **Generate the Key File:**
   - After the service account is created, navigate to the `Keys` tab.
   - Click `Add Key` → `Create new key`.
   - Select `JSON` as the key type and click `Create`.

7. **Save the Key File:**
   The key file will be downloaded automatically. Save it in your project root as `service-account.key.json` and ensure you add it to your `.gitignore` to prevent accidental exposure.

## Additional Notes

- This project is built using Bun. Ensure that Bun is properly configured on your system.
- For issues related to Google Cloud APIs or Google Sheets, consult the official documentation.

## Contributing

Contributions are welcome! Please submit pull requests or open issues on GitHub to help improve the project.

## License

(Add license information here, if applicable)
