import { execSync, execFileSync } from "node:child_process";
import fs from "node:fs";
import { existsSync } from "node:fs";

const ng = "./node_modules/.bin/ng";

if (!existsSync(ng)) {
  throw new Error("Angular CLI not found. Run `npm install` first.");
}

const libraries = [
  "formly-field-validator",
  "formly-converters",
  "ngx-formly-ui-base",
  "ngx-formly-ui-editor",
  "ngx-formly-ui-material",
  "ngx-formly-ui-prime-ng",
  "ngx-formly-importers",
  "ngx-formly-form-loaders",
  "ngx-formly-editor",
  "ngx-formly-designer",
];

execFileSync(
  "npm",
  ["--prefix", "projects/formly-field-validator", "run", "build"],
  {
    stdio: "inherit",
  },
);
execFileSync(
  "npm",
  ["--prefix", "projects/formly-converters", "run", "build"],
  {
    stdio: "inherit",
  },
);
for (const library of libraries) {
  if (library === "formly-field-validator" || library === "formly-converters") {
    continue;
  }
  execFileSync(ng, ["build", library], {
    stdio: "inherit",
  });
  execFileSync("cp", ["LICENSE", `dist/${library}`], {
    stdio: "inherit",
  });
}

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
