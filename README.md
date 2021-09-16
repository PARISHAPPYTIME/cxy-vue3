Simple options: # 基础配置
--bundle Bundle all dependencies into the output files #打包所有的依赖进输出文件
--define:K=V Substitute K with V while parsing # 在解析代码的时候用 V 替换 K
--external:M Exclude module M from the bundle (can use * wildcards) # 从模块中排除 M（可以使用*作为通配符）
--format=... Output format (iife | cjs | esm, no default when not
bundling, otherwise default is iife when platform
is browser and cjs when platform is node) # 输出的文件格式（iife | cjs | esm,不打包不默认，浏览器默认 iife,node 环境默认 cjs）
--loader:X=L Use loader L to load file extension X, where L is
one of: js | jsx | ts | tsx | json | text | base64 |
file | dataurl | binary #当 L 是以下文件中的一个（js | jsx | ts | tsx | json | text | base64 |file | dataurl | binary）使用 loader L 来进行拓展 X
--minify Minify the output (sets all --minify-_ flags) # 代码压缩（设置所有使用 --minify-_）
--outdir=... The output directory (for multiple entry points) # 文件输出目录（对于多个入口点）
--outfile=... The output file (for one entry point) #文件输出名称（对于单个入口点）
--platform=... Platform target (browser | node | neutral,
default browser) # 编译的环境 （browser | node | neutral, 默认浏览器）
--serve=... Start a local HTTP server on this host:port for outputs # 在 host:port 的基础上开启一个 http 服务来输出文件
--sourcemap Emit a source map # 输出 source map 文件
--splitting Enable code splitting (currently only for esm) # 代码分割(当前仅限 esm 模式)
--target=... Environment target (e.g. es2017, chrome58, firefox57,
safari11, edge16, node10, default esnext) # 代码打包结果的环境（e.g. es2017, chrome58, firefox57, safari11, edge16, node10, 默认 esnext 语法）
--watch Watch mode: rebuild on file system changes # 监听模式： 改变文件后重写编译

Advanced options: # 高级配置
--allow-overwrite Allow output files to overwrite input files # 是否允许输出的文件覆盖源文件
--asset-names=... Path template to use for "file" loader files
(default "[name]-[hash]") # 静态资源输出的文件名称（默认是名字加上 hash）
--banner:T=... Text to be prepended to each output file of type T
where T is one of: css | js # 在输出的 js, css 文件中添加一段文本
--charset=utf8 Do not escape UTF-8 code points # 代码字符集，不要做其他的转换，默认（utf-8）
--chunk-names=... Path template to use for code splitting chunks
(default "[name]-[hash]") # 分割 chunks 的名称（默认名字+hash）
--color=... Force use of color terminal escapes (true | false) # 终端输出是否带颜色
--entry-names=... Path template to use for entry point output paths
(default "[dir]/[name]", can also use "[hash]") # 入口点输出路径的路径模板(默认 dir/hash， 也可以是 hash)
--footer:T=... Text to be appended to each output file of type T
where T is one of: css | js # # 在输出的 js, css 文件中结尾添加一段文本
--global-name=... The name of the global for the IIFE format # 输出文件类型是 iife 的全局名称
--inject:F Import the file F into all input files and
automatically replace matching globals with imports # 将文件 F 导入所有输入文件，并用导入自动替换匹配的全局变量
--jsx-factory=... What to use for JSX instead of React.createElement # JSX 使用什么代替 React.createElement
--jsx-fragment=... What to use for JSX instead of React.Fragment # jsx 使用什么代替 React.Fragment
--jsx=... Set to "preserve" to disable transforming JSX to JS #设置为“preserve”以禁用将 JSX 转换为 JS
--keep-names Preserve "name" on functions and classes # 保留函数和类的名称
--legal-comments=... Where to place license comments (none | inline |
eof | linked | external, default eof when bundling
and inline otherwise) # 注释采用怎么的形式保留
--log-level=... Disable logging (verbose | debug | info | warning |
error | silent, default info) # 控制台 log 输出的形式
--log-limit=... Maximum message count or 0 to disable (default 10) #最大的消息数量
--main-fields=... Override the main file order in package.json
(default "browser,module,main" when platform is
browser and "main,module" when platform is node) # 覆盖 package.json 中的字段，根据不同的平台有不一样的覆盖方式
--metafile=... Write metadata about the build to a JSON file # 将元数据写入编译好的 json 文件中
--minify-whitespace Remove whitespace in output files #去除输出文件的空格
--minify-identifiers Shorten identifiers in output files #缩短输出文件中的标识符
--minify-syntax Use equivalent but shorter syntax in output files #在输出文件中使用等效但较短的语法
--out-extension:.js=.mjs Use a custom output extension instead of ".js" #使用自定义的后缀名来代替输出的 js 后缀
--outbase=... The base path used to determine entry point output
paths (for multiple entry points) # 输出文件的根路径（对于多入口点）
--preserve-symlinks Disable symlink resolution for module lookup #禁用模块查找的符号链接解析
--public-path=... Set the base URL for the "file" loader # 设置加载 loader 的跟路径
--pure:N Mark the name N as a pure function for tree shaking # 将标记名字为 N 的纯函数用于 tree shaking
--resolve-extensions=... A comma-separated list of implicit extensions
(default ".tsx,.ts,.jsx,.js,.css,.json") # 以逗号分隔的隐式扩展列表
--servedir=... What to serve in addition to generated output files # 服务额外生成文件的输出目录
--source-root=... Sets the "sourceRoot" field in generated source maps # 在生成的源映射中设置“sourceRoot”字段
--sourcefile=... Set the source file for the source map (for stdin) #设置源映射的源文件（对于 stdin）
--sourcemap=external Do not link to the source map with a comment # 注释不需要链接到 source map
--sourcemap=inline Emit the source map with an inline data URL #使用内联数据 URL 生成源映射
--sources-content=false Omit "sourcesContent" in generated source maps # 在生成的源映射中省略“sourcesContent
--tree-shaking=... Set to "ignore-annotations" to work with packages
that have incorrect tree-shaking annotations #设置为“忽略注释”以处理具有不正确的 tree-shaking 注释的包
--tsconfig=... Use this tsconfig.json file instead of other ones # 使用此 tsconfig.json 文件而不是其他文件
--version Print the current version (0.12.16) and exit #打印当前的版本并且退出
