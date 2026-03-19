"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "app/api/upload/route";
exports.ids = ["app/api/upload/route"];
exports.modules = {

/***/ "@prisma/client":
/*!*********************************!*\
  !*** external "@prisma/client" ***!
  \*********************************/
/***/ ((module) => {

module.exports = require("@prisma/client");

/***/ }),

/***/ "bcrypt":
/*!*************************!*\
  !*** external "bcrypt" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("bcrypt");

/***/ }),

/***/ "next/dist/compiled/next-server/app-page.runtime.dev.js":
/*!*************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-page.runtime.dev.js" ***!
  \*************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/compiled/next-server/app-page.runtime.dev.js");

/***/ }),

/***/ "next/dist/compiled/next-server/app-route.runtime.dev.js":
/*!**************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-route.runtime.dev.js" ***!
  \**************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/compiled/next-server/app-route.runtime.dev.js");

/***/ }),

/***/ "assert":
/*!*************************!*\
  !*** external "assert" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("assert");

/***/ }),

/***/ "async_hooks":
/*!******************************!*\
  !*** external "async_hooks" ***!
  \******************************/
/***/ ((module) => {

module.exports = require("async_hooks");

/***/ }),

/***/ "buffer":
/*!*************************!*\
  !*** external "buffer" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("buffer");

/***/ }),

/***/ "console":
/*!**************************!*\
  !*** external "console" ***!
  \**************************/
/***/ ((module) => {

module.exports = require("console");

/***/ }),

/***/ "crypto":
/*!*************************!*\
  !*** external "crypto" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("crypto");

/***/ }),

/***/ "diagnostics_channel":
/*!**************************************!*\
  !*** external "diagnostics_channel" ***!
  \**************************************/
/***/ ((module) => {

module.exports = require("diagnostics_channel");

/***/ }),

/***/ "events":
/*!*************************!*\
  !*** external "events" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("events");

/***/ }),

/***/ "http":
/*!***********************!*\
  !*** external "http" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("http");

/***/ }),

/***/ "http2":
/*!************************!*\
  !*** external "http2" ***!
  \************************/
/***/ ((module) => {

module.exports = require("http2");

/***/ }),

/***/ "net":
/*!**********************!*\
  !*** external "net" ***!
  \**********************/
/***/ ((module) => {

module.exports = require("net");

/***/ }),

/***/ "perf_hooks":
/*!*****************************!*\
  !*** external "perf_hooks" ***!
  \*****************************/
/***/ ((module) => {

module.exports = require("perf_hooks");

/***/ }),

/***/ "querystring":
/*!******************************!*\
  !*** external "querystring" ***!
  \******************************/
/***/ ((module) => {

module.exports = require("querystring");

/***/ }),

/***/ "stream":
/*!*************************!*\
  !*** external "stream" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("stream");

/***/ }),

/***/ "stream/web":
/*!*****************************!*\
  !*** external "stream/web" ***!
  \*****************************/
/***/ ((module) => {

module.exports = require("stream/web");

/***/ }),

/***/ "string_decoder":
/*!*********************************!*\
  !*** external "string_decoder" ***!
  \*********************************/
/***/ ((module) => {

module.exports = require("string_decoder");

/***/ }),

/***/ "tls":
/*!**********************!*\
  !*** external "tls" ***!
  \**********************/
/***/ ((module) => {

module.exports = require("tls");

/***/ }),

/***/ "url":
/*!**********************!*\
  !*** external "url" ***!
  \**********************/
/***/ ((module) => {

module.exports = require("url");

/***/ }),

/***/ "util":
/*!***********************!*\
  !*** external "util" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("util");

/***/ }),

/***/ "util/types":
/*!*****************************!*\
  !*** external "util/types" ***!
  \*****************************/
/***/ ((module) => {

module.exports = require("util/types");

/***/ }),

/***/ "worker_threads":
/*!*********************************!*\
  !*** external "worker_threads" ***!
  \*********************************/
/***/ ((module) => {

module.exports = require("worker_threads");

/***/ }),

/***/ "zlib":
/*!***********************!*\
  !*** external "zlib" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("zlib");

/***/ }),

/***/ "node:crypto":
/*!******************************!*\
  !*** external "node:crypto" ***!
  \******************************/
/***/ ((module) => {

module.exports = require("node:crypto");

/***/ }),

/***/ "node:events":
/*!******************************!*\
  !*** external "node:events" ***!
  \******************************/
/***/ ((module) => {

module.exports = require("node:events");

/***/ }),

/***/ "node:stream":
/*!******************************!*\
  !*** external "node:stream" ***!
  \******************************/
/***/ ((module) => {

module.exports = require("node:stream");

/***/ }),

/***/ "node:util":
/*!****************************!*\
  !*** external "node:util" ***!
  \****************************/
/***/ ((module) => {

module.exports = require("node:util");

/***/ }),

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fupload%2Froute&page=%2Fapi%2Fupload%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fupload%2Froute.ts&appDir=C%3A%5CUsers%5Cadity%5CDownloads%5Checupps%5CHEcUPPS-main%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5Cadity%5CDownloads%5Checupps%5CHEcUPPS-main&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!":
/*!****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fupload%2Froute&page=%2Fapi%2Fupload%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fupload%2Froute.ts&appDir=C%3A%5CUsers%5Cadity%5CDownloads%5Checupps%5CHEcUPPS-main%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5Cadity%5CDownloads%5Checupps%5CHEcUPPS-main&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D! ***!
  \****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   originalPathname: () => (/* binding */ originalPathname),\n/* harmony export */   patchFetch: () => (/* binding */ patchFetch),\n/* harmony export */   requestAsyncStorage: () => (/* binding */ requestAsyncStorage),\n/* harmony export */   routeModule: () => (/* binding */ routeModule),\n/* harmony export */   serverHooks: () => (/* binding */ serverHooks),\n/* harmony export */   staticGenerationAsyncStorage: () => (/* binding */ staticGenerationAsyncStorage)\n/* harmony export */ });\n/* harmony import */ var next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/future/route-modules/app-route/module.compiled */ \"(rsc)/./node_modules/next/dist/server/future/route-modules/app-route/module.compiled.js\");\n/* harmony import */ var next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_dist_server_future_route_kind__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/dist/server/future/route-kind */ \"(rsc)/./node_modules/next/dist/server/future/route-kind.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/dist/server/lib/patch-fetch */ \"(rsc)/./node_modules/next/dist/server/lib/patch-fetch.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var C_Users_adity_Downloads_hecupps_HEcUPPS_main_app_api_upload_route_ts__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./app/api/upload/route.ts */ \"(rsc)/./app/api/upload/route.ts\");\n\n\n\n\n// We inject the nextConfigOutput here so that we can use them in the route\n// module.\nconst nextConfigOutput = \"\"\nconst routeModule = new next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__.AppRouteRouteModule({\n    definition: {\n        kind: next_dist_server_future_route_kind__WEBPACK_IMPORTED_MODULE_1__.RouteKind.APP_ROUTE,\n        page: \"/api/upload/route\",\n        pathname: \"/api/upload\",\n        filename: \"route\",\n        bundlePath: \"app/api/upload/route\"\n    },\n    resolvedPagePath: \"C:\\\\Users\\\\adity\\\\Downloads\\\\hecupps\\\\HEcUPPS-main\\\\app\\\\api\\\\upload\\\\route.ts\",\n    nextConfigOutput,\n    userland: C_Users_adity_Downloads_hecupps_HEcUPPS_main_app_api_upload_route_ts__WEBPACK_IMPORTED_MODULE_3__\n});\n// Pull out the exports that we need to expose from the module. This should\n// be eliminated when we've moved the other routes to the new format. These\n// are used to hook into the route.\nconst { requestAsyncStorage, staticGenerationAsyncStorage, serverHooks } = routeModule;\nconst originalPathname = \"/api/upload/route\";\nfunction patchFetch() {\n    return (0,next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__.patchFetch)({\n        serverHooks,\n        staticGenerationAsyncStorage\n    });\n}\n\n\n//# sourceMappingURL=app-route.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L2J1aWxkL3dlYnBhY2svbG9hZGVycy9uZXh0LWFwcC1sb2FkZXIuanM/bmFtZT1hcHAlMkZhcGklMkZ1cGxvYWQlMkZyb3V0ZSZwYWdlPSUyRmFwaSUyRnVwbG9hZCUyRnJvdXRlJmFwcFBhdGhzPSZwYWdlUGF0aD1wcml2YXRlLW5leHQtYXBwLWRpciUyRmFwaSUyRnVwbG9hZCUyRnJvdXRlLnRzJmFwcERpcj1DJTNBJTVDVXNlcnMlNUNhZGl0eSU1Q0Rvd25sb2FkcyU1Q2hlY3VwcHMlNUNIRWNVUFBTLW1haW4lNUNhcHAmcGFnZUV4dGVuc2lvbnM9dHN4JnBhZ2VFeHRlbnNpb25zPXRzJnBhZ2VFeHRlbnNpb25zPWpzeCZwYWdlRXh0ZW5zaW9ucz1qcyZyb290RGlyPUMlM0ElNUNVc2VycyU1Q2FkaXR5JTVDRG93bmxvYWRzJTVDaGVjdXBwcyU1Q0hFY1VQUFMtbWFpbiZpc0Rldj10cnVlJnRzY29uZmlnUGF0aD10c2NvbmZpZy5qc29uJmJhc2VQYXRoPSZhc3NldFByZWZpeD0mbmV4dENvbmZpZ091dHB1dD0mcHJlZmVycmVkUmVnaW9uPSZtaWRkbGV3YXJlQ29uZmlnPWUzMCUzRCEiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7O0FBQXNHO0FBQ3ZDO0FBQ2M7QUFDOEI7QUFDM0c7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCLGdIQUFtQjtBQUMzQztBQUNBLGNBQWMseUVBQVM7QUFDdkI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLFlBQVk7QUFDWixDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0EsUUFBUSxpRUFBaUU7QUFDekU7QUFDQTtBQUNBLFdBQVcsNEVBQVc7QUFDdEI7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUN1SDs7QUFFdkgiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9oZWN1cHBzLWdpZnQtaGFtcGVyLz85YjkwIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFwcFJvdXRlUm91dGVNb2R1bGUgfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9mdXR1cmUvcm91dGUtbW9kdWxlcy9hcHAtcm91dGUvbW9kdWxlLmNvbXBpbGVkXCI7XG5pbXBvcnQgeyBSb3V0ZUtpbmQgfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9mdXR1cmUvcm91dGUta2luZFwiO1xuaW1wb3J0IHsgcGF0Y2hGZXRjaCBhcyBfcGF0Y2hGZXRjaCB9IGZyb20gXCJuZXh0L2Rpc3Qvc2VydmVyL2xpYi9wYXRjaC1mZXRjaFwiO1xuaW1wb3J0ICogYXMgdXNlcmxhbmQgZnJvbSBcIkM6XFxcXFVzZXJzXFxcXGFkaXR5XFxcXERvd25sb2Fkc1xcXFxoZWN1cHBzXFxcXEhFY1VQUFMtbWFpblxcXFxhcHBcXFxcYXBpXFxcXHVwbG9hZFxcXFxyb3V0ZS50c1wiO1xuLy8gV2UgaW5qZWN0IHRoZSBuZXh0Q29uZmlnT3V0cHV0IGhlcmUgc28gdGhhdCB3ZSBjYW4gdXNlIHRoZW0gaW4gdGhlIHJvdXRlXG4vLyBtb2R1bGUuXG5jb25zdCBuZXh0Q29uZmlnT3V0cHV0ID0gXCJcIlxuY29uc3Qgcm91dGVNb2R1bGUgPSBuZXcgQXBwUm91dGVSb3V0ZU1vZHVsZSh7XG4gICAgZGVmaW5pdGlvbjoge1xuICAgICAgICBraW5kOiBSb3V0ZUtpbmQuQVBQX1JPVVRFLFxuICAgICAgICBwYWdlOiBcIi9hcGkvdXBsb2FkL3JvdXRlXCIsXG4gICAgICAgIHBhdGhuYW1lOiBcIi9hcGkvdXBsb2FkXCIsXG4gICAgICAgIGZpbGVuYW1lOiBcInJvdXRlXCIsXG4gICAgICAgIGJ1bmRsZVBhdGg6IFwiYXBwL2FwaS91cGxvYWQvcm91dGVcIlxuICAgIH0sXG4gICAgcmVzb2x2ZWRQYWdlUGF0aDogXCJDOlxcXFxVc2Vyc1xcXFxhZGl0eVxcXFxEb3dubG9hZHNcXFxcaGVjdXBwc1xcXFxIRWNVUFBTLW1haW5cXFxcYXBwXFxcXGFwaVxcXFx1cGxvYWRcXFxccm91dGUudHNcIixcbiAgICBuZXh0Q29uZmlnT3V0cHV0LFxuICAgIHVzZXJsYW5kXG59KTtcbi8vIFB1bGwgb3V0IHRoZSBleHBvcnRzIHRoYXQgd2UgbmVlZCB0byBleHBvc2UgZnJvbSB0aGUgbW9kdWxlLiBUaGlzIHNob3VsZFxuLy8gYmUgZWxpbWluYXRlZCB3aGVuIHdlJ3ZlIG1vdmVkIHRoZSBvdGhlciByb3V0ZXMgdG8gdGhlIG5ldyBmb3JtYXQuIFRoZXNlXG4vLyBhcmUgdXNlZCB0byBob29rIGludG8gdGhlIHJvdXRlLlxuY29uc3QgeyByZXF1ZXN0QXN5bmNTdG9yYWdlLCBzdGF0aWNHZW5lcmF0aW9uQXN5bmNTdG9yYWdlLCBzZXJ2ZXJIb29rcyB9ID0gcm91dGVNb2R1bGU7XG5jb25zdCBvcmlnaW5hbFBhdGhuYW1lID0gXCIvYXBpL3VwbG9hZC9yb3V0ZVwiO1xuZnVuY3Rpb24gcGF0Y2hGZXRjaCgpIHtcbiAgICByZXR1cm4gX3BhdGNoRmV0Y2goe1xuICAgICAgICBzZXJ2ZXJIb29rcyxcbiAgICAgICAgc3RhdGljR2VuZXJhdGlvbkFzeW5jU3RvcmFnZVxuICAgIH0pO1xufVxuZXhwb3J0IHsgcm91dGVNb2R1bGUsIHJlcXVlc3RBc3luY1N0b3JhZ2UsIHN0YXRpY0dlbmVyYXRpb25Bc3luY1N0b3JhZ2UsIHNlcnZlckhvb2tzLCBvcmlnaW5hbFBhdGhuYW1lLCBwYXRjaEZldGNoLCAgfTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9YXBwLXJvdXRlLmpzLm1hcCJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fupload%2Froute&page=%2Fapi%2Fupload%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fupload%2Froute.ts&appDir=C%3A%5CUsers%5Cadity%5CDownloads%5Checupps%5CHEcUPPS-main%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5Cadity%5CDownloads%5Checupps%5CHEcUPPS-main&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!\n");

/***/ }),

/***/ "(rsc)/./app/api/upload/route.ts":
/*!*********************************!*\
  !*** ./app/api/upload/route.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   POST: () => (/* binding */ POST)\n/* harmony export */ });\n/* harmony import */ var _vercel_blob__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @vercel/blob */ \"(rsc)/./node_modules/@vercel/blob/dist/index.js\");\n/* harmony import */ var next_server__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/server */ \"(rsc)/./node_modules/next/dist/api/server.js\");\n/* harmony import */ var _lib_rbac__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/lib/rbac */ \"(rsc)/./lib/rbac.ts\");\n\n\n\n// File type configurations\nconst ALLOWED_FILE_TYPES = {\n    images: [\n        \"image/jpeg\",\n        \"image/jpg\",\n        \"image/png\",\n        \"image/gif\",\n        \"image/webp\",\n        \"image/svg+xml\"\n    ],\n    videos: [\n        \"video/mp4\",\n        \"video/webm\",\n        \"video/ogg\",\n        \"video/quicktime\"\n    ],\n    documents: [\n        \"application/pdf\",\n        \"application/zip\",\n        \"application/x-zip-compressed\"\n    ]\n};\n// Maximum file sizes (in bytes)\nconst MAX_FILE_SIZES = {\n    images: 10 * 1024 * 1024,\n    videos: 100 * 1024 * 1024,\n    documents: 50 * 1024 * 1024\n};\n// Folder structure for organized storage\nconst UPLOAD_FOLDERS = {\n    images: \"products/images\",\n    videos: \"products/videos\",\n    documents: \"products/digital\",\n    other: \"uploads\"\n};\nfunction validateFileType(file, folder) {\n    const fileType = file.type;\n    // Determine category based on folder or file type\n    let category = \"other\";\n    if (folder?.includes(\"image\")) {\n        category = \"images\";\n    } else if (folder?.includes(\"video\")) {\n        category = \"videos\";\n    } else if (folder?.includes(\"digital\") || folder?.includes(\"document\")) {\n        category = \"documents\";\n    } else {\n        // Auto-detect from MIME type\n        if (ALLOWED_FILE_TYPES.images.includes(fileType)) category = \"images\";\n        else if (ALLOWED_FILE_TYPES.videos.includes(fileType)) category = \"videos\";\n        else if (ALLOWED_FILE_TYPES.documents.includes(fileType)) category = \"documents\";\n    }\n    if (category !== \"other\") {\n        const allowedTypes = ALLOWED_FILE_TYPES[category];\n        if (!allowedTypes.includes(fileType)) {\n            return {\n                valid: false,\n                error: `Invalid file type for ${category}. Allowed types: ${allowedTypes.join(\", \")}`\n            };\n        }\n    }\n    return {\n        valid: true,\n        category\n    };\n}\nfunction validateFileSize(file, category) {\n    const maxSize = MAX_FILE_SIZES[category] || MAX_FILE_SIZES.documents;\n    if (file.size > maxSize) {\n        const maxSizeMB = (maxSize / (1024 * 1024)).toFixed(1);\n        return {\n            valid: false,\n            error: `File size exceeds maximum allowed size of ${maxSizeMB}MB for ${category}`\n        };\n    }\n    return {\n        valid: true\n    };\n}\nfunction generateFileName(originalName, folder) {\n    const timestamp = Date.now();\n    const randomString = Math.random().toString(36).substring(2, 8);\n    const sanitizedName = originalName.replace(/[^a-zA-Z0-9.-]/g, \"_\");\n    return `${folder}/${timestamp}-${randomString}-${sanitizedName}`;\n}\nconst handleUpload = async (request)=>{\n    try {\n        const formData = await request.formData();\n        const file = formData.get(\"file\");\n        const folderParam = formData.get(\"folder\");\n        if (!file) {\n            return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n                message: \"No file found in the request\",\n                error: \"FILE_MISSING\"\n            }, {\n                status: 400\n            });\n        }\n        // Validate file type\n        const typeValidation = validateFileType(file, folderParam || undefined);\n        if (!typeValidation.valid) {\n            return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n                message: typeValidation.error || \"Invalid file type\",\n                error: \"INVALID_FILE_TYPE\"\n            }, {\n                status: 400\n            });\n        }\n        const category = typeValidation.category || \"other\";\n        // Validate file size\n        const sizeValidation = validateFileSize(file, category);\n        if (!sizeValidation.valid) {\n            return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n                message: sizeValidation.error || \"File size too large\",\n                error: \"FILE_TOO_LARGE\"\n            }, {\n                status: 400\n            });\n        }\n        // Determine upload folder\n        const uploadFolder = folderParam || UPLOAD_FOLDERS[category] || UPLOAD_FOLDERS.other;\n        const fileName = generateFileName(file.name, uploadFolder);\n        // Upload to Vercel Blob\n        const blob = await (0,_vercel_blob__WEBPACK_IMPORTED_MODULE_2__.put)(fileName, file, {\n            access: \"public\",\n            token: process.env.BLOB_READ_WRITE_TOKEN\n        });\n        console.log(`✅ File uploaded successfully: ${blob.url}`);\n        // Return the URL and metadata\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            url: blob.url,\n            fileName: file.name,\n            size: file.size,\n            type: file.type,\n            category: category,\n            uploadedAt: new Date().toISOString()\n        });\n    } catch (error) {\n        const errorMessage = error instanceof Error ? error.message : \"An unknown error occurred\";\n        console.error(\"❌ Upload failed:\", errorMessage);\n        // Check for specific Vercel Blob errors\n        if (errorMessage.includes(\"token\")) {\n            return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n                message: \"Storage configuration error. Please check BLOB_READ_WRITE_TOKEN.\",\n                error: \"STORAGE_CONFIG_ERROR\"\n            }, {\n                status: 500\n            });\n        }\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            message: \"File upload failed\",\n            error: errorMessage\n        }, {\n            status: 500\n        });\n    }\n};\nconst POST = (0,_lib_rbac__WEBPACK_IMPORTED_MODULE_1__.withAdminAuth)([\n    \"SUPER_ADMIN\",\n    \"PRODUCT_MANAGER\"\n], handleUpload);\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUFJLENBQUM7WUFDckJpQixLQUFLUixLQUFLUSxHQUFHO1lBQ2JWLFVBQVV2QyxLQUFLd0MsSUFBSTtZQUNuQjVCLE1BQU1aLEtBQUtZLElBQUk7WUFDZlQsTUFBTUgsS0FBS0csSUFBSTtZQUNmQyxVQUFVQTtZQUNWOEMsWUFBWSxJQUFJaEMsT0FBT2lDLFdBQVc7UUFDdEM7SUFDSixFQUFFLE9BQU8zQyxPQUFnQjtRQUNyQixNQUFNNEMsZUFBZTVDLGlCQUFpQjZDLFFBQVE3QyxNQUFNeUIsT0FBTyxHQUFHO1FBQzlEYyxRQUFRdkMsS0FBSyxDQUFDLG9CQUFvQjRDO1FBRWxDLHdDQUF3QztRQUN4QyxJQUFJQSxhQUFhL0MsUUFBUSxDQUFDLFVBQVU7WUFDaEMsT0FBT2YscURBQVlBLENBQUMwQyxJQUFJLENBQUM7Z0JBQ3JCQyxTQUFTO2dCQUNUekIsT0FBTztZQUNYLEdBQUc7Z0JBQUUwQixRQUFRO1lBQUk7UUFDckI7UUFFQSxPQUFPNUMscURBQVlBLENBQUMwQyxJQUFJLENBQUM7WUFDckJDLFNBQVM7WUFDVHpCLE9BQU80QztRQUNYLEdBQUc7WUFBRWxCLFFBQVE7UUFBSTtJQUNyQjtBQUNKO0FBRU8sTUFBTW9CLE9BQU8vRCx3REFBYUEsQ0FBQztJQUFDO0lBQWU7Q0FBa0IsRUFBRW9DLGNBQWMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9oZWN1cHBzLWdpZnQtaGFtcGVyLy4vYXBwL2FwaS91cGxvYWQvcm91dGUudHM/YTg4ZCJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBwdXQgfSBmcm9tICdAdmVyY2VsL2Jsb2InO1xuaW1wb3J0IHsgTmV4dFJlcXVlc3QsIE5leHRSZXNwb25zZSB9IGZyb20gJ25leHQvc2VydmVyJztcbmltcG9ydCB7IHdpdGhBZG1pbkF1dGggfSBmcm9tICdAL2xpYi9yYmFjJztcblxuLy8gRmlsZSB0eXBlIGNvbmZpZ3VyYXRpb25zXG5jb25zdCBBTExPV0VEX0ZJTEVfVFlQRVMgPSB7XG4gICAgaW1hZ2VzOiBbJ2ltYWdlL2pwZWcnLCAnaW1hZ2UvanBnJywgJ2ltYWdlL3BuZycsICdpbWFnZS9naWYnLCAnaW1hZ2Uvd2VicCcsICdpbWFnZS9zdmcreG1sJ10sXG4gICAgdmlkZW9zOiBbJ3ZpZGVvL21wNCcsICd2aWRlby93ZWJtJywgJ3ZpZGVvL29nZycsICd2aWRlby9xdWlja3RpbWUnXSxcbiAgICBkb2N1bWVudHM6IFsnYXBwbGljYXRpb24vcGRmJywgJ2FwcGxpY2F0aW9uL3ppcCcsICdhcHBsaWNhdGlvbi94LXppcC1jb21wcmVzc2VkJ10sXG59O1xuXG4vLyBNYXhpbXVtIGZpbGUgc2l6ZXMgKGluIGJ5dGVzKVxuY29uc3QgTUFYX0ZJTEVfU0laRVMgPSB7XG4gICAgaW1hZ2VzOiAxMCAqIDEwMjQgKiAxMDI0LCAgICAgIC8vIDEwTUIgZm9yIGltYWdlc1xuICAgIHZpZGVvczogMTAwICogMTAyNCAqIDEwMjQsICAgICAvLyAxMDBNQiBmb3IgdmlkZW9zXG4gICAgZG9jdW1lbnRzOiA1MCAqIDEwMjQgKiAxMDI0LCAgIC8vIDUwTUIgZm9yIGRvY3VtZW50c1xufTtcblxuLy8gRm9sZGVyIHN0cnVjdHVyZSBmb3Igb3JnYW5pemVkIHN0b3JhZ2VcbmNvbnN0IFVQTE9BRF9GT0xERVJTID0ge1xuICAgIGltYWdlczogJ3Byb2R1Y3RzL2ltYWdlcycsXG4gICAgdmlkZW9zOiAncHJvZHVjdHMvdmlkZW9zJyxcbiAgICBkb2N1bWVudHM6ICdwcm9kdWN0cy9kaWdpdGFsJyxcbiAgICBvdGhlcjogJ3VwbG9hZHMnLFxufTtcblxuZnVuY3Rpb24gdmFsaWRhdGVGaWxlVHlwZShmaWxlOiBGaWxlLCBmb2xkZXI/OiBzdHJpbmcpOiB7IHZhbGlkOiBib29sZWFuOyBjYXRlZ29yeT86IHN0cmluZzsgZXJyb3I/OiBzdHJpbmcgfSB7XG4gICAgY29uc3QgZmlsZVR5cGUgPSBmaWxlLnR5cGU7XG5cbiAgICAvLyBEZXRlcm1pbmUgY2F0ZWdvcnkgYmFzZWQgb24gZm9sZGVyIG9yIGZpbGUgdHlwZVxuICAgIGxldCBjYXRlZ29yeToga2V5b2YgdHlwZW9mIEFMTE9XRURfRklMRV9UWVBFUyB8ICdvdGhlcicgPSAnb3RoZXInO1xuXG4gICAgaWYgKGZvbGRlcj8uaW5jbHVkZXMoJ2ltYWdlJykpIHtcbiAgICAgICAgY2F0ZWdvcnkgPSAnaW1hZ2VzJztcbiAgICB9IGVsc2UgaWYgKGZvbGRlcj8uaW5jbHVkZXMoJ3ZpZGVvJykpIHtcbiAgICAgICAgY2F0ZWdvcnkgPSAndmlkZW9zJztcbiAgICB9IGVsc2UgaWYgKGZvbGRlcj8uaW5jbHVkZXMoJ2RpZ2l0YWwnKSB8fCBmb2xkZXI/LmluY2x1ZGVzKCdkb2N1bWVudCcpKSB7XG4gICAgICAgIGNhdGVnb3J5ID0gJ2RvY3VtZW50cyc7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgLy8gQXV0by1kZXRlY3QgZnJvbSBNSU1FIHR5cGVcbiAgICAgICAgaWYgKEFMTE9XRURfRklMRV9UWVBFUy5pbWFnZXMuaW5jbHVkZXMoZmlsZVR5cGUpKSBjYXRlZ29yeSA9ICdpbWFnZXMnO1xuICAgICAgICBlbHNlIGlmIChBTExPV0VEX0ZJTEVfVFlQRVMudmlkZW9zLmluY2x1ZGVzKGZpbGVUeXBlKSkgY2F0ZWdvcnkgPSAndmlkZW9zJztcbiAgICAgICAgZWxzZSBpZiAoQUxMT1dFRF9GSUxFX1RZUEVTLmRvY3VtZW50cy5pbmNsdWRlcyhmaWxlVHlwZSkpIGNhdGVnb3J5ID0gJ2RvY3VtZW50cyc7XG4gICAgfVxuXG4gICAgaWYgKGNhdGVnb3J5ICE9PSAnb3RoZXInKSB7XG4gICAgICAgIGNvbnN0IGFsbG93ZWRUeXBlcyA9IEFMTE9XRURfRklMRV9UWVBFU1tjYXRlZ29yeV07XG4gICAgICAgIGlmICghYWxsb3dlZFR5cGVzLmluY2x1ZGVzKGZpbGVUeXBlKSkge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICB2YWxpZDogZmFsc2UsXG4gICAgICAgICAgICAgICAgZXJyb3I6IGBJbnZhbGlkIGZpbGUgdHlwZSBmb3IgJHtjYXRlZ29yeX0uIEFsbG93ZWQgdHlwZXM6ICR7YWxsb3dlZFR5cGVzLmpvaW4oJywgJyl9YFxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB7IHZhbGlkOiB0cnVlLCBjYXRlZ29yeSB9O1xufVxuXG5mdW5jdGlvbiB2YWxpZGF0ZUZpbGVTaXplKGZpbGU6IEZpbGUsIGNhdGVnb3J5OiBzdHJpbmcpOiB7IHZhbGlkOiBib29sZWFuOyBlcnJvcj86IHN0cmluZyB9IHtcbiAgICBjb25zdCBtYXhTaXplID0gTUFYX0ZJTEVfU0laRVNbY2F0ZWdvcnkgYXMga2V5b2YgdHlwZW9mIE1BWF9GSUxFX1NJWkVTXSB8fCBNQVhfRklMRV9TSVpFUy5kb2N1bWVudHM7XG5cbiAgICBpZiAoZmlsZS5zaXplID4gbWF4U2l6ZSkge1xuICAgICAgICBjb25zdCBtYXhTaXplTUIgPSAobWF4U2l6ZSAvICgxMDI0ICogMTAyNCkpLnRvRml4ZWQoMSk7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB2YWxpZDogZmFsc2UsXG4gICAgICAgICAgICBlcnJvcjogYEZpbGUgc2l6ZSBleGNlZWRzIG1heGltdW0gYWxsb3dlZCBzaXplIG9mICR7bWF4U2l6ZU1CfU1CIGZvciAke2NhdGVnb3J5fWBcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICByZXR1cm4geyB2YWxpZDogdHJ1ZSB9O1xufVxuXG5mdW5jdGlvbiBnZW5lcmF0ZUZpbGVOYW1lKG9yaWdpbmFsTmFtZTogc3RyaW5nLCBmb2xkZXI6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgY29uc3QgdGltZXN0YW1wID0gRGF0ZS5ub3coKTtcbiAgICBjb25zdCByYW5kb21TdHJpbmcgPSBNYXRoLnJhbmRvbSgpLnRvU3RyaW5nKDM2KS5zdWJzdHJpbmcoMiwgOCk7XG4gICAgY29uc3Qgc2FuaXRpemVkTmFtZSA9IG9yaWdpbmFsTmFtZS5yZXBsYWNlKC9bXmEtekEtWjAtOS4tXS9nLCAnXycpO1xuICAgIHJldHVybiBgJHtmb2xkZXJ9LyR7dGltZXN0YW1wfS0ke3JhbmRvbVN0cmluZ30tJHtzYW5pdGl6ZWROYW1lfWA7XG59XG5cbmNvbnN0IGhhbmRsZVVwbG9hZCA9IGFzeW5jIChyZXF1ZXN0OiBOZXh0UmVxdWVzdCk6IFByb21pc2U8TmV4dFJlc3BvbnNlPiA9PiB7XG4gICAgdHJ5IHtcbiAgICAgICAgY29uc3QgZm9ybURhdGEgPSBhd2FpdCByZXF1ZXN0LmZvcm1EYXRhKCk7XG4gICAgICAgIGNvbnN0IGZpbGUgPSBmb3JtRGF0YS5nZXQoJ2ZpbGUnKSBhcyBGaWxlIHwgbnVsbDtcbiAgICAgICAgY29uc3QgZm9sZGVyUGFyYW0gPSBmb3JtRGF0YS5nZXQoJ2ZvbGRlcicpIGFzIHN0cmluZyB8IG51bGw7XG5cbiAgICAgICAgaWYgKCFmaWxlKSB7XG4gICAgICAgICAgICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oe1xuICAgICAgICAgICAgICAgIG1lc3NhZ2U6ICdObyBmaWxlIGZvdW5kIGluIHRoZSByZXF1ZXN0JyxcbiAgICAgICAgICAgICAgICBlcnJvcjogJ0ZJTEVfTUlTU0lORydcbiAgICAgICAgICAgIH0sIHsgc3RhdHVzOiA0MDAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBWYWxpZGF0ZSBmaWxlIHR5cGVcbiAgICAgICAgY29uc3QgdHlwZVZhbGlkYXRpb24gPSB2YWxpZGF0ZUZpbGVUeXBlKGZpbGUsIGZvbGRlclBhcmFtIHx8IHVuZGVmaW5lZCk7XG4gICAgICAgIGlmICghdHlwZVZhbGlkYXRpb24udmFsaWQpIHtcbiAgICAgICAgICAgIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbih7XG4gICAgICAgICAgICAgICAgbWVzc2FnZTogdHlwZVZhbGlkYXRpb24uZXJyb3IgfHwgJ0ludmFsaWQgZmlsZSB0eXBlJyxcbiAgICAgICAgICAgICAgICBlcnJvcjogJ0lOVkFMSURfRklMRV9UWVBFJ1xuICAgICAgICAgICAgfSwgeyBzdGF0dXM6IDQwMCB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGNhdGVnb3J5ID0gdHlwZVZhbGlkYXRpb24uY2F0ZWdvcnkgfHwgJ290aGVyJztcblxuICAgICAgICAvLyBWYWxpZGF0ZSBmaWxlIHNpemVcbiAgICAgICAgY29uc3Qgc2l6ZVZhbGlkYXRpb24gPSB2YWxpZGF0ZUZpbGVTaXplKGZpbGUsIGNhdGVnb3J5KTtcbiAgICAgICAgaWYgKCFzaXplVmFsaWRhdGlvbi52YWxpZCkge1xuICAgICAgICAgICAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKHtcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiBzaXplVmFsaWRhdGlvbi5lcnJvciB8fCAnRmlsZSBzaXplIHRvbyBsYXJnZScsXG4gICAgICAgICAgICAgICAgZXJyb3I6ICdGSUxFX1RPT19MQVJHRSdcbiAgICAgICAgICAgIH0sIHsgc3RhdHVzOiA0MDAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBEZXRlcm1pbmUgdXBsb2FkIGZvbGRlclxuICAgICAgICBjb25zdCB1cGxvYWRGb2xkZXIgPSBmb2xkZXJQYXJhbSB8fCBVUExPQURfRk9MREVSU1tjYXRlZ29yeSBhcyBrZXlvZiB0eXBlb2YgVVBMT0FEX0ZPTERFUlNdIHx8IFVQTE9BRF9GT0xERVJTLm90aGVyO1xuICAgICAgICBjb25zdCBmaWxlTmFtZSA9IGdlbmVyYXRlRmlsZU5hbWUoZmlsZS5uYW1lLCB1cGxvYWRGb2xkZXIpO1xuXG4gICAgICAgIC8vIFVwbG9hZCB0byBWZXJjZWwgQmxvYlxuICAgICAgICBjb25zdCBibG9iID0gYXdhaXQgcHV0KGZpbGVOYW1lLCBmaWxlLCB7XG4gICAgICAgICAgICBhY2Nlc3M6ICdwdWJsaWMnLFxuICAgICAgICAgICAgdG9rZW46IHByb2Nlc3MuZW52LkJMT0JfUkVBRF9XUklURV9UT0tFTixcbiAgICAgICAgfSk7XG5cbiAgICAgICAgY29uc29sZS5sb2coYOKchSBGaWxlIHVwbG9hZGVkIHN1Y2Nlc3NmdWxseTogJHtibG9iLnVybH1gKTtcblxuICAgICAgICAvLyBSZXR1cm4gdGhlIFVSTCBhbmQgbWV0YWRhdGFcbiAgICAgICAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKHtcbiAgICAgICAgICAgIHVybDogYmxvYi51cmwsXG4gICAgICAgICAgICBmaWxlTmFtZTogZmlsZS5uYW1lLFxuICAgICAgICAgICAgc2l6ZTogZmlsZS5zaXplLFxuICAgICAgICAgICAgdHlwZTogZmlsZS50eXBlLFxuICAgICAgICAgICAgY2F0ZWdvcnk6IGNhdGVnb3J5LFxuICAgICAgICAgICAgdXBsb2FkZWRBdDogbmV3IERhdGUoKS50b0lTT1N0cmluZygpXG4gICAgICAgIH0pO1xuICAgIH0gY2F0Y2ggKGVycm9yOiB1bmtub3duKSB7XG4gICAgICAgIGNvbnN0IGVycm9yTWVzc2FnZSA9IGVycm9yIGluc3RhbmNlb2YgRXJyb3IgPyBlcnJvci5tZXNzYWdlIDogJ0FuIHVua25vd24gZXJyb3Igb2NjdXJyZWQnO1xuICAgICAgICBjb25zb2xlLmVycm9yKFwi4p2MIFVwbG9hZCBmYWlsZWQ6XCIsIGVycm9yTWVzc2FnZSk7XG5cbiAgICAgICAgLy8gQ2hlY2sgZm9yIHNwZWNpZmljIFZlcmNlbCBCbG9iIGVycm9yc1xuICAgICAgICBpZiAoZXJyb3JNZXNzYWdlLmluY2x1ZGVzKCd0b2tlbicpKSB7XG4gICAgICAgICAgICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oe1xuICAgICAgICAgICAgICAgIG1lc3NhZ2U6ICdTdG9yYWdlIGNvbmZpZ3VyYXRpb24gZXJyb3IuIFBsZWFzZSBjaGVjayBCTE9CX1JFQURfV1JJVEVfVE9LRU4uJyxcbiAgICAgICAgICAgICAgICBlcnJvcjogJ1NUT1JBR0VfQ09ORklHX0VSUk9SJ1xuICAgICAgICAgICAgfSwgeyBzdGF0dXM6IDUwMCB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbih7XG4gICAgICAgICAgICBtZXNzYWdlOiAnRmlsZSB1cGxvYWQgZmFpbGVkJyxcbiAgICAgICAgICAgIGVycm9yOiBlcnJvck1lc3NhZ2VcbiAgICAgICAgfSwgeyBzdGF0dXM6IDUwMCB9KTtcbiAgICB9XG59XG5cbmV4cG9ydCBjb25zdCBQT1NUID0gd2l0aEFkbWluQXV0aChbJ1NVUEVSX0FETUlOJywgJ1BST0RVQ1RfTUFOQUdFUiddLCBoYW5kbGVVcGxvYWQpO1xuIl0sIm5hbWVzIjpbInB1dCIsIk5leHRSZXNwb25zZSIsIndpdGhBZG1pbkF1dGgiLCJBTExPV0VEX0ZJTEVfVFlQRVMiLCJpbWFnZXMiLCJ2aWRlb3MiLCJkb2N1bWVudHMiLCJNQVhfRklMRV9TSVpFUyIsIlVQTE9BRF9GT0xERVJTIiwib3RoZXIiLCJ2YWxpZGF0ZUZpbGVUeXBlIiwiZmlsZSIsImZvbGRlciIsImZpbGVUeXBlIiwidHlwZSIsImNhdGVnb3J5IiwiaW5jbHVkZXMiLCJhbGxvd2VkVHlwZXMiLCJ2YWxpZCIsImVycm9yIiwiam9pbiIsInZhbGlkYXRlRmlsZVNpemUiLCJtYXhTaXplIiwic2l6ZSIsIm1heFNpemVNQiIsInRvRml4ZWQiLCJnZW5lcmF0ZUZpbGVOYW1lIiwib3JpZ2luYWxOYW1lIiwidGltZXN0YW1wIiwiRGF0ZSIsIm5vdyIsInJhbmRvbVN0cmluZyIsIk1hdGgiLCJyYW5kb20iLCJ0b1N0cmluZyIsInN1YnN0cmluZyIsInNhbml0aXplZE5hbWUiLCJyZXBsYWNlIiwiaGFuZGxlVXBsb2FkIiwicmVxdWVzdCIsImZvcm1EYXRhIiwiZ2V0IiwiZm9sZGVyUGFyYW0iLCJqc29uIiwibWVzc2FnZSIsInN0YXR1cyIsInR5cGVWYWxpZGF0aW9uIiwidW5kZWZpbmVkIiwic2l6ZVZhbGlkYXRpb24iLCJ1cGxvYWRGb2xkZXIiLCJmaWxlTmFtZSIsIm5hbWUiLCJibG9iIiwiYWNjZXNzIiwidG9rZW4iLCJwcm9jZXNzIiwiZW52IiwiQkxPQl9SRUFEX1dSSVRFX1RPS0VOIiwiY29uc29sZSIsImxvZyIsInVybCIsInVwbG9hZGVkQXQiLCJ0b0lTT1N0cmluZyIsImVycm9yTWVzc2FnZSIsIkVycm9yIiwiUE9TVCJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/./app/api/upload/route.ts\n");

/***/ }),

/***/ "(rsc)/./lib/auth.ts":
/*!*********************!*\
  !*** ./lib/auth.ts ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   comparePassword: () => (/* binding */ comparePassword),\n/* harmony export */   getUserIdFromRequest: () => (/* binding */ getUserIdFromRequest),\n/* harmony export */   hashPassword: () => (/* binding */ hashPassword),\n/* harmony export */   signRefreshToken: () => (/* binding */ signRefreshToken),\n/* harmony export */   signToken: () => (/* binding */ signToken),\n/* harmony export */   verifyToken: () => (/* binding */ verifyToken)\n/* harmony export */ });\n/* harmony import */ var jsonwebtoken__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! jsonwebtoken */ \"(rsc)/./node_modules/jsonwebtoken/index.js\");\n/* harmony import */ var jsonwebtoken__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(jsonwebtoken__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var bcrypt__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! bcrypt */ \"bcrypt\");\n/* harmony import */ var bcrypt__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(bcrypt__WEBPACK_IMPORTED_MODULE_1__);\n\n\nconst SALT_ROUNDS = 10;\nconst JWT_SECRET = process.env.JWT_SECRET;\nconst JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;\nconst hashPassword = (password)=>{\n    return bcrypt__WEBPACK_IMPORTED_MODULE_1___default().hash(password, SALT_ROUNDS);\n};\nconst comparePassword = (password, hash)=>{\n    return bcrypt__WEBPACK_IMPORTED_MODULE_1___default().compare(password, hash);\n};\nconst signToken = (payload)=>{\n    return jsonwebtoken__WEBPACK_IMPORTED_MODULE_0___default().sign(payload, JWT_SECRET, {\n        expiresIn: \"15m\"\n    });\n};\nconst signRefreshToken = (payload)=>{\n    return jsonwebtoken__WEBPACK_IMPORTED_MODULE_0___default().sign(payload, JWT_REFRESH_SECRET, {\n        expiresIn: \"7d\"\n    });\n};\nconst verifyToken = (token)=>{\n    try {\n        return jsonwebtoken__WEBPACK_IMPORTED_MODULE_0___default().verify(token, JWT_SECRET);\n    } catch (error) {\n        return null;\n    }\n};\nconst getUserIdFromRequest = (req)=>{\n    const authHeader = req.headers.get(\"authorization\");\n    if (!authHeader) return null;\n    const token = authHeader.split(\" \")[1];\n    if (!token) return null;\n    const decoded = verifyToken(token);\n    return decoded ? decoded.id : null;\n};\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9saWIvYXV0aC50cyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBQStCO0FBQ0g7QUFHNUIsTUFBTUUsY0FBYztBQUNwQixNQUFNQyxhQUFhQyxRQUFRQyxHQUFHLENBQUNGLFVBQVU7QUFDekMsTUFBTUcscUJBQXFCRixRQUFRQyxHQUFHLENBQUNDLGtCQUFrQjtBQUVsRCxNQUFNQyxlQUFlLENBQUNDO0lBQzNCLE9BQU9QLGtEQUFXLENBQUNPLFVBQVVOO0FBQy9CLEVBQUU7QUFFSyxNQUFNUSxrQkFBa0IsQ0FBQ0YsVUFBa0JDO0lBQ2hELE9BQU9SLHFEQUFjLENBQUNPLFVBQVVDO0FBQ2xDLEVBQUU7QUFPSyxNQUFNRyxZQUFZLENBQUNDO0lBQ3hCLE9BQU9iLHdEQUFRLENBQUNhLFNBQVNWLFlBQVk7UUFBRVksV0FBVztJQUFNO0FBQzFELEVBQUU7QUFFSyxNQUFNQyxtQkFBbUIsQ0FBQ0g7SUFDL0IsT0FBT2Isd0RBQVEsQ0FBQ2EsU0FBU1Asb0JBQW9CO1FBQUVTLFdBQVc7SUFBSztBQUNqRSxFQUFFO0FBRUssTUFBTUUsY0FBYyxDQUFDQztJQUMxQixJQUFJO1FBQ0YsT0FBT2xCLDBEQUFVLENBQUNrQixPQUFPZjtJQUMzQixFQUFFLE9BQU9pQixPQUFPO1FBQ2QsT0FBTztJQUNUO0FBQ0YsRUFBRTtBQUVLLE1BQU1DLHVCQUF1QixDQUFDQztJQUNqQyxNQUFNQyxhQUFhRCxJQUFJRSxPQUFPLENBQUNDLEdBQUcsQ0FBQztJQUNuQyxJQUFJLENBQUNGLFlBQVksT0FBTztJQUN4QixNQUFNTCxRQUFRSyxXQUFXRyxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUU7SUFDdEMsSUFBSSxDQUFDUixPQUFPLE9BQU87SUFDbkIsTUFBTVMsVUFBVVYsWUFBWUM7SUFDNUIsT0FBT1MsVUFBVUEsUUFBUUMsRUFBRSxHQUFHO0FBQ2xDLEVBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9oZWN1cHBzLWdpZnQtaGFtcGVyLy4vbGliL2F1dGgudHM/YmY3ZSJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgand0IGZyb20gJ2pzb253ZWJ0b2tlbic7XG5pbXBvcnQgYmNyeXB0IGZyb20gJ2JjcnlwdCc7XG5pbXBvcnQgeyBOZXh0UmVxdWVzdCB9IGZyb20gJ25leHQvc2VydmVyJztcblxuY29uc3QgU0FMVF9ST1VORFMgPSAxMDtcbmNvbnN0IEpXVF9TRUNSRVQgPSBwcm9jZXNzLmVudi5KV1RfU0VDUkVUITtcbmNvbnN0IEpXVF9SRUZSRVNIX1NFQ1JFVCA9IHByb2Nlc3MuZW52LkpXVF9SRUZSRVNIX1NFQ1JFVCE7XG5cbmV4cG9ydCBjb25zdCBoYXNoUGFzc3dvcmQgPSAocGFzc3dvcmQ6IHN0cmluZyk6IFByb21pc2U8c3RyaW5nPiA9PiB7XG4gIHJldHVybiBiY3J5cHQuaGFzaChwYXNzd29yZCwgU0FMVF9ST1VORFMpO1xufTtcblxuZXhwb3J0IGNvbnN0IGNvbXBhcmVQYXNzd29yZCA9IChwYXNzd29yZDogc3RyaW5nLCBoYXNoOiBzdHJpbmcpOiBQcm9taXNlPGJvb2xlYW4+ID0+IHtcbiAgcmV0dXJuIGJjcnlwdC5jb21wYXJlKHBhc3N3b3JkLCBoYXNoKTtcbn07XG5cbmV4cG9ydCBpbnRlcmZhY2UgVG9rZW5QYXlsb2FkIHtcbiAgaWQ6IHN0cmluZztcbiAgcm9sZTogJ1VTRVInIHwgJ0FETUlOJztcbn1cblxuZXhwb3J0IGNvbnN0IHNpZ25Ub2tlbiA9IChwYXlsb2FkOiBUb2tlblBheWxvYWQpOiBzdHJpbmcgPT4ge1xuICByZXR1cm4gand0LnNpZ24ocGF5bG9hZCwgSldUX1NFQ1JFVCwgeyBleHBpcmVzSW46ICcxNW0nIH0pO1xufTtcblxuZXhwb3J0IGNvbnN0IHNpZ25SZWZyZXNoVG9rZW4gPSAocGF5bG9hZDogVG9rZW5QYXlsb2FkKTogc3RyaW5nID0+IHtcbiAgcmV0dXJuIGp3dC5zaWduKHBheWxvYWQsIEpXVF9SRUZSRVNIX1NFQ1JFVCwgeyBleHBpcmVzSW46ICc3ZCcgfSk7XG59O1xuXG5leHBvcnQgY29uc3QgdmVyaWZ5VG9rZW4gPSAodG9rZW46IHN0cmluZyk6IFRva2VuUGF5bG9hZCB8IG51bGwgPT4ge1xuICB0cnkge1xuICAgIHJldHVybiBqd3QudmVyaWZ5KHRva2VuLCBKV1RfU0VDUkVUKSBhcyBUb2tlblBheWxvYWQ7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbn07XG5cbmV4cG9ydCBjb25zdCBnZXRVc2VySWRGcm9tUmVxdWVzdCA9IChyZXE6IE5leHRSZXF1ZXN0KTogc3RyaW5nIHwgbnVsbCA9PiB7XG4gICAgY29uc3QgYXV0aEhlYWRlciA9IHJlcS5oZWFkZXJzLmdldCgnYXV0aG9yaXphdGlvbicpO1xuICAgIGlmICghYXV0aEhlYWRlcikgcmV0dXJuIG51bGw7XG4gICAgY29uc3QgdG9rZW4gPSBhdXRoSGVhZGVyLnNwbGl0KCcgJylbMV07XG4gICAgaWYgKCF0b2tlbikgcmV0dXJuIG51bGw7XG4gICAgY29uc3QgZGVjb2RlZCA9IHZlcmlmeVRva2VuKHRva2VuKTtcbiAgICByZXR1cm4gZGVjb2RlZCA/IGRlY29kZWQuaWQgOiBudWxsO1xufVxuIl0sIm5hbWVzIjpbImp3dCIsImJjcnlwdCIsIlNBTFRfUk9VTkRTIiwiSldUX1NFQ1JFVCIsInByb2Nlc3MiLCJlbnYiLCJKV1RfUkVGUkVTSF9TRUNSRVQiLCJoYXNoUGFzc3dvcmQiLCJwYXNzd29yZCIsImhhc2giLCJjb21wYXJlUGFzc3dvcmQiLCJjb21wYXJlIiwic2lnblRva2VuIiwicGF5bG9hZCIsInNpZ24iLCJleHBpcmVzSW4iLCJzaWduUmVmcmVzaFRva2VuIiwidmVyaWZ5VG9rZW4iLCJ0b2tlbiIsInZlcmlmeSIsImVycm9yIiwiZ2V0VXNlcklkRnJvbVJlcXVlc3QiLCJyZXEiLCJhdXRoSGVhZGVyIiwiaGVhZGVycyIsImdldCIsInNwbGl0IiwiZGVjb2RlZCIsImlkIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./lib/auth.ts\n");

/***/ }),

/***/ "(rsc)/./lib/prisma.ts":
/*!***********************!*\
  !*** ./lib/prisma.ts ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__),\n/* harmony export */   prisma: () => (/* binding */ prisma)\n/* harmony export */ });\n/* harmony import */ var _prisma_client__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @prisma/client */ \"@prisma/client\");\n/* harmony import */ var _prisma_client__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_prisma_client__WEBPACK_IMPORTED_MODULE_0__);\n\n// FIX: Replaced 'global' with 'globalThis' to be compatible with modern TS/JS environments.\nconst prisma = globalThis.prisma || new _prisma_client__WEBPACK_IMPORTED_MODULE_0__.PrismaClient({\n    log:  true ? [\n        \"query\",\n        \"info\",\n        \"warn\",\n        \"error\"\n    ] : 0\n});\nif (true) globalThis.prisma = prisma;\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (prisma);\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9saWIvcHJpc21hLnRzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBOEM7QUFROUMsNEZBQTRGO0FBQ3JGLE1BQU1DLFNBQ1gsV0FBb0JBLE1BQU0sSUFDMUIsSUFBSUQsd0RBQVlBLENBQUM7SUFDZkcsS0FBS0MsS0FBeUIsR0FBZ0I7UUFBQztRQUFTO1FBQVE7UUFBUTtLQUFRLEdBQUcsQ0FBUztBQUM5RixHQUFHO0FBRUwsSUFBSUEsSUFBeUIsRUFBYyxXQUFvQkgsTUFBTSxHQUFHQTtBQUV4RSxpRUFBZUEsTUFBTUEsRUFBQyIsInNvdXJjZXMiOlsid2VicGFjazovL2hlY3VwcHMtZ2lmdC1oYW1wZXIvLi9saWIvcHJpc21hLnRzPzk4MjIiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgUHJpc21hQ2xpZW50IH0gZnJvbSAnQHByaXNtYS9jbGllbnQnO1xuXG5kZWNsYXJlIGdsb2JhbCB7XG4gIC8vIGFsbG93IGdsb2JhbCBgdmFyYCBkZWNsYXJhdGlvbnNcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXZhclxuICB2YXIgcHJpc21hOiBQcmlzbWFDbGllbnQgfCB1bmRlZmluZWQ7XG59XG5cbi8vIEZJWDogUmVwbGFjZWQgJ2dsb2JhbCcgd2l0aCAnZ2xvYmFsVGhpcycgdG8gYmUgY29tcGF0aWJsZSB3aXRoIG1vZGVybiBUUy9KUyBlbnZpcm9ubWVudHMuXG5leHBvcnQgY29uc3QgcHJpc21hID1cbiAgKGdsb2JhbFRoaXMgYXMgYW55KS5wcmlzbWEgfHxcbiAgbmV3IFByaXNtYUNsaWVudCh7XG4gICAgbG9nOiBwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gJ2RldmVsb3BtZW50JyA/IFsncXVlcnknLCAnaW5mbycsICd3YXJuJywgJ2Vycm9yJ10gOiBbJ2Vycm9yJ10sXG4gIH0pO1xuXG5pZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykgKGdsb2JhbFRoaXMgYXMgYW55KS5wcmlzbWEgPSBwcmlzbWE7XG5cbmV4cG9ydCBkZWZhdWx0IHByaXNtYTtcbiJdLCJuYW1lcyI6WyJQcmlzbWFDbGllbnQiLCJwcmlzbWEiLCJnbG9iYWxUaGlzIiwibG9nIiwicHJvY2VzcyJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/./lib/prisma.ts\n");

/***/ }),

/***/ "(rsc)/./lib/rbac.ts":
/*!*********************!*\
  !*** ./lib/rbac.ts ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   withAdminAuth: () => (/* binding */ withAdminAuth)\n/* harmony export */ });\n/* harmony import */ var next_server__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/server */ \"(rsc)/./node_modules/next/dist/api/server.js\");\n/* harmony import */ var _auth__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./auth */ \"(rsc)/./lib/auth.ts\");\n/* harmony import */ var _prisma__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./prisma */ \"(rsc)/./lib/prisma.ts\");\n\n\n\nconst withAdminAuth = (allowedRoles, handler)=>{\n    return async (req, params)=>{\n        const authHeader = req.headers.get(\"authorization\");\n        if (!authHeader) {\n            return new next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse(JSON.stringify({\n                message: \"Unauthorized: No token provided\"\n            }), {\n                status: 401\n            });\n        }\n        const token = authHeader.split(\" \")[1];\n        if (!token) {\n            return new next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse(JSON.stringify({\n                message: \"Unauthorized: Malformed token\"\n            }), {\n                status: 401\n            });\n        }\n        const decoded = (0,_auth__WEBPACK_IMPORTED_MODULE_1__.verifyToken)(token);\n        if (!decoded || decoded.role !== \"ADMIN\") {\n            return new next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse(JSON.stringify({\n                message: \"Forbidden: Invalid token or role\"\n            }), {\n                status: 403\n            });\n        }\n        // In a real multi-admin system, you would check `decoded.id` against the Admin table in the DB\n        // to get the specific roles and check if `allowedRoles` includes any of them.\n        // For this example, we'll assume any admin can do anything for simplicity.\n        const admin = await _prisma__WEBPACK_IMPORTED_MODULE_2__.prisma.admin.findUnique({\n            where: {\n                id: decoded.id\n            }\n        });\n        if (!admin) {\n            return new next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse(JSON.stringify({\n                message: \"Forbidden: Admin not found\"\n            }), {\n                status: 403\n            });\n        }\n        // Simple check: if SUPER_ADMIN is required, user must be a master admin.\n        if (allowedRoles.includes(\"SUPER_ADMIN\") && !admin.isMaster) {\n            return new next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse(JSON.stringify({\n                message: \"Forbidden: Super Admin role required\"\n            }), {\n                status: 403\n            });\n        }\n        return handler(req, params, decoded);\n    };\n};\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9saWIvcmJhYy50cyIsIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQXdEO0FBQ0w7QUFDakI7QUFNM0IsTUFBTUcsZ0JBQWdCLENBQUNDLGNBQTJCQztJQUN2RCxPQUFPLE9BQU9DLEtBQWtCQztRQUM5QixNQUFNQyxhQUFhRixJQUFJRyxPQUFPLENBQUNDLEdBQUcsQ0FBQztRQUNuQyxJQUFJLENBQUNGLFlBQVk7WUFDZixPQUFPLElBQUlSLHFEQUFZQSxDQUFDVyxLQUFLQyxTQUFTLENBQUM7Z0JBQUVDLFNBQVM7WUFBa0MsSUFBSTtnQkFBRUMsUUFBUTtZQUFJO1FBQ3hHO1FBQ0EsTUFBTUMsUUFBUVAsV0FBV1EsS0FBSyxDQUFDLElBQUksQ0FBQyxFQUFFO1FBQ3RDLElBQUksQ0FBQ0QsT0FBTztZQUNWLE9BQU8sSUFBSWYscURBQVlBLENBQUNXLEtBQUtDLFNBQVMsQ0FBQztnQkFBRUMsU0FBUztZQUFnQyxJQUFJO2dCQUFFQyxRQUFRO1lBQUk7UUFDdEc7UUFFQSxNQUFNRyxVQUFVaEIsa0RBQVdBLENBQUNjO1FBQzVCLElBQUksQ0FBQ0UsV0FBV0EsUUFBUUMsSUFBSSxLQUFLLFNBQVM7WUFDeEMsT0FBTyxJQUFJbEIscURBQVlBLENBQUNXLEtBQUtDLFNBQVMsQ0FBQztnQkFBRUMsU0FBUztZQUFtQyxJQUFJO2dCQUFFQyxRQUFRO1lBQUk7UUFDekc7UUFFQSwrRkFBK0Y7UUFDL0YsOEVBQThFO1FBQzlFLDJFQUEyRTtRQUMzRSxNQUFNSyxRQUFRLE1BQU1qQiwyQ0FBTUEsQ0FBQ2lCLEtBQUssQ0FBQ0MsVUFBVSxDQUFDO1lBQUVDLE9BQU87Z0JBQUVDLElBQUlMLFFBQVFLLEVBQUU7WUFBQztRQUFDO1FBQ3ZFLElBQUcsQ0FBQ0gsT0FBTztZQUNQLE9BQU8sSUFBSW5CLHFEQUFZQSxDQUFDVyxLQUFLQyxTQUFTLENBQUM7Z0JBQUVDLFNBQVM7WUFBNkIsSUFBSTtnQkFBRUMsUUFBUTtZQUFJO1FBQ3JHO1FBQ0EseUVBQXlFO1FBQ3pFLElBQUdWLGFBQWFtQixRQUFRLENBQUMsa0JBQWtCLENBQUNKLE1BQU1LLFFBQVEsRUFBRTtZQUN4RCxPQUFPLElBQUl4QixxREFBWUEsQ0FBQ1csS0FBS0MsU0FBUyxDQUFDO2dCQUFFQyxTQUFTO1lBQXVDLElBQUk7Z0JBQUVDLFFBQVE7WUFBSTtRQUMvRztRQUVBLE9BQU9ULFFBQVFDLEtBQUtDLFFBQVFVO0lBQzlCO0FBQ0YsRUFBRSIsInNvdXJjZXMiOlsid2VicGFjazovL2hlY3VwcHMtZ2lmdC1oYW1wZXIvLi9saWIvcmJhYy50cz9jNjFjIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE5leHRSZXF1ZXN0LCBOZXh0UmVzcG9uc2UgfSBmcm9tICduZXh0L3NlcnZlcic7XG5pbXBvcnQgeyB2ZXJpZnlUb2tlbiwgVG9rZW5QYXlsb2FkIH0gZnJvbSAnLi9hdXRoJztcbmltcG9ydCB7IHByaXNtYSB9IGZyb20gJy4vcHJpc21hJztcblxudHlwZSBBZG1pblJvbGUgPSAnU1VQRVJfQURNSU4nIHwgJ1BST0RVQ1RfTUFOQUdFUicgfCAnT1JERVJfTUFOQUdFUic7XG5cbnR5cGUgSGFuZGxlciA9IChyZXE6IE5leHRSZXF1ZXN0LCBwYXJhbXM6IHsgW2tleTogc3RyaW5nXTogYW55IH0sIGRlY29kZWRUb2tlbjogVG9rZW5QYXlsb2FkKSA9PiBQcm9taXNlPE5leHRSZXNwb25zZT47XG5cbmV4cG9ydCBjb25zdCB3aXRoQWRtaW5BdXRoID0gKGFsbG93ZWRSb2xlczogQWRtaW5Sb2xlW10sIGhhbmRsZXI6IEhhbmRsZXIpOiAoKHJlcTogTmV4dFJlcXVlc3QsIHBhcmFtczogeyBba2V5OiBzdHJpbmddOiBhbnkgfSkgPT4gUHJvbWlzZTxOZXh0UmVzcG9uc2U+KSA9PiB7XG4gIHJldHVybiBhc3luYyAocmVxOiBOZXh0UmVxdWVzdCwgcGFyYW1zOiB7IFtrZXk6IHN0cmluZ106IGFueSB9KSA9PiB7XG4gICAgY29uc3QgYXV0aEhlYWRlciA9IHJlcS5oZWFkZXJzLmdldCgnYXV0aG9yaXphdGlvbicpO1xuICAgIGlmICghYXV0aEhlYWRlcikge1xuICAgICAgcmV0dXJuIG5ldyBOZXh0UmVzcG9uc2UoSlNPTi5zdHJpbmdpZnkoeyBtZXNzYWdlOiAnVW5hdXRob3JpemVkOiBObyB0b2tlbiBwcm92aWRlZCcgfSksIHsgc3RhdHVzOiA0MDEgfSk7XG4gICAgfVxuICAgIGNvbnN0IHRva2VuID0gYXV0aEhlYWRlci5zcGxpdCgnICcpWzFdO1xuICAgIGlmICghdG9rZW4pIHtcbiAgICAgIHJldHVybiBuZXcgTmV4dFJlc3BvbnNlKEpTT04uc3RyaW5naWZ5KHsgbWVzc2FnZTogJ1VuYXV0aG9yaXplZDogTWFsZm9ybWVkIHRva2VuJyB9KSwgeyBzdGF0dXM6IDQwMSB9KTtcbiAgICB9XG5cbiAgICBjb25zdCBkZWNvZGVkID0gdmVyaWZ5VG9rZW4odG9rZW4pO1xuICAgIGlmICghZGVjb2RlZCB8fCBkZWNvZGVkLnJvbGUgIT09ICdBRE1JTicpIHtcbiAgICAgIHJldHVybiBuZXcgTmV4dFJlc3BvbnNlKEpTT04uc3RyaW5naWZ5KHsgbWVzc2FnZTogJ0ZvcmJpZGRlbjogSW52YWxpZCB0b2tlbiBvciByb2xlJyB9KSwgeyBzdGF0dXM6IDQwMyB9KTtcbiAgICB9XG4gICAgXG4gICAgLy8gSW4gYSByZWFsIG11bHRpLWFkbWluIHN5c3RlbSwgeW91IHdvdWxkIGNoZWNrIGBkZWNvZGVkLmlkYCBhZ2FpbnN0IHRoZSBBZG1pbiB0YWJsZSBpbiB0aGUgREJcbiAgICAvLyB0byBnZXQgdGhlIHNwZWNpZmljIHJvbGVzIGFuZCBjaGVjayBpZiBgYWxsb3dlZFJvbGVzYCBpbmNsdWRlcyBhbnkgb2YgdGhlbS5cbiAgICAvLyBGb3IgdGhpcyBleGFtcGxlLCB3ZSdsbCBhc3N1bWUgYW55IGFkbWluIGNhbiBkbyBhbnl0aGluZyBmb3Igc2ltcGxpY2l0eS5cbiAgICBjb25zdCBhZG1pbiA9IGF3YWl0IHByaXNtYS5hZG1pbi5maW5kVW5pcXVlKHsgd2hlcmU6IHsgaWQ6IGRlY29kZWQuaWQgfX0pO1xuICAgIGlmKCFhZG1pbikge1xuICAgICAgICByZXR1cm4gbmV3IE5leHRSZXNwb25zZShKU09OLnN0cmluZ2lmeSh7IG1lc3NhZ2U6ICdGb3JiaWRkZW46IEFkbWluIG5vdCBmb3VuZCcgfSksIHsgc3RhdHVzOiA0MDMgfSk7XG4gICAgfVxuICAgIC8vIFNpbXBsZSBjaGVjazogaWYgU1VQRVJfQURNSU4gaXMgcmVxdWlyZWQsIHVzZXIgbXVzdCBiZSBhIG1hc3RlciBhZG1pbi5cbiAgICBpZihhbGxvd2VkUm9sZXMuaW5jbHVkZXMoJ1NVUEVSX0FETUlOJykgJiYgIWFkbWluLmlzTWFzdGVyKSB7XG4gICAgICAgIHJldHVybiBuZXcgTmV4dFJlc3BvbnNlKEpTT04uc3RyaW5naWZ5KHsgbWVzc2FnZTogJ0ZvcmJpZGRlbjogU3VwZXIgQWRtaW4gcm9sZSByZXF1aXJlZCcgfSksIHsgc3RhdHVzOiA0MDMgfSk7XG4gICAgfVxuICAgIFxuICAgIHJldHVybiBoYW5kbGVyKHJlcSwgcGFyYW1zLCBkZWNvZGVkKTtcbiAgfTtcbn07XG4iXSwibmFtZXMiOlsiTmV4dFJlc3BvbnNlIiwidmVyaWZ5VG9rZW4iLCJwcmlzbWEiLCJ3aXRoQWRtaW5BdXRoIiwiYWxsb3dlZFJvbGVzIiwiaGFuZGxlciIsInJlcSIsInBhcmFtcyIsImF1dGhIZWFkZXIiLCJoZWFkZXJzIiwiZ2V0IiwiSlNPTiIsInN0cmluZ2lmeSIsIm1lc3NhZ2UiLCJzdGF0dXMiLCJ0b2tlbiIsInNwbGl0IiwiZGVjb2RlZCIsInJvbGUiLCJhZG1pbiIsImZpbmRVbmlxdWUiLCJ3aGVyZSIsImlkIiwiaW5jbHVkZXMiLCJpc01hc3RlciJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/./lib/rbac.ts\n");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next","vendor-chunks/undici","vendor-chunks/semver","vendor-chunks/@fastify","vendor-chunks/jsonwebtoken","vendor-chunks/jws","vendor-chunks/retry","vendor-chunks/@vercel","vendor-chunks/ecdsa-sig-formatter","vendor-chunks/is-plain-object","vendor-chunks/safe-buffer","vendor-chunks/ms","vendor-chunks/lodash.once","vendor-chunks/lodash.isstring","vendor-chunks/lodash.isplainobject","vendor-chunks/lodash.isnumber","vendor-chunks/lodash.isinteger","vendor-chunks/lodash.isboolean","vendor-chunks/lodash.includes","vendor-chunks/jwa","vendor-chunks/is-buffer","vendor-chunks/bytes","vendor-chunks/buffer-equal-constant-time","vendor-chunks/async-retry"], () => (__webpack_exec__("(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fupload%2Froute&page=%2Fapi%2Fupload%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fupload%2Froute.ts&appDir=C%3A%5CUsers%5Cadity%5CDownloads%5Checupps%5CHEcUPPS-main%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5Cadity%5CDownloads%5Checupps%5CHEcUPPS-main&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!")));
module.exports = __webpack_exports__;

})();