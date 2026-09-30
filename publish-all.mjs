import { execSync, execFileSync } from "node:child_process";
import fs from "node:fs";

const libraries = [
  "formly-field-validator",
  "formly-converters",
  "ngx-formly-ui-base",
  "ngx-formly-ui-material",
  "ngx-formly-ui-prime-ng",
  "ngx-formly-designer",
];

for (const library of libraries) {
  const packageFile = `./dist/${library}/package.json`;
  const { version } = JSON.parse(fs.readFileSync(packageFile, "utf8"));

  const publishedVersion = execSync(`npm view @grumptech/${library} version`, {
    encoding: "utf8",
  }).trim();

  if (version === publishedVersion) {
    console.log(`Version ${version} is already published for ${library}`);
  } else {
    execFileSync(
      "npm",
      ["publish", `./dist/${library}`, "--access", "public"],
      {
        stdio: "inherit",
      },
    );
  }
}
