const esbuild = require("esbuild");
const serve = require("koa-static");
const Koa = require("koa");
const path = require("path");
const fse = require("fs-extra");
const { readFileSync } = require("fs");
const app = new Koa();
const { lessLoader } = require('esbuild-plugin-less')

// 启动编译好后自动刷新浏览器
const livereload = require("livereload");
const lrserver = livereload.createServer();
lrserver.watch(__dirname + "/dist");

// 使用静态服务
app.use(serve(path.join(__dirname + "/dist")));
const html = readFileSync("./index.html", "utf8");

esbuild
	.build({
		entryPoints: ["index.ts"],
		sourcemap: true,
		bundle: true,
		outfile: "dist/index.js",
        plugins: [lessLoader()],
		// 启动轮询的监听模式
		watch: {
			onRebuild(error, result) {
				if (error) console.error("watch build failed:", error);
				else {
					// 这里来自动打开浏览器并且更新浏览器
					console.log("\x1B[36m%s\x1B[39m", "watch build succeeded");
				}
			},
		},
	})
	.then(async (res) => {
		const fileName = path.join(__dirname + "/dist/index.html");
		await fse.ensureFile(fileName);
		await fse.writeFileSync(fileName, html);
		app.listen(3000, () => {
			console.log(`> Local:    http://localhost:3000/`);
		});
	});
