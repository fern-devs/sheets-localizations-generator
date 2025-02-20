# sheets-localizations-generator

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run index.ts <SHEET_ID>
```

### Obtaining the Key File

To generate and configure the required service account key file, follow these steps:

1. **Access Google Cloud Console**  
   Visit: [https://console.cloud.google.com/](https://console.cloud.google.com/)

2. **Create/Select Project**  
   - Create a new project or select an existing one

3. **Navigate to Credentials**  
   - In the left menu: `APIs & Services` → `Credentials`

4. **Create Service Account**  
   - Click `Create credentials` → `Service account`
   - Fill in service account details
   - Click `Create`

5. **Assign Permissions**  
   - On the "Grant this service account access to project" step:
   - Select the `Viewer` role
   - Click `Done`

6. **Generate Key File**  
   - Locate the created service account in the list
   - Click on it to access details
   - Go to the `Keys` tab
   - Click `Add Key` → `Create new key`
   - Select `JSON` format
   - Click `Create`

7. **Save and Secure Key**  
   - The key file will automatically download
   - Save it in your project folder as `service-account.key.json`
   - Add `service-account.key.json` to `.gitignore` to prevent accidental exposure
