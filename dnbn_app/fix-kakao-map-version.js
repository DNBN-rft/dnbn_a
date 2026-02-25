/**
 * Postinstall script to fix missing 'map' SDK version in @react-native-kakao/core.
 *
 * Problem: @react-native-kakao/map@2.2.7 reads the Kakao Maps Open SDK version
 * from @react-native-kakao/core's package.json (sdkVersions.android.map),
 * but @react-native-kakao/core@2.4.4 does not define this field.
 * This causes `com.kakao.maps.open:android:null` in Gradle, breaking Android builds.
 *
 * Fix: Add "map": "2.13.0" to sdkVersions.android in @react-native-kakao/core/package.json.
 */

const fs = require("fs");
const pkgPath = require.resolve("@react-native-kakao/core/package.json");

// Read file as buffer to handle potential UTF-8 BOM
let buf = fs.readFileSync(pkgPath);
// Strip UTF-8 BOM if present (0xEF, 0xBB, 0xBF)
if (buf[0] === 0xef && buf[1] === 0xbb && buf[2] === 0xbf) {
  buf = buf.slice(3);
}

let pkg;
try {
  pkg = JSON.parse(buf.toString("utf8"));
} catch (e) {
  console.error(
    "[fix-kakao-map-version] Failed to parse @react-native-kakao/core/package.json:",
    e.message,
  );
  process.exit(1);
}

if (!pkg.sdkVersions || !pkg.sdkVersions.android) {
  console.error(
    "[fix-kakao-map-version] Unexpected package.json structure - sdkVersions.android not found",
  );
  process.exit(1);
}

if (pkg.sdkVersions.android.map) {
  console.log(
    "[fix-kakao-map-version] Already has map version:",
    pkg.sdkVersions.android.map,
  );
} else {
  pkg.sdkVersions.android.map = "2.13.0";
  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2), "utf8");
  console.log(
    "[fix-kakao-map-version] SUCCESS: Added Kakao Maps Open SDK version 2.13.0",
  );
}
