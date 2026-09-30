import { execSync, execFileSync } from "node:child_process";
import fs from "node:fs";
import { existsSync } from "node:fs";

const ng = "./node_modules/.bin/ng";

if (!existsSync(ng)) {
  throw new Error("Angular CLI not found. Run `npm install` first.");
}

const libraries = [
  "ngx-formly-ui-base",
  "ngx-formly-ui-material",
  "ngx-formly-ui-prime-ng",
  "ngx-formly-designer",
];

if (shouldBuild("formly-field-validator")) {
  execFileSync(
    "npm",
    ["--prefix", "projects/formly-field-validator", "run", "build"],
    {
      stdio: "inherit",
    },
  );
}
if (shouldBuild("formly-converters")) {
  execFileSync(
    "npm",
    ["--prefix", "projects/formly-converters", "run", "build"],
    {
      stdio: "inherit",
    },
  );
}

for (const library of libraries) {
  if (shouldBuild(library)) {
    execFileSync(ng, ["build", library, "-c", "production"], {
      stdio: "inherit",
    });
    execFileSync("cp", ["LICENSE", `dist/${library}`], {
      stdio: "inherit",
    });
  }
}

function shouldBuild(library) {
  const packageFile = `./projects/${library}/package.json`;
  const { version } = JSON.parse(fs.readFileSync(packageFile, "utf8"));

  const publishedVersion = execSync(`npm view @grumptech/${library} version`, {
    encoding: "utf8",
  }).trim();
  if (version === publishedVersion) {
    console.log(`Version ${version} is already published for ${library}`);
    return false;
  }
  return true;
}
