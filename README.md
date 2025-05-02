# figma-button-3

## Setup Instructions

Follow these steps to set up and deploy the project:

### Repository and Test Figma File

- **GitHub Repository**: [figma-button-3](https://github.com/csfulk/figma-button-3)
- **Test Figma File**: [Fetch Figma Data Demo](https://www.figma.com/design/dA2fU9PrVsU1CMyc79d6hG/Fetch-Figma-Data-Demo?node-id=705-340&p=f&t=1jz1nG34op61pmgb-0)

### Environment Variable Configuration

- The `FIGMA_ACCESS_TOKEN` is stored as an environment variable on Netlify. This is required for the project to work officially and securely access the Figma API.
- To set this up:
  1. Go to the Netlify dashboard for your site.
  2. Navigate to "Site Settings" > "Environment Variables."
  3. Add the `FIGMA_ACCESS_TOKEN` and `FIGMA_FILE_ID` variables with their respective values.
  4. Redeploy the site to apply the changes.

### Steps

1. **Clone the Repository**:
   ```bash
   git clone <repository-url>
   cd figma-button-3
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Set Environment Variables**:
   - Create a `.env` file in the root directory.
   - Add the following variables:
     ```env
     FIGMA_ACCESS_TOKEN=your_figma_access_token
     FIGMA_FILE_ID=your_figma_file_id
     ```
   - Replace `your_figma_access_token` and `your_figma_file_id` with actual values.

4. **Deploy to Netlify**:
   - Log in to Netlify:
     ```bash
     netlify login
     ```
   - Deploy the site:
     ```bash
     netlify deploy
     ```
   - Follow the prompts to deploy the site.

5. **Verify Deployment**:
   - Ensure the environment variables are set in the Netlify dashboard under "Site Settings" > "Environment Variables."
   - Redeploy the site if you make changes to the environment variables.

### Debugging
- Check the Netlify function logs for errors in the Netlify dashboard under "Functions."
- Use `console.log` statements in the code to debug locally.
