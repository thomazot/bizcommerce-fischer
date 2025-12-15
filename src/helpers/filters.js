import fs from 'node:fs';

export default function filters (env) {
  env.addFilter("magento", function (str) {
    // Nunjucks deve gerar literalmente {{ ... }}
    return `{{${str}}}`;
  });

  env.addFilter("parseJSON", function (filePath) {
    // Remove 'data/' se estiver no início do caminho
    const cleanPath = filePath.startsWith('data/') ? filePath.substring(5) : filePath;
    const fullPath = `./src/data/${cleanPath}`;
    
    if (fs.existsSync(fullPath)) {
      return JSON.parse(fs.readFileSync(fullPath, 'utf8'));
    }
    return {};
  });
}