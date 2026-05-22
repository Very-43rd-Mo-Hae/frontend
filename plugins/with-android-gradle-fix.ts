import { ConfigPlugin, withDangerousMod } from "expo/config-plugins";
import fs from "fs";
import path from "path";

const FOOJAY_PLUGIN_PATTERN =
  /id\(["']org\.gradle\.toolchains\.foojay-resolver-convention["']\)\.version\(["'][^"']+["']\)/g;

const FOOJAY_PLUGIN_REPLACEMENT =
  'id("org.gradle.toolchains.foojay-resolver-convention").version("1.0.0")';

function patchFoojayResolverVersion(filePath: string) {
  if (!fs.existsSync(filePath)) {
    return false;
  }

  const contents = fs.readFileSync(filePath, "utf8");
  const nextContents = contents.replace(
    FOOJAY_PLUGIN_PATTERN,
    FOOJAY_PLUGIN_REPLACEMENT
  );

  if (nextContents === contents) {
    return false;
  }

  fs.writeFileSync(filePath, nextContents);
  return true;
}

const withAndroidGradleFix: ConfigPlugin = (config) => {
  return withDangerousMod(config, [
    "android",
    async (config) => {
      const projectRoot = config.modRequest.projectRoot;

      const settingsGradlePath = path.join(
        projectRoot,
        "android",
        "settings.gradle"
      );

      const reactNativeGradlePluginSettingsPath = path.join(
        path.dirname(
          require.resolve("@react-native/gradle-plugin/package.json", {
            paths: [projectRoot],
          })
        ),
        "settings.gradle.kts"
      );

      patchFoojayResolverVersion(settingsGradlePath);
      patchFoojayResolverVersion(reactNativeGradlePluginSettingsPath);

      return config;
    },
  ]);
};

module.exports = withAndroidGradleFix;
